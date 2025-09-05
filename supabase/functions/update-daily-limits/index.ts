import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json()
    
    if (!action || !['universe_question', 'voice_call', 'meditation', 'cosmic_mission'].includes(action)) {
      throw new Error('Invalid action')
    }

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

    const today = new Date().toISOString().split('T')[0]
    const columnMap = {
      universe_question: 'universe_questions_count',
      voice_call: 'voice_calls_count',
      meditation: 'meditations_count',
      cosmic_mission: 'cosmic_missions_count'
    }

    const column = columnMap[action as keyof typeof columnMap]

    // Get or create today's record
    const { data: existingRecord } = await supabaseClient
      .from('daily_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabaseClient
        .from('daily_limits')
        .update({ 
          [column]: existingRecord[column] + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('date', today)

      if (updateError) {
        throw updateError
      }
    } else {
      // Create new record
      const { error: insertError } = await supabaseClient
        .from('daily_limits')
        .insert({
          user_id: user.id,
          date: today,
          [column]: 1
        })

      if (insertError) {
        throw insertError
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in update-daily-limits:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})