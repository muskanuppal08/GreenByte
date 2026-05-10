<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => true,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',

            'city' => 'nullable|string|max:255',

            'phone' => 'nullable|string|max:20',

            'profile_picture' =>
                'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Upload profile picture

        if ($request->hasFile('profile_picture')) {

            $path = $request->file('profile_picture')
                            ->store('profiles', 'public');

            $user->profile_picture = $path;
        }

        // Update user details

        $user->name = $request->name;

        $user->email = $request->email;

        $user->city = $request->city;

        $user->phone = $request->phone;

        $user->save();

        return Redirect::route('profile.edit')
            ->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}