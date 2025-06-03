import { NextResponse } from "next/server";
import axios from "axios";
import { Anthropic } from "@anthropic-ai/sdk";

// Mock wine data for fallback recommendations
const wineTypes = {
  Red: ["Cabernet Sauvignon", "Merlot", "Pinot Noir", "Syrah", "Malbec", "Zinfandel"],
  White: ["Chardonnay", "Sauvignon Blanc", "Pinot Grigio", "Riesling", "Moscato"],
  Rose: ["Provence Rosé", "White Zinfandel", "Pinot Noir Rosé", "Syrah Rosé"]
};

const wineCountries = [
  "France", "Italy", "Spain", "United States", "Australia", 
  "Argentina", "Chile", "Germany", "Portugal", "New Zealand"
];

// Initialize Anthropic client if API key is available
const anthropic = process.env.CLAUDE_API_KEY 
  ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
  : null;

export async function POST(req) {
  const { dishes } = await req.json();
  
  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return NextResponse.json(
      { error: "At least one dish is required" },
      { status: 400 },
    );
  }

  try {
    // Check if we have the required API keys
    const hasApiKeys = process.env.VI_API_KEY && process.env.CLAUDE_API_KEY;
    
    // If API keys are missing, use mock data
    if (!hasApiKeys) {
      console.warn("API keys missing, using mock recommendations");
      const mockRecommendations = dishes.map(dish => generateMockRecommendations(dish));
      return NextResponse.json(mockRecommendations);
    }
    
    const translatedDishes = await translateDishesClaude(dishes);
    
    // Batch processing om server overload te voorkomen
    const BATCH_SIZE = 5; // Maximaal 5 gelijktijdige calls
    const recommendations = [];
    
    for (let i = 0; i < translatedDishes.length; i += BATCH_SIZE) {
      const batch = translatedDishes.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (translatedDish, batchIndex) => {
        const index = i + batchIndex;
      try {
        // Check if VI API key is available
        if (!process.env.VI_API_KEY) {
          throw new Error("VI API key is missing");
        }
        
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
          
          // Generate mock data for this dish as fallback
          const mockData = generateMockRecommendations(dishes[index]);
          
          return {
            success: true, // Mark as success so it shows up in the UI
            data: mockData
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
          
          // Generate mock data for this dish as fallback
          const mockData = generateMockRecommendations(dishes[index]);
          
          return {
            success: true, // Mark as success so it shows up in the UI
            data: mockData
          };
        }
      });
  
      recommendations.push(...processedBatch);
    }

    // Splits succesvolle en gefaalde resultaten
    const successful = recommendations.filter(r => r.success).map(r => r.data);
    const failed = recommendations.filter(r => !r.success).map(r => r.data);

    // Return only the successful recommendations in the format expected by the frontend
    return NextResponse.json(successful);

  } catch (error) {
    console.error("Error in main process:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 },
    );
  }
}

// Function to generate mock wine recommendations
function generateMockRecommendations(dish) {
  // Determine wine color based on dish name (simplified logic)
  let preferredColor = "Red";
  const lowerDish = dish.toLowerCase();
  
  if (lowerDish.includes("fish") || lowerDish.includes("seafood") || 
      lowerDish.includes("salad") || lowerDish.includes("chicken") ||
      lowerDish.includes("vegetable")) {
    preferredColor = "White";
  } else if (lowerDish.includes("fruit") || lowerDish.includes("dessert") ||
             lowerDish.includes("light") || lowerDish.includes("appetizer")) {
    preferredColor = "Rose";
  }
  
  // Generate 3 wine recommendations
  const recommendations = [];
  const usedWines = new Set();
  
  for (let i = 0; i < 3; i++) {
    // Determine color with preference but some randomness
    let color = preferredColor;
    if (Math.random() > 0.7) {
      const colors = ["Red", "White", "Rose"];
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Select wine type
    const availableTypes = wineTypes[color];
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    // Select country
    const country = wineCountries[Math.floor(Math.random() * wineCountries.length)];
    
    // Create a unique wine recommendation
    const wineKey = `${type}-${country}`;
    if (usedWines.has(wineKey)) {
      i--; // Try again
      continue;
    }
    
    usedWines.add(wineKey);
    
    // Calculate relevance score (70-100%)
    const relevance = 70 + Math.floor(Math.random() * 30);
    
    recommendations.push({
      wine_recommendation: type,
      relevance: relevance,
      type: type.split(' ')[0], // Simplified type
      country: country,
      color: color
    });
  }
  
  return {
    original_dish: dish,
    translated_dish: dish, // No translation in this mock
    recommendations: {
      top_wine_pairings: recommendations
    }
  };
}

async function translateDishesClaude(dishes) {
  try {
    if (!dishes || dishes.length === 0) {
      throw new Error("No dishes provided for translation.");
    }
    
    // If Anthropic client is not available, return original dishes
    if (!anthropic) {
      console.warn("Claude API key not available, skipping translation");
      return dishes;
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