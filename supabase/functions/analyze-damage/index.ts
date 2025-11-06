import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing vehicle damage with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert vehicle damage assessment AI for an insurance claims system. 
Analyze the provided image and return a structured assessment in the following JSON format:
{
  "severity": "minor" | "moderate" | "severe",
  "damageAreas": ["list of damaged parts"],
  "estimatedCost": "cost range as string",
  "assessment": "detailed description",
  "nextSteps": ["list of recommended actions"]
}

Be professional, accurate, and helpful. If the image doesn't show vehicle damage, indicate that clearly.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this vehicle damage image and provide a detailed assessment."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      throw new Error("No analysis received from AI");
    }

    console.log("Analysis received:", analysisText);

    // Parse the JSON response from the AI
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create a structured response from the text
        analysis = {
          severity: "moderate",
          damageAreas: ["Assessment pending"],
          estimatedCost: "To be determined",
          assessment: analysisText,
          nextSteps: [
            "Review the damage assessment",
            "Contact your claims adjuster",
            "Schedule a detailed inspection"
          ]
        };
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Fallback structure
      analysis = {
        severity: "moderate",
        damageAreas: ["Assessment pending"],
        estimatedCost: "To be determined",
        assessment: analysisText,
        nextSteps: [
          "Review the damage assessment",
          "Contact your claims adjuster",
          "Schedule a detailed inspection"
        ]
      };
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-damage function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});