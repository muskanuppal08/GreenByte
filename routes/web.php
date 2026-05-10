<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EwasteController;

/*
|--------------------------------------------------------------------------
| Home (Inertia default)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Auth Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| FACILITY LOCATOR (MAP PAGE)
|--------------------------------------------------------------------------
*/

Route::get('/facility-locator', function () {
    return view('facility.locator');
});

/*
|--------------------------------------------------------------------------
| NEAREST CENTERS API (IMPORTANT)
|--------------------------------------------------------------------------
*/

Route::post('/nearest-centers', [EwasteController::class, 'nearest'])
    ->name('centers.nearest');

/*
|--------------------------------------------------------------------------
| EDUCATION MODULE
|--------------------------------------------------------------------------
*/

Route::get('/education', function () {
    return view('education.index');
});

/*
|--------------------------------------------------------------------------
| ADMIN PANEL
|--------------------------------------------------------------------------
*/

Route::get('/admin/centers', [EwasteController::class, 'adminIndex']);

Route::get('/admin/centers/create', [EwasteController::class, 'create']);

Route::post('/admin/centers/store', [EwasteController::class, 'store'])
    ->name('centers.store');