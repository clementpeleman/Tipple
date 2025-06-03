import { NextResponse } from "next/server";
import axios from "axios";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(req) {
  const { dishes } = await req.json();
  
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return NextResponse.json(
      { error: "At least one dish is required" },
      { status: 400 },
    );
  }

  try {
    const translatedDishes = await translateDishesClaude(dishes);
    
    // Batch processing om server overload te voorkomen
    const BATCH_SIZE = 5; // Maximaal 5 gelijktijdige calls
    const recommendations = [];
    
    for (let i = 0; i < translatedDishes.length; i += BATCH_SIZE) {
      const batch = translatedDishes.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (translatedDish, batchIndex) => {
        const index = i + batchIndex;
      try {
        const response = await axios.post(
          "https://vi-api-c89ollq7.uk.gateway.dev/dish-pairings",
          { query: translatedDish },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.VI_API_KEY,
            },
            timeout: 20000, // Verlaagd naar 20s
          },
        );
        
        return {
          success: true,
          data: {
            original_dish: dishes[index],
            translated_dish: translatedDish,
            recommendations: {
              extracted_dish: response.data.tech_info.extracted_dish,
              top_dishes: response.data.tech_info.all_results
                .slice(0, 5)
                .map((dish) => ({
                  match: dish.match,
                  score: dish.score,
                })),
              top_wine_pairings: response.data.pairings
                .slice(0, 5)
                .map((wine) => ({
                  wine_recommendation: wine.wine_recommendation,
                  relevance: wine.relevance,
                  type: wine.type,
                  country: wine.country,
                  color: wine.color,
                })),
            },
          }
          };
        } catch (error) {
          console.error(`Error for dish "${translatedDish}":`, error.message);
          return {
            success: false,
            data: {
              original_dish: dishes[index],
              translated_dish: translatedDish,
              error: error.code === 'ECONNABORTED' ? 'timeout' : 'api_error',
              message: error.message
            }
          };
        }
      });
  
      // Verwerk batch
      const batchResults = await Promise.allSettled(batchPromises);
      const processedBatch = batchResults.map((result, batchIndex) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const index = i + batchIndex;
          return {
            success: false,
            data: {
              original_dish: dishes[index],
              translated_dish: translatedDishes[index],
              error: 'promise_rejected',
              message: result.reason?.message || 'Unknown error'
            }
          };
        }
      });
  
      recommendations.push(...processedBatch);
    }

    // Splits succesvolle en gefaalde resultaten
    const successful = recommendations.filter(r => r.success).map(r => r.data);
    const failed = recommendations.filter(r => !r.success).map(r => r.data);

    return NextResponse.json({
      successful_recommendations: successful,
      failed_recommendations: failed,
      summary: {
        total: dishes.length,
        successful: successful.length,
        failed: failed.length
      }
    });

  } catch (error) {
    console.error("Error in main process:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 },
    );
  }
}

async function translateDishesClaude(dishes) {
  try {
    if (!dishes || dishes.length === 0) {
      throw new Error("No dishes provided for translation.");
    }

    const prompt = `You are a culinary translator. Translate each dish name to English following these rules:

      1. Use the most common English name for the dish
      2. If no standard English translation exists, keep the original name
      3. Use simple, recognizable terms (avoid fancy or technical language)
      4. For regional dishes, use the most widely known English equivalent
      5. Return ONLY the translated names, one per line, in the same order as input
      6. Do not add explanations, descriptions, or additional text

      Examples:
      Input: "Coq au Vin" → Output: "Chicken in Wine"
      Input: "Sushi" → Output: "Sushi"
      Input: "Ratatouille" → Output: "Ratatouille"

      Dishes to translate:
      ${dishes.join("\n")}

      Translations:`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (!response.content[0]) {
      throw new Error("Claude API did not return a valid response.");
    }

    const translations = response.content[0].text
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");

    if (translations.length !== dishes.length) {
      console.warn("Mismatch between input dishes and translations:", {
        dishes,
        translations,
      });
    }

    return translations;
  } catch (error) {
    console.error("Error translating dishes with Claude:", error.message);
    return dishes; // Fallback: geef originele gerechten terug
  }
}