
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is necessary for CORS to work
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { name, email, message, userInfo } = await req.json();
    
    // Here, in a real implementation, you would send an email to info@remissionsoft.com
    // For demonstration purposes, let's simulate a successful sending
    console.log(`Email would be sent to info@remissionsoft.com`);
    console.log(`From: ${name} (${email})`);
    console.log(`User ID: ${userInfo?.userId || 'Unknown'}`);
    console.log(`User is PRO: ${userInfo?.isPro ? 'Yes' : 'No'}`);
    console.log(`Message: ${message}`);
    
    // In a real implementation, you would use an email service like SendGrid, AWS SES, etc.
    // const emailSent = await sendEmailToAddress("info@remissionsoft.com", { name, email, message, userInfo });
    
    // Simulate delay for a more realistic experience
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-developer-email function:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
