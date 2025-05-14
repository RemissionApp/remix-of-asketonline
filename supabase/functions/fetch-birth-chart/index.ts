
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface BirthChartRequest {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  latitude: number;
  longitude: number;
  timezone: number;
  config?: {
    observation_point: "topocentric" | "geocentric";
    ayanamsha?: string;
  };
  language?: "en" | "te";
}

serve(async (req) => {
  try {
    // Get API key from environment variables
    const apiKey = Deno.env.get('HOROSCOPE_CHART_API_KEY');
    
    if (!apiKey) {
      throw new Error("HOROSCOPE_CHART_API_KEY environment variable is required");
    }
    
    // Parse request body
    const requestData: BirthChartRequest = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'year', 'month', 'date', 'hours', 'minutes', 
      'seconds', 'latitude', 'longitude', 'timezone'
    ];
    
    for (const field of requiredFields) {
      if (requestData[field] === undefined) {
        return new Response(
          JSON.stringify({ error: `Field '${field}' is required` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    
    // Set defaults if not provided
    if (!requestData.config) {
      requestData.config = { observation_point: "topocentric" };
    }
    
    if (!requestData.language) {
      requestData.language = "en";
    }
    
    // Make request to the Horoscope Chart API
    const response = await fetch("https://json.freeastrologyapi.com/horoscope-chart-svg-code", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error from Horoscope Chart API: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const chartData = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: chartData
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-birth-chart:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
