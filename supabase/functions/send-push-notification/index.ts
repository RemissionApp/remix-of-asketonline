import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Функция для получения OAuth токена для FCM V1 API
async function getAccessToken(serviceAccount: any): Promise<string> {
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const jwtPayload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  // Создаем JWT
  const encoder = new TextEncoder()
  const headerB64 = btoa(JSON.stringify(jwtHeader)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const payloadB64 = btoa(JSON.stringify(jwtPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  
  const signatureInput = `${headerB64}.${payloadB64}`
  
  // Импортируем приватный ключ
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    encoder.encode(serviceAccount.private_key.replace(/\\n/g, '\n')),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )

  // Создаем подпись
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    encoder.encode(signatureInput)
  )

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  const jwt = `${signatureInput}.${signatureB64}`

  // Получаем access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  })

  const tokenData = await tokenResponse.json()
  
  if (!tokenResponse.ok) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`)
  }

  return tokenData.access_token
}

interface NotificationPayload {
  userId?: string;
  userIds?: string[];
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: string;
  image?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

interface PushSubscription {
  user_id: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  settings: {
    dailyReminder: boolean;
    pactUpdates: boolean;
    meditation: boolean;
    universeMessages: boolean;
    achievements: boolean;
    subscription: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: NotificationPayload = await req.json()
    
    if (!payload.type || !payload.title || !payload.body) {
      throw new Error('Missing required fields: type, title, body')
    }

    // Получаем Firebase Service Account из секретов
    const firebaseServiceAccount = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
    if (!firebaseServiceAccount) {
      throw new Error('Firebase Service Account not configured')
    }

    const serviceAccount = JSON.parse(firebaseServiceAccount)
    
    // Получаем OAuth токен для FCM V1 API
    const accessToken = await getAccessToken(serviceAccount)

    // Определяем пользователей для отправки
    let targetUserIds: string[] = []
    if (payload.userId) {
      targetUserIds = [payload.userId]
    } else if (payload.userIds) {
      targetUserIds = payload.userIds
    } else {
      throw new Error('Either userId or userIds must be specified')
    }

    // Получаем подписки пользователей
    const { data: subscriptions, error: fetchError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .in('user_id', targetUserIds)
      .eq('is_active', true)

    if (fetchError) {
      throw new Error(`Failed to fetch subscriptions: ${fetchError.message}`)
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No active subscriptions found',
        sent: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Фильтруем подписки по настройкам уведомлений
    const filteredSubscriptions = subscriptions.filter((sub: PushSubscription) => {
      const settings = sub.settings
      switch (payload.type) {
        case 'daily_reminder':
          return settings.dailyReminder
        case 'pact_start':
        case 'pact_complete':
          return settings.pactUpdates
        case 'meditation_reminder':
          return settings.meditation
        case 'universe_message':
          return settings.universeMessages
        case 'achievement':
          return settings.achievements
        case 'subscription_reminder':
          return settings.subscription
        case 'test':
          return true // Тестовые уведомления всегда отправляются
        default:
          return true
      }
    })

    // Отправляем push-уведомления через FCM V1 API
    const results = []
    for (const subscription of filteredSubscriptions) {
      try {
        // Извлекаем FCM токен из endpoint
        let fcmToken = null
        if (subscription.subscription.endpoint.includes('fcm.googleapis.com')) {
          const urlParts = subscription.subscription.endpoint.split('/')
          fcmToken = urlParts[urlParts.length - 1]
        }

        if (!fcmToken) {
          throw new Error('Invalid FCM token')
        }

        // Формируем payload для FCM V1 API
        const fcmMessage = {
          message: {
            token: fcmToken,
            notification: {
              title: payload.title,
              body: payload.body,
              image: payload.image
            },
            data: {
              type: payload.type,
              userId: subscription.user_id,
              url: getNotificationUrl(payload.type, payload.data),
              ...payload.data ? Object.fromEntries(
                Object.entries(payload.data).map(([k, v]) => [k, String(v)])
              ) : {}
            },
            webpush: {
              notification: {
                icon: payload.icon || '/icon-192.png',
                badge: payload.badge || '/icon-72.png',
                requireInteraction: payload.requireInteraction || false,
                silent: payload.silent || false,
                click_action: getNotificationUrl(payload.type, payload.data)
              }
            }
          }
        }

        // Отправляем через FCM V1 API
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fcmMessage),
        })

        const result = await response.json()
        results.push({
          userId: subscription.user_id,
          success: response.ok,
          result: result,
        })

        console.log(`Push notification sent to ${subscription.user_id}:`, result)
      } catch (error) {
        console.error(`Failed to send notification to ${subscription.user_id}:`, error)
        results.push({
          userId: subscription.user_id,
          success: false,
          error: error.message,
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return new Response(JSON.stringify({
      success: true,
      sent: successCount,
      failed: failureCount,
      results: results,
      message: `Sent ${successCount} notifications, ${failureCount} failed`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Push notification error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})

// Функция для определения URL для перехода по уведомлению
function getNotificationUrl(type: string, data?: Record<string, any>): string {
  const baseUrl = 'https://asket.online'
  
  switch (type) {
    case 'daily_reminder':
    case 'pact_start':
    case 'pact_complete':
      return data?.pactId ? `${baseUrl}/main?pact=${data.pactId}` : `${baseUrl}/main`
    case 'meditation_reminder':
      return `${baseUrl}/meditation`
    case 'universe_message':
      return `${baseUrl}/universe`
    case 'achievement':
      return `${baseUrl}/profile`
    case 'subscription_reminder':
      return `${baseUrl}/comparison`
    case 'test':
      return `${baseUrl}/profile`
    default:
      return baseUrl
  }
}