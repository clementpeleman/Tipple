import { NextResponse } from "next/server";
import sharp from "sharp";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export const runtime = "nodejs";

export async function POST(req) {
  const form = await req.formData();
  // ⬇️ Gebruik "file" i.p.v. "image" als key
  const file = form.get("file");

  // ⬇️ Controleer of het bestand bestaat en of het een image of pdf is
  if (
    !file ||
    !file.type ||
    (file.type.split("/")[0] !== "image" && file.type !== "application/pdf")
  ) {
    return NextResponse.json(
      { error: "Invalid or missing file" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    let base64Data;
    let mediaType = file.type;

    if (file.type.startsWith("image/")) {
      // Resize image
      const resizedImage = await sharp(buffer)
        .resize({
          width: 2048,
          height: 2048,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();
      base64Data = resizedImage.toString("base64");
    } else if (file.type === "application/pdf") {
      // PDF: stuur direct als base64
      base64Data = buffer.toString("base64");
    }

    let content;
    if (file.type.startsWith("image/")) {
      content = [
        {
          type: "text",
          text: `This is a restaurant menu. 
          Return only a JSON object with the name of the restaurant (if present in the image or PDF, else "Restaurant") and the different categories of dishes. 
          Don't use full uppercase. Only capital letter. If no price is available, write "null". Try to narrow down the dish names to common dishes and don't mention irrelevant ingredients in the dish name.
          Template:
          {
          "restaurant": "<restaurant_name>",
          "categories": {
            "<category_name_1>": [
              {
                "name": "<dish_name_1>",
                "price": <price_1>
              },
              ...
            ],
            "<category_name_2>": [
              {
                "name": "<dish_name_2>",
                "price": <price_2>
              },
              ...
            ]
            ...
          }
        }
          Limit the categories to "Starters", "Main dishes", "Desserts".`,
        },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: base64Data,
          },
        },
      ];
    } else if (file.type === "application/pdf") {
      content = [
        {
          type: "text",
          text: `This is a restaurant menu. 
          Return only a JSON object with the name of the restaurant (if present in the image or PDF, else "Restaurant") and the different categories of dishes. 
          Don't use full uppercase. Only capital letter. If no price is available, write "null". Try to narrow down the dish names to common dishes and don't mention irrelevant ingredients in the dish name.
          Template:
          {
          "restaurant": "<restaurant_name>",
          "categories": {
            "<category_name_1>": [
              {
                "name": "<dish_name_1>",
                "price": <price_1>
              },
              ...
            ],
            "<category_name_2>": [
              {
                "name": "<dish_name_2>",
                "price": <price_2>
              },
              ...
            ]
            ...
          }
        }
          Limit the categories to "Starters", "Main dishes", "Desserts".`,
        },
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64Data,
          },
        },
      ];
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    const messageContent = response.content[0].text;
    const cleanedResponseString = messageContent
      .replace(/```json\n|\n```/g, "")
      .trim();
    const cleanedResponse = JSON.parse(cleanedResponseString);

    return NextResponse.json(cleanedResponse);
  } catch (error) {
    console.error("Error processing upload:", error);

    return NextResponse.json(
      { error: "Error processing upload" },
      { status: 500 },
    );
  }
}
