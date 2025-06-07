// app/api/wine/route.ts
import { addWine, getWinesByUserId } from '@/services/wine-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const searchQuery = url.searchParams.get('q');
    const categoriesFilter = url.searchParams.get('categories');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Use the service to get wines with their pairings
    const pairings = await getWinesByUserId(userId);
    
    // Apply filters if provided
    let filteredPairings = [...pairings];
    
    // Apply search filter if provided
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredPairings = filteredPairings.filter(pairing => {
        const wine = pairing.wines;
        const dish = pairing.dishes;
        
        // Search in wine name, description, and dish name
        return (
          (wine?.name && wine.name.toLowerCase().includes(query)) ||
          (wine?.description && wine.description.toLowerCase().includes(query)) ||
          (dish?.name && dish.name.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply category filter if provided
    if (categoriesFilter && categoriesFilter.trim() !== '') {
      const categories = categoriesFilter.split('.');
      if (categories.length > 0) {
        filteredPairings = filteredPairings.filter(pairing => {
          const wine = pairing.wines;
          return wine?.color && categories.includes(wine.color);
        });
      }
    }
    
    return NextResponse.json(filteredPairings || []);
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