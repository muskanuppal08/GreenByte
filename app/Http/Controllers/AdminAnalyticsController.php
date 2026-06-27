<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EwasteCenter;
use App\Models\PickupRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    /**
     * Display the admin analytics dashboard.
     */
    public function index(): Response
    {
        // 1. Core KPIs
        $totalUsers = User::where('role', 'user')->count();
        $totalFacilities = EwasteCenter::count();
        $totalPoints = User::sum('eco_points');

        $completedPickups = PickupRequest::where('status', 'Completed')->count();
        $pendingPickups = PickupRequest::where('status', 'Pending')->count();
        $scheduledPickups = PickupRequest::where('status', 'Scheduled')->count();
        $cancelledPickups = PickupRequest::where('status', 'Cancelled')->count();

        // Calculate platform carbon savings and waste diverted
        $allCompletedPickups = PickupRequest::where('status', 'Completed')->get();
        $platformCarbon = 0.0;
        $platformWaste = 0.0; // in kg

        foreach ($allCompletedPickups as $p) {
            switch ($p->device_type) {
                case 'Mobile':
                    $platformCarbon += 2.5;
                    $platformWaste += 0.2;
                    break;
                case 'Laptop':
                    $platformCarbon += 15.0;
                    $platformWaste += 2.0;
                    break;
                case 'Battery':
                    $platformCarbon += 1.2;
                    $platformWaste += 0.5;
                    break;
                case 'TV':
                    $platformCarbon += 8.0;
                    $platformWaste += 15.0;
                    break;
                case 'Printer':
                    $platformCarbon += 4.5;
                    $platformWaste += 5.0;
                    break;
            }
        }

        // 2. Device Breakdown (percentage representation)
        $deviceTypes = ['Mobile', 'Laptop', 'Battery', 'TV', 'Printer'];
        $deviceBreakdown = [];
        $deviceColors = ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6', '#8b5cf6'];
        
        foreach ($deviceTypes as $idx => $type) {
            $count = PickupRequest::where('device_type', $type)->count();
            $deviceBreakdown[] = [
                'device' => $type,
                'count' => $count,
                'color' => $deviceColors[$idx]
            ];
        }

        // 3. Monthly Success Rates (Completed vs Cancelled) - Last 6 months
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthStart = $monthDate->copy()->startOfMonth();
            $monthEnd = $monthDate->copy()->endOfMonth();
            $monthName = $monthDate->format('M');

            $compCount = PickupRequest::where('status', 'Completed')
                ->whereBetween('pickup_date', [$monthStart, $monthEnd])
                ->count();

            $cancCount = PickupRequest::where('status', 'Cancelled')
                ->whereBetween('pickup_date', [$monthStart, $monthEnd])
                ->count();

            $monthlyTrends[] = [
                'month' => $monthName,
                'completed' => $compCount,
                'cancelled' => $cancCount
            ];
        }

        // 4. Top Recyclers (Users with the most completed pickups)
        $topRecyclers = User::where('role', 'user')
            ->select('users.id', 'users.name', 'users.email', 'users.eco_points',
                DB::raw('(SELECT COUNT(*) FROM pickup_requests WHERE pickup_requests.user_id = users.id AND pickup_requests.status = "Completed") as completed_count'))
            ->orderBy('completed_count', 'desc')
            ->limit(5)
            ->get();

        // 5. Facility distribution by city/state
        $facilityStats = EwasteCenter::select('city', DB::raw('count(*) as count'))
            ->groupBy('city')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Analytics', [
            'kpis' => [
                'total_users' => $totalUsers,
                'total_facilities' => $totalFacilities,
                'total_points' => $totalPoints,
                'completed_pickups' => $completedPickups,
                'pending_pickups' => $pendingPickups,
                'scheduled_pickups' => $scheduledPickups,
                'cancelled_pickups' => $cancelledPickups,
                'platform_carbon' => round($platformCarbon, 1),
                'platform_waste' => round($platformWaste, 1)
            ],
            'deviceBreakdown' => $deviceBreakdown,
            'monthlyTrends' => $monthlyTrends,
            'topRecyclers' => $topRecyclers,
            'facilityStats' => $facilityStats
        ]);
    }
}
