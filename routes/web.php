<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminFacilityController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\RewardCalculatorController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\PickupRequestController;
use App\Http\Controllers\RecommendationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home Page - Role Selection
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// ─── User Area (requires auth + email verified + user role) ───────────────
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/picture', [ProfileController::class, 'destroyPicture'])->name('profile.picture.destroy');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Reward Calculator
    Route::get('/calculator', [RewardCalculatorController::class, 'index'])->name('calculator');
    Route::post('/calculator', [RewardCalculatorController::class, 'calculate'])->name('calculator.calculate');

    // Gamification Leaderboard
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');

    // Home Pickups
    Route::get('/pickups', [PickupRequestController::class, 'index'])->name('pickups.index');
    Route::post('/pickups', [PickupRequestController::class, 'store'])->name('pickups.store');
    Route::post('/pickups/{id}/cancel', [PickupRequestController::class, 'cancel'])->name('pickups.cancel');

    // AI Recommendation Assistant
    Route::get('/recommendations', [RecommendationController::class, 'index'])->name('recommendations.index');
    Route::post('/recommendations/suggest', [RecommendationController::class, 'suggest'])->name('recommendations.suggest');

    // Environmental Impact Dashboard
    Route::get('/impact', [App\Http\Controllers\ImpactDashboardController::class, 'index'])->name('impact.index');
});

// ─── Admin Area (requires auth + admin role) ──────────────────────────────
Route::prefix('admin')->name('admin.')->group(function () {
    
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'login']);
    });

    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');
        
        // Facility Management
        Route::resource('facilities', AdminFacilityController::class);

        // Review Moderation
        Route::get('/reviews', [App\Http\Controllers\AdminReviewController::class, 'index'])->name('reviews.index');
        Route::post('/reviews/{id}/approve', [App\Http\Controllers\AdminReviewController::class, 'approve'])->name('reviews.approve');
        Route::delete('/reviews/{id}', [App\Http\Controllers\AdminReviewController::class, 'destroy'])->name('reviews.destroy');

        // Pickup Requests Moderation
        Route::get('/pickups', [App\Http\Controllers\AdminPickupController::class, 'index'])->name('pickups.index');
        Route::post('/pickups/{id}/status', [App\Http\Controllers\AdminPickupController::class, 'updateStatus'])->name('pickups.status');

        // User Management & Points
        Route::get('/users', [App\Http\Controllers\AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users/{id}/role', [App\Http\Controllers\AdminUserController::class, 'updateRole'])->name('users.role');
        Route::post('/users/{id}/points', [App\Http\Controllers\AdminUserController::class, 'adjustPoints'])->name('users.points');
        Route::delete('/users/{id}', [App\Http\Controllers\AdminUserController::class, 'destroy'])->name('users.destroy');

        // Education Management
        Route::get('/education', [App\Http\Controllers\AdminEducationController::class, 'index'])->name('education.index');

        // Reports Generation
        Route::get('/reports', [App\Http\Controllers\AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/download/{type}', [App\Http\Controllers\AdminReportController::class, 'download'])->name('reports.download');

        // Platform Analytics Dashboard
        Route::get('/analytics', [App\Http\Controllers\AdminAnalyticsController::class, 'index'])->name('analytics.index');
    });
});

// ─── Facility Locator ──────────────────────────────────────────────────────
Route::get('/locator', [App\Http\Controllers\FacilityController::class, 'index'])->name('locator');

Route::prefix('api')->group(function () {
    Route::get('/facilities/nearby', [App\Http\Controllers\FacilityController::class, 'nearby']);
    Route::get('/facilities/search', [App\Http\Controllers\FacilityController::class, 'search']);
    Route::get('/facilities/open-now', [App\Http\Controllers\FacilityController::class, 'openNow']);
    Route::get('/facilities/{id}', [App\Http\Controllers\FacilityController::class, 'show']);
    Route::post('/facilities/{id}/review', [App\Http\Controllers\FacilityController::class, 'storeReview'])->middleware('auth');

    // E-Waste Education
    Route::get('/devices', [App\Http\Controllers\EducationController::class, 'index']);
    Route::post('/devices', [App\Http\Controllers\EducationController::class, 'store']);
    Route::put('/devices/{id}', [App\Http\Controllers\EducationController::class, 'update']);
    Route::delete('/devices/{id}', [App\Http\Controllers\EducationController::class, 'destroy']);
});

// ─── Shared Auth Routes (Breeze) ──────────────────────────────────────────
require __DIR__.'/auth.php';