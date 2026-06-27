<?php

namespace App\Http\Controllers;

use App\Models\PickupRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ImpactDashboardController extends Controller
{
    /**
     * Display the environmental impact dashboard.
     */
    public function index(): Response
    {
        $user = auth()->user();

        // 1. Fetch completed pickups
        $personalPickups = PickupRequest::where('user_id', $user->id)
            ->where('status', 'Completed')
            ->get();

        $globalPickups = PickupRequest::where('status', 'Completed')
            ->get();

        // 2. Compute metrics
        $personalMetrics = $this->calculateMetrics($personalPickups);
        $globalMetrics = $this->calculateMetrics($globalPickups);

        // 3. Category distribution (Donut Chart)
        $categories = ['Mobile', 'Laptop', 'Battery', 'TV', 'Printer'];
        $categoryColors = [
            'Mobile' => '#10b981',   // Emerald
            'Laptop' => '#06b6d4',   // Cyan
            'Battery' => '#f59e0b',  // Amber
            'TV' => '#3b82f6',       // Blue
            'Printer' => '#8b5cf6'   // Purple
        ];

        $donutData = [];
        foreach ($categories as $cat) {
            $personalCount = $personalPickups->where('device_type', $cat)->count();
            $globalCount = $globalPickups->where('device_type', $cat)->count();
            
            $donutData[] = [
                'device' => $cat,
                'personal' => $personalCount,
                'global' => $globalCount,
                'color' => $categoryColors[$cat]
            ];
        }

        // 4. Monthly trends (Bar Chart) - Last 6 months
        $barChartData = [];
        $lineChartData = [];
        
        $cumulativePersonalCarbon = 0.0;
        $cumulativeGlobalCarbon = 0.0;

        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthStart = $monthDate->copy()->startOfMonth();
            $monthEnd = $monthDate->copy()->endOfMonth();
            $monthName = $monthDate->format('M');

            // Count completed pickups in this month
            $personalMonthPickups = $personalPickups->filter(function ($p) use ($monthStart, $monthEnd) {
                return $p->pickup_date >= $monthStart && $p->pickup_date <= $monthEnd;
            });
            $globalMonthPickups = $globalPickups->filter(function ($p) use ($monthStart, $monthEnd) {
                return $p->pickup_date >= $monthStart && $p->pickup_date <= $monthEnd;
            });

            $personalMonthCount = $personalMonthPickups->count();
            $globalMonthCount = $globalMonthPickups->count();

            // Calculate carbon saved in this month
            $personalMonthCarbon = $this->calculateCarbonSaved($personalMonthPickups);
            $globalMonthCarbon = $this->calculateCarbonSaved($globalMonthMonth = $globalMonthPickups);

            $cumulativePersonalCarbon += $personalMonthCarbon;
            $cumulativeGlobalCarbon += $globalMonthCarbon;

            $barChartData[] = [
                'month' => $monthName,
                'personal' => $personalMonthCount,
                'global' => $globalMonthCount
            ];

            $lineChartData[] = [
                'month' => $monthName,
                'personal_carbon' => round($cumulativePersonalCarbon, 2),
                'global_carbon' => round($cumulativeGlobalCarbon, 2)
            ];
        }

        // 5. Recent completed pickups for history timeline
        $recentHistory = PickupRequest::where('user_id', $user->id)
            ->where('status', 'Completed')
            ->orderBy('pickup_date', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($p) {
                $carbon = 0.0;
                $points = 0;
                switch ($p->device_type) {
                    case 'Mobile': $carbon = 2.5; $points = 80; break;
                    case 'Laptop': $carbon = 15.0; $points = 200; break;
                    case 'Battery': $carbon = 1.2; $points = 60; break;
                    case 'TV': $carbon = 8.0; $points = 120; break;
                    case 'Printer': $carbon = 4.5; $points = 80; break;
                }
                return [
                    'id' => $p->id,
                    'device_type' => $p->device_type,
                    'brand' => $p->brand,
                    'model' => $p->model,
                    'date' => $p->pickup_date->format('M d, Y'),
                    'carbon_saved' => $carbon,
                    'points_earned' => $points
                ];
            });

        return Inertia::render('Impact/Index', [
            'personalMetrics' => $personalMetrics,
            'globalMetrics' => $globalMetrics,
            'donutData' => $donutData,
            'barChartData' => $barChartData,
            'lineChartData' => $lineChartData,
            'recentHistory' => $recentHistory
        ]);
    }

    /**
     * Compute carbon, weight, and metal recoveries.
     */
    private function calculateMetrics($pickups)
    {
        $co2Saved = 0.0;
        $wasteDiverted = 0.0;
        
        $metals = [
            'Gold' => 0.0,
            'Silver' => 0.0,
            'Copper' => 0.0,
            'Aluminum' => 0.0,
            'Palladium' => 0.0,
            'Cadmium' => 0.0,
            'Nickel' => 0.0,
            'Lithium' => 0.0,
            'Lead' => 0.0,
        ];

        foreach ($pickups as $p) {
            switch ($p->device_type) {
                case 'Mobile':
                    $co2Saved += 2.5;
                    $wasteDiverted += 0.2;
                    $metals['Gold'] += 15.0;      // mg
                    $metals['Silver'] += 300.0;   // mg
                    $metals['Copper'] += 15.0;    // g
                    $metals['Palladium'] += 5.0;  // mg
                    break;
                case 'Laptop':
                    $co2Saved += 15.0;
                    $wasteDiverted += 2.0;
                    $metals['Copper'] += 150.0;   // g
                    $metals['Gold'] += 25.0;      // mg
                    $metals['Aluminum'] += 300.0; // g
                    $metals['Silver'] += 1000.0;  // mg
                    break;
                case 'Battery':
                    $co2Saved += 1.2;
                    $wasteDiverted += 0.5;
                    $metals['Cadmium'] += 30.0;   // g
                    $metals['Nickel'] += 50.0;    // g
                    $metals['Lithium'] += 20.0;   // g
                    break;
                case 'TV':
                    $co2Saved += 8.0;
                    $wasteDiverted += 15.0;
                    $metals['Lead'] += 500.0;     // g
                    $metals['Copper'] += 80.0;    // g
                    $metals['Gold'] += 10.0;      // mg
                    break;
                case 'Printer':
                    $co2Saved += 4.5;
                    $wasteDiverted += 5.0;
                    $metals['Copper'] += 40.0;    // g
                    $metals['Aluminum'] += 120.0; // g
                    break;
            }
        }

        // Format precious metals for readable display
        $formattedMetals = [
            ['name' => 'Gold', 'amount' => $metals['Gold'] >= 1000 ? round($metals['Gold'] / 1000, 2) . ' g' : round($metals['Gold'], 1) . ' mg'],
            ['name' => 'Silver', 'amount' => $metals['Silver'] >= 1000 ? round($metals['Silver'] / 1000, 2) . ' g' : round($metals['Silver'], 1) . ' mg'],
            ['name' => 'Copper', 'amount' => $metals['Copper'] >= 1000 ? round($metals['Copper'] / 1000, 2) . ' kg' : round($metals['Copper'], 1) . ' g'],
            ['name' => 'Aluminum', 'amount' => $metals['Aluminum'] >= 1000 ? round($metals['Aluminum'] / 1000, 2) . ' kg' : round($metals['Aluminum'], 1) . ' g'],
            ['name' => 'Lithium', 'amount' => $metals['Lithium'] >= 1000 ? round($metals['Lithium'] / 1000, 2) . ' kg' : round($metals['Lithium'], 1) . ' g'],
        ];

        return [
            'count' => $pickups->count(),
            'co2_saved' => round($co2Saved, 2),
            'waste_diverted' => round($wasteDiverted, 2),
            'metals' => $formattedMetals
        ];
    }

    /**
     * Internal helper to sum carbon savings.
     */
    private function calculateCarbonSaved($pickups)
    {
        $co2 = 0.0;
        foreach ($pickups as $p) {
            switch ($p->device_type) {
                case 'Mobile': $co2 += 2.5; break;
                case 'Laptop': $co2 += 15.0; break;
                case 'Battery': $co2 += 1.2; break;
                case 'TV': $co2 += 8.0; break;
                case 'Printer': $co2 += 4.5; break;
            }
        }
        return $co2;
    }
}
