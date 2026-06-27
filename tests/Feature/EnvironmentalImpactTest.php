<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\PickupRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnvironmentalImpactTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_impact_or_analytics_routes(): void
    {
        $this->get('/impact')->assertRedirect('/login');
        $this->get('/admin/analytics')->assertRedirect('/login');
    }

    public function test_standard_user_can_access_personal_impact_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $response = $this->actingAs($user)->get('/impact');
        $response->assertStatus(200);
    }

    public function test_standard_user_cannot_access_admin_analytics_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        
        // Admins only: standard users should be redirected or unauthorized
        $response = $this->actingAs($user)->get('/admin/analytics');
        $response->assertRedirect('/');
    }

    public function test_admin_can_access_admin_analytics_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/analytics');
        $response->assertStatus(200);
    }

    public function test_metrics_calculation_for_completed_pickups(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        // Create completed pickups for user (Personal)
        PickupRequest::create([
            'user_id' => $user->id,
            'device_type' => 'Laptop',
            'brand' => 'Dell',
            'model' => 'Inspiron',
            'pickup_date' => now()->format('Y-m-d'),
            'pickup_time' => '10:00 - 12:00',
            'address' => 'Test Address',
            'contact_phone' => '1234567890',
            'status' => 'Completed'
        ]);

        PickupRequest::create([
            'user_id' => $user->id,
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'model' => 'iPhone',
            'pickup_date' => now()->format('Y-m-d'),
            'pickup_time' => '10:00 - 12:00',
            'address' => 'Test Address',
            'contact_phone' => '1234567890',
            'status' => 'Completed'
        ]);

        // Create a cancelled pickup (should NOT count towards metrics)
        PickupRequest::create([
            'user_id' => $user->id,
            'device_type' => 'TV',
            'brand' => 'Sony',
            'model' => 'CRT',
            'pickup_date' => now()->format('Y-m-d'),
            'pickup_time' => '10:00 - 12:00',
            'address' => 'Test Address',
            'contact_phone' => '1234567890',
            'status' => 'Cancelled'
        ]);

        // Create completed pickup for another user (Global Community)
        $otherUser = User::factory()->create(['role' => 'user']);
        PickupRequest::create([
            'user_id' => $otherUser->id,
            'device_type' => 'TV',
            'brand' => 'Samsung',
            'model' => 'LED',
            'pickup_date' => now()->format('Y-m-d'),
            'pickup_time' => '10:00 - 12:00',
            'address' => 'Test Address',
            'contact_phone' => '1234567890',
            'status' => 'Completed'
        ]);

        // Access User Impact Dashboard
        $response = $this->actingAs($user)->get('/impact');
        $response->assertStatus(200);

        // Personal: 1 Laptop (15.0kg CO2, 2.0kg weight) + 1 Mobile (2.5kg CO2, 0.2kg weight) = 17.5kg CO2, 2.2kg weight, 2 count
        $response->assertInertia(fn ($page) => $page
            ->component('Impact/Index')
            ->where('personalMetrics.count', 2)
            ->where('personalMetrics.co2_saved', 17.5)
            ->where('personalMetrics.waste_diverted', 2.2)
            
            // Global: Personal (2) + Other User TV (8.0kg CO2, 15.0kg weight, 1 count) = 3 count, 25.5kg CO2, 17.2kg weight
            ->where('globalMetrics.count', 3)
            ->where('globalMetrics.co2_saved', 25.5)
            ->where('globalMetrics.waste_diverted', 17.2)
        );

        // Access Admin Analytics Dashboard
        $admin = User::factory()->create(['role' => 'admin']);
        $adminResponse = $this->actingAs($admin)->get('/admin/analytics');
        $adminResponse->assertStatus(200);
        
        $adminResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Analytics')
            ->where('kpis.completed_pickups', 3)
            ->where('kpis.cancelled_pickups', 1)
            ->where('kpis.platform_carbon', 25.5)
            ->where('kpis.platform_waste', 17.2)
        );
    }
}
