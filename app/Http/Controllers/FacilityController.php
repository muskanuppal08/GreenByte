<?php

namespace App\Http\Controllers;

use App\Models\EwasteCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FacilityController extends Controller
{
    /**
     * Show the facility locator page.
     */
    public function index()
    {
        return Inertia::render('Facility/Locator');
    }

    public function nearby(Request $request)
    {
        $lat = (float) $request->query('lat');
        $lng = (float) $request->query('lng');
        $radius = (float) $request->query('radius', 50); // Default 50km
        $sort = $request->query('sort', 'distance');

        if (!$lat || !$lng) {
            return response()->json(['error' => 'Latitude and Longitude are required'], 400);
        }

        // More robust Haversine formula to avoid NaN on zero distance
        $distanceSql = "
            (6371 * acos(
                LEAST(1, GREATEST(-1, 
                    cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + 
                    sin(radians(?)) * sin(radians(latitude))
                ))
            ))
        ";

        $query = EwasteCenter::select('*')
            ->selectRaw("ROUND($distanceSql, 2) AS distance", [$lat, $lng, $lat]);

        if ($sort !== 'all') {
            $query->having('distance', '<=', $radius);
        }

        if ($sort === 'rating') {
            $query->orderBy('rating', 'desc');
        } else {
            $query->orderBy('distance');
        }

        return response()->json($query->get());
    }

    public function search(Request $request)
    {
        $queryText = $request->query('query');
        $lat = $request->query('lat');
        $lng = $request->query('lng');

        if (!$queryText) {
            return response()->json([]);
        }

        $query = EwasteCenter::where(function($q) use ($queryText) {
            $q->where('address', 'LIKE', "%{$queryText}%")
              ->orWhere('name', 'LIKE', "%{$queryText}%");
        });

        // If location is provided, calculate distance for search results too
        if ($lat && $lng) {
            $distanceSql = "
                (6371 * acos(
                    LEAST(1, GREATEST(-1, 
                        cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + 
                        sin(radians(?)) * sin(radians(latitude))
                    ))
                ))
            ";
            $query->select('*')->selectRaw("ROUND($distanceSql, 2) AS distance", [$lat, $lng, $lat]);
            $query->orderBy('distance');
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        return response()->json(EwasteCenter::findOrFail($id));
    }

    public function openNow()
    {
        $now = now()->format('H:i:s');
        return response()->json(
            EwasteCenter::where('open_time', '<=', $now)
                ->where('close_time', '>=', $now)
                ->get()
        );
    }

    public function storeReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $facility = EwasteCenter::findOrFail($id);

        $facility->reviews()->create([
            'user_id' => auth()->id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $facility->update([
            'rating' => $facility->reviews()->avg('rating'),
            'total_reviews' => $facility->reviews()->count(),
        ]);

        return response()->json(['message' => 'Review submitted successfully']);
    }
}
