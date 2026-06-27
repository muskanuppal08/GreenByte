<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminUserController extends Controller
{
    /**
     * Display a listing of all users (Admin Only).
     */
    public function index(): Response
    {
        $users = User::withCount('badges')->latest()->get();
        
        // Append green_level and next_level_progress computed attributes
        foreach ($users as $user) {
            $user->append(['green_level', 'next_level_progress']);
        }

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Update the specified user's role.
     */
    public function updateRole(Request $request, $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        // Prevent self-lockout
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'You cannot change your own role.');
        }

        $validated = $request->validate([
            'role' => 'required|string|in:user,admin',
        ]);

        $user->update(['role' => $validated['role']]);

        return redirect()->back()->with('status', "User role updated to {$validated['role']} successfully!");
    }

    /**
     * Adjust user's eco-points.
     */
    public function adjustPoints(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'points' => 'required|integer',
        ]);

        $user = User::findOrFail($id);
        
        // Calculate new points ensuring they do not drop below 0
        $newPoints = max(0, $user->eco_points + $validated['points']);
        $user->update(['eco_points' => $newPoints]);

        // Evaluate badge status
        $user->checkAndAwardBadges();

        // Send email and create in-app notification
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\RewardCredited($user, $validated['points'], 'Administrative Point Adjustment'));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send reward email: " . $e->getMessage());
        }

        \App\Models\Notification::create([
            'user_id' => $user->id,
            'title' => 'Reward Credited',
            'message' => "You have been credited with {$validated['points']} Eco-Points. New Balance: {$newPoints}."
        ]);

        return redirect()->back()->with('status', 'User eco-points adjusted successfully!');
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id): RedirectResponse
    {
        $user = User::findOrFail($id);

        // Prevent self-deletion
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->back()->with('status', 'User deleted successfully!');
    }
}
