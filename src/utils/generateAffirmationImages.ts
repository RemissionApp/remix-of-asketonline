
import { supabase } from "@/lib/supabase";

const prompts = [
  {
    step: 1,
    filename: "quiet_space",
    prompt: "A serene, peaceful meditation space with soft natural light, some plants, and a comfortable cushion. The atmosphere should feel calm and undisturbed. No people visible."
  },
  {
    step: 2,
    filename: "breathing",
    prompt: "An artistic, non-photographic visualization of deep breathing, showing glowing energy entering the body with inhale and dark smoke leaving with exhale. Abstract, beautiful energy flow, no realistic human faces."
  },
  {
    step: 3,
    filename: "speak_aloud",
    prompt: "A stylized image showing sound waves or vibrations emanating from spoken words, with golden light representing positive affirmations. Abstract design, no text visible, cosmic background."
  },
  {
    step: 4,
    filename: "mental_repeat",
    prompt: "A serene profile of a person with closed eyes and a glowing third eye area, with golden words or light patterns forming in their mind. Abstract, spiritual visualization, cosmic elements."
  },
  {
    step: 5,
    filename: "visualization",
    prompt: "A dreamlike scene showing a person standing in their ideal reality surrounded by glowing manifestations of their goals and desires. Use cosmic elements, stars, and a stylized design."
  }
];

export const generateAllAffirmationImages = async (): Promise<Record<number, string>> => {
  const results: Record<number, string> = {};
  
  for (const item of prompts) {
    try {
      console.log(`Generating image for step ${item.step}: ${item.filename}`);
      
      const { data, error } = await supabase.functions.invoke('generate-affirmation-images', {
        body: {
          stepNumber: item.step,
          prompt: item.prompt,
          filename: item.filename
        }
      });
      
      if (error) {
        console.error(`Error generating image for step ${item.step}:`, error);
        continue;
      }
      
      if (data.imageUrl) {
        console.log(`Successfully generated image for step ${item.step}: ${data.imageUrl}`);
        results[item.step] = data.imageUrl;
      }
    } catch (err) {
      console.error(`Exception when generating image for step ${item.step}:`, err);
    }
  }
  
  return results;
};
