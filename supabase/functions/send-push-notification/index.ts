import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Получаем Firebase Server Key из секретов
    const firebaseServerKey = Deno.env.get('FIREBASE_SERVER_KEY')
    if (!firebaseServerKey) {
      throw new Error('Firebase Server Key not configured')
    }

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

    // Отправляем push-уведомления
    const results = []
    for (const subscription of filteredSubscriptions) {
      try {
        const pushPayload = {
          to: subscription.subscription.endpoint.includes('fcm.googleapis.com') 
            ? subscription.subscription.endpoint.split('/').pop()
            : null,
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/icon-192.png',
            badge: payload.badge || '/icon-72.png',
            image: payload.image,
            requireInteraction: payload.requireInteraction || false,
            silent: payload.silent || false,
            data: {
              ...payload.data,
              type: payload.type,
              userId: subscription.user_id,
              url: getNotificationUrl(payload.type, payload.data),
            },
            click_action: getNotificationUrl(payload.type, payload.data),
          },
          data: {
            type: payload.type,
            userId: subscription.user_id,
            ...payload.data,
          }
        }

        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': `key=${firebaseServerKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pushPayload),
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