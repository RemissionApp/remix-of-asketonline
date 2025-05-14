
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";

interface AstroProfile {
  name: string;
  birthDate: string;
  birthTime: string | null;
  birthPlace: string | null;
}

interface ReadingResult {
  reading: string;
  error?: string;
}

export async function saveAstroProfile(profile: AstroProfile): Promise<boolean> {
  const { name, birthDate, birthTime, birthPlace } = profile;
  
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('astro_profiles')
      .select('id')
      .eq('user_id', user.user.id)
      .maybeSingle();
      
    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('astro_profiles')
        .update({
          name,
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id);
        
      if (error) throw error;
    } else {
      // Insert new profile
      const { error } = await supabase
        .from('astro_profiles')
        .insert({
          user_id: user.user.id,
          name,
          birth_date: birthDate,
          birth_time: birthTime,
          birth_place: birthPlace
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error saving astro profile:", error);
    return false;
  }
}

export async function getAstroProfile(): Promise<AstroProfile | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('astro_profiles')
      .select('name, birth_date, birth_time, birth_place')
      .eq('user_id', user.user.id)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      name: data.name,
      birthDate: data.birth_date,
      birthTime: data.birth_time,
      birthPlace: data.birth_place
    };
  } catch (error) {
    console.error("Error getting astro profile:", error);
    return null;
  }
}

export async function getUniverseDecoding(profile: AstroProfile): Promise<ReadingResult> {
  try {
    const { language } = useAppStore.getState();
    
    // Call the edge function to generate the reading
    const { data, error } = await supabase.functions.invoke('universe-decode', {
      body: { 
        ...profile,
        language 
      },
    });

    if (error) throw error;
    
    if (!data || !data.reading) {
      throw new Error("No reading data received");
    }
    
    // Save the reading to the profile
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      await supabase
        .from('astro_profiles')
        .update({
          last_reading: {
            text: data.reading,
            timestamp: new Date().toISOString()
          }
        })
        .eq('user_id', user.user.id);
    }
    
    return {
      reading: data.reading
    };
  } catch (error) {
    console.error("Error getting universe decoding:", error);
    return {
      reading: "",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getLastReading(): Promise<string | null> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('astro_profiles')
      .select('last_reading')
      .eq('user_id', user.user.id)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data || !data.last_reading) return null;
    
    return data.last_reading.text;
  } catch (error) {
    console.error("Error getting last reading:", error);
    return null;
  }
}
