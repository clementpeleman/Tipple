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

    const recommendations = await Promise.all(
      translatedDishes.map(async (translatedDish) => {
        const response = await axios.post(
          "https://vi-api-c89ollq7.uk.gateway.dev/dish-pairings",
          { query: translatedDish },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.VI_API_KEY,
            },
            timeout: 25000,
          },
        );

        return {
          original_dish: dishes[translatedDishes.indexOf(translatedDish)],
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
        };
      }),
    );

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);

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

    const prompt = `Translate each of the following dishes to English. Keep it simple and use known dish names. If there is no direct English substitution, use the original dish name. Only provide the translations in order, one per line. Only provide one single name per input dish:

${dishes.join("\n")}`;

    // Roep de Claude API aan
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
