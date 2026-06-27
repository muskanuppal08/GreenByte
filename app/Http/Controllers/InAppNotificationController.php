<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InAppNotificationController extends Controller
{
    /**
     * Fetch user notifications list.
     */
    public function index(): JsonResponse
    {
        $notifications = auth()->user()->notifications()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead($id): JsonResponse
    {
        $notification = Notification::where('user_id', auth()->id())
            ->findOrFail($id);

        $notification->update(['is_read' => true]);

        return response()->json(['status' => 'success']);
    }

    /**
     * Delete notification.
     */
    public function destroy($id): JsonResponse
    {
        $notification = Notification::where('user_id', auth()->id())
            ->findOrFail($id);

        $notification->delete();

        return response()->json(['status' => 'success']);
    }
}
