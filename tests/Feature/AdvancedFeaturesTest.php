<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Notification;
use App\Mail\PickupConfirmed;
use App\Mail\RewardCredited;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdvancedFeaturesTest extends TestCase
{
    use RefreshDatabase;

    public function test_chatbot_responds_correctly_to_battery_keywords(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/chatbot', [
            'message' => 'How can I safely recycle standard cell batteries?'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['response']);
        $this->assertStringContainsString('Battery Recycling Guide', $response->json('response'));
    }

    public function test_chatbot_responds_correctly_to_laptop_keywords(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/chatbot', [
            'message' => 'Tell me how to recycle my old Dell laptop.'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['response']);
        $this->assertStringContainsString('Laptop Recycling Guide', $response->json('response'));
    }

    public function test_notifications_crud_operations(): void
    {
        $user = User::factory()->create();
        
        // Create a notification
        $notification = Notification::create([
            'user_id' => $user->id,
            'title' => 'Test Notification',
            'message' => 'This is a test notification'
        ]);

        // 1. Index
        $response = $this->actingAs($user)->getJson('/notifications');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $this->assertEquals('Test Notification', $response->json()[0]['title']);

        // 2. Mark as read
        $readResponse = $this->actingAs($user)->postJson("/notifications/{$notification->id}/read");
        $readResponse->assertStatus(200);
        $this->assertTrue($notification->fresh()->is_read);

        // 3. Delete
        $deleteResponse = $this->actingAs($user)->deleteJson("/notifications/{$notification->id}");
        $deleteResponse->assertStatus(200);
        $this->assertDatabaseMissing('notifications', ['id' => $notification->id]);
    }

    public function test_mailables_content_generation(): void
    {
        $user = User::factory()->create(['name' => 'John Doe']);

        // 1. Pickup Confirmed mailable
        $pickupMail = new PickupConfirmed($user, 'Laptop', '2026-06-30');
        $pickupHtml = $pickupMail->build()->render();
        
        $this->assertStringContainsString('E-Waste Doorstep Pickup Confirmed', $pickupHtml);
        $this->assertStringContainsString('John Doe', $pickupHtml);
        $this->assertStringContainsString('Laptop', $pickupHtml);
        $this->assertStringContainsString('2026-06-30', $pickupHtml);

        // 2. Reward Credited mailable
        $rewardMail = new RewardCredited($user, 150, 'Laptop Recycling');
        $rewardHtml = $rewardMail->build()->render();

        $this->assertStringContainsString('Eco-Points Credited', $rewardHtml);
        $this->assertStringContainsString('John Doe', $rewardHtml);
        $this->assertStringContainsString('150 Eco-Points', $rewardHtml);
        $this->assertStringContainsString('Laptop Recycling', $rewardHtml);
    }
}
