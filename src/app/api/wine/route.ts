// app/api/wine/route.ts
import { addWine, getWinesByUserId } from '@/services/wine-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Use the new service to get wines with their pairings
    const pairings = await getWinesByUserId(userId);
    
    return NextResponse.json(pairings || []);
  } catch (error: any) {
    console.error('Error in GET: ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Extract userId from the URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Parse the request body
    const body = await request.json();
    const { 
      name, 
      description, 
      category, // This is the wine color in the old schema
      price, 
      photo_url, 
      dish, 
      dish_type,
      country,
      type,
      relevance_score
    } = body;

    // Validate required fields
    if (!name || !category || !dish) {
      return NextResponse.json({ error: 'Missing required wine data' }, { status: 400 });
    }

    // Prepare wine data
    const wineData = {
      name,
      description,
      color: category, // Map the old 'category' to the new 'color'
      type,
      country,
      price,
      photo_url
    };

    // Prepare dish data
    const dishData = {
      name: dish,
      dish_type
    };

    // Prepare pairing data
    const pairingData = {
      relevance_score: relevance_score || null,
      is_favorite: false
    };

    // Use the new service to add the wine, dish, and pairing
    const result = await addWine(userId, wineData, dishData, pairingData);

    return NextResponse.json({ 
      message: 'Wine pairing added successfully', 
      pairing: result 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST: ', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}