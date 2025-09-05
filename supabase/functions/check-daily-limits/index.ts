import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DailyLimitsData {
  universe_questions_count: number;
  voice_calls_count: number;
  meditations_count: number;
  cosmic_missions_count: number;
}

interface LimitsResponse {
  universe_questions: { used: number; limit: number; canUse: boolean };
  voice_calls: { used: number; limit: number; canUse: boolean };
  meditations: { used: number; limit: number; canUse: boolean };
  cosmic_missions: { used: number; limit: number; canUse: boolean };
  pacts: { used: number; limit: number; canUse: boolean };
  isPro: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    // Get user profile to check PRO status
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Check PRO status from subscriptions
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('is_pro')
      .eq('user_id', user.id)
      .single()

    const isPro = subscription?.is_pro || false

    // Get today's usage
    const today = new Date().toISOString().split('T')[0]
    const { data: todayLimits } = await supabaseClient
      .from('daily_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    const usage: DailyLimitsData = todayLimits || {
      universe_questions_count: 0,
      voice_calls_count: 0,
      meditations_count: 0,
      cosmic_missions_count: 0,
    }

    // Count active pacts
    const { data: activePacts } = await supabaseClient
      .from('pacts')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    const activePactsCount = activePacts?.length || 0

    // Define limits based on subscription
    const limits = isPro ? {
      universe_questions: 3,
      voice_calls: 999, // Unlimited for PRO
      meditations: 999, // Unlimited for PRO
      cosmic_missions: 999, // Unlimited for PRO
      pacts: 5,
    } : {
      universe_questions: 1,
      voice_calls: 1,
      meditations: 1,
      cosmic_missions: 1,
      pacts: 1,
    }

    const response: LimitsResponse = {
      universe_questions: {
        used: usage.universe_questions_count,
        limit: limits.universe_questions,
        canUse: usage.universe_questions_count < limits.universe_questions
      },
      voice_calls: {
        used: usage.voice_calls_count,
        limit: limits.voice_calls,
        canUse: usage.voice_calls_count < limits.voice_calls
      },
      meditations: {
        used: usage.meditations_count,
        limit: limits.meditations,
        canUse: usage.meditations_count < limits.meditations
      },
      cosmic_missions: {
        used: usage.cosmic_missions_count,
        limit: limits.cosmic_missions,
        canUse: usage.cosmic_missions_count < limits.cosmic_missions
      },
      pacts: {
        used: activePactsCount,
        limit: limits.pacts,
        canUse: activePactsCount < limits.pacts
      },
      isPro
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in check-daily-limits:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})