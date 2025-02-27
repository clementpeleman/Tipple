import { NextResponse } from "next/server";
// import multer from "multer";
import sharp from "sharp";
import { Anthropic } from "@anthropic-ai/sdk";

// const upload = multer({ storage: multer.memoryStorage() });

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export const runtime = "nodejs";

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("image");

  if (!file || file.type.split("/")[0] !== "image") {
    return NextResponse.json(
      { error: "Invalid or missing file" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Resize image
    const resizedImage = await sharp(buffer)
      .resize({
        width: 2048,
        height: 2048,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();

    const base64Image = resizedImage.toString("base64");

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `This is a restaurant menu. 
              Return only a JSON object with the name of the restaurant (if present in the image, else "Restaurant") and the different categories of dishes. 
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
                media_type: file.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const messageContent = response.content[0].text;
    const cleanedResponseString = messageContent
      .replace(/```json\n|\n```/g, '')
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
