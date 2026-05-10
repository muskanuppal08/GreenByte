<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EwasteCenter;

class EwasteController extends Controller
{
    // 📍 NEAREST CENTERS API (OPTIMIZED)
    public function nearest(Request $request)
    {
        $userLat = (float) $request->latitude;
        $userLng = (float) $request->longitude;

        $maxDistance = (float) ($request->distance ?? 10);
        $openNow = filter_var($request->open_now, FILTER_VALIDATE_BOOLEAN);

        $centers = EwasteCenter::all();

        $filtered = [];

        foreach ($centers as $center) {

            // skip invalid data safety check
            if (!$center->latitude || !$center->longitude) {
                continue;
            }

            // distance calculation
            $distance = $this->haversine(
                $userLat,
                $userLng,
                (float) $center->latitude,
                (float) $center->longitude
            );

            // filter by distance
            if ($distance > $maxDistance) {
                continue;
            }

            // filter by open time (optional)
            if ($openNow && $center->open_time && $center->close_time) {

                $now = date('H:i:s');

                if (!($center->open_time <= $now && $now <= $center->close_time)) {
                    continue;
                }
            }

            $center->distance = $distance;
            $filtered[] = $center;
        }

        // sort by nearest
        usort($filtered, function ($a, $b) {
            return $a->distance <=> $b->distance;
        });

        return response()->json($filtered);
    }

    // 📍 Haversine formula (clean version)
    private function haversine($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) ** 2 +
             cos(deg2rad($lat1)) *
             cos(deg2rad($lat2)) *
             sin($dLon / 2) ** 2;

        return 2 * $earthRadius * atan2(sqrt($a), sqrt(1 - $a));
    }

    // 🧠 ADMIN: list centers
    public function adminIndex()
    {
        $centers = EwasteCenter::all();
        return view('admin.centers.index', compact('centers'));
    }

    // ➕ ADMIN: create form
    public function create()
    {
        return view('admin.centers.create');
    }

    // 💾 ADMIN: store center
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'address' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        EwasteCenter::create([
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'open_time' => $request->open_time,
            'close_time' => $request->close_time,
            'accepted_items' => $request->accepted_items,
        ]);

        return redirect('/admin/centers')
            ->with('success', 'Center added successfully!');
    }
}