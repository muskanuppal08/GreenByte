<?php

namespace App\Http\Controllers;

use App\Models\EwasteCenter;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_facilities' => EwasteCenter::count(),
                'total_users' => User::where('role', 'user')->count(),
                'pending_reports' => Review::count(), // Using reviews as a placeholder for reports
            ]
        ]);
    }
}
