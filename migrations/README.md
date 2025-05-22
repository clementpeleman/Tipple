# Database Migration: Normalized Wine Storage

This migration normalizes the wine storage structure in the database by creating separate tables for wines, dishes, and pairings.

## New Database Schema

### `wines` Table
- `id` (UUID, primary key)
- `name` (string)
- `description` (string, optional)
- `color` (string) - Red, White, Rose, etc.
- `type` (string, optional) - Cabernet, Merlot, Chardonnay, etc.
- `country` (string, optional)
- `region` (string, optional)
- `price` (number, optional)
- `photo_url` (string, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `dishes` Table
- `id` (UUID, primary key)
- `name` (string)
- `translated_name` (string, optional) - English translation if original is in another language
- `dish_type` (string, optional) - Category of dish
- `cuisine` (string, optional) - Italian, French, etc.
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `pairings` Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users)
- `wine_id` (UUID, foreign key to wines)
- `dish_id` (UUID, foreign key to dishes)
- `relevance_score` (number, optional) - How well the pairing matches
- `is_favorite` (boolean, default false)
- `notes` (string, optional) - User notes about the pairing
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Benefits of the New Schema

1. **Reduced Data Redundancy**: The same wine or dish can be paired multiple times without duplicating data.
2. **Better Data Organization**: Clear separation of concerns between wines, dishes, and user pairings.
3. **Enhanced Querying Capabilities**: More flexible queries for analytics and recommendations.
4. **Improved Data Integrity**: Foreign key constraints ensure data consistency.
5. **Future-Proofing**: Easier to extend with additional features like user ratings, wine details, etc.

## Migration Process

1. Run the SQL migration script: `normalize_wine_storage.sql`
2. The script will:
   - Create the new tables
   - Create indexes for better performance
   - Provide a function to migrate existing data
   - (Optionally) Rename or drop the old table after confirming migration success

## API Changes

The API endpoints have been updated to work with the new schema:

- `GET /api/wine?userId=<id>` - Returns all pairings with wine and dish details for a user
- `POST /api/wine?userId=<id>` - Creates a new wine, dish, and pairing
- `GET /api/wine/:id` - Returns a specific pairing with wine and dish details
- `PUT /api/wine/:id` - Updates a specific pairing (favorite status, notes, etc.)
- `DELETE /api/wine/:id` - Deletes a specific pairing

## Frontend Components

New and updated components to work with the normalized schema:

- `WinePairingList.tsx` - Displays a user's wine pairings in the dashboard
- Updated `WineRecommendations.tsx` - Works with the new API structure