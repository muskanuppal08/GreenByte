<?php

namespace App\Http\Controllers;

use App\Models\PickupRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminPickupController extends Controller
{
    /**
     * Display a listing of all pickup requests (Admin Only).
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Pickups', [
            'pickups' => PickupRequest::with('user')->latest()->get(),
        ]);
    }

    /**
     * Update the status of the specified pickup request.
     */
    public function updateStatus(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Scheduled,Completed,Cancelled',
            'notes' => 'nullable|string',
        ]);

        $pickup = PickupRequest::findOrFail($id);
        
        $pickup->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $pickup->notes,
        ]);

        // Send email and create in-app notification on confirmation (Scheduled or Completed)
        if (in_array($validated['status'], ['Scheduled', 'Completed'])) {
            try {
                \Illuminate\Support\Facades\Mail::to($pickup->user->email)->send(new \App\Mail\PickupConfirmed($pickup->user, $pickup->device_type, $pickup->pickup_date->format('Y-m-d')));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to send pickup confirmation email: " . $e->getMessage());
            }

            \App\Models\Notification::create([
                'user_id' => $pickup->user_id,
                'title' => 'Pickup ' . $validated['status'],
                'message' => "Your doorstep pickup request for a {$pickup->device_type} has been updated to {$validated['status']}."
            ]);
        }

        return redirect()->back()->with('status', 'Pickup request status updated successfully!');
    }
}
