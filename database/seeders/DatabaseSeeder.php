<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Standard User
        User::factory()->create([
            'name' => 'Standard User',
            'email' => 'user@ewaste.com',
            'role' => 'user',
        ]);

        // Seed Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@ewaste.com',
            'role' => 'admin',
        ]);

        $this->call([
            EwasteCenterSeeder::class,
            DeviceSeeder::class,
            BadgeSeeder::class,
        ]);

        // Create additional community users
        $user1 = User::factory()->create(['name' => 'Eco Enthusiast', 'email' => 'eco@ewaste.com', 'role' => 'user']);
        $user2 = User::factory()->create(['name' => 'Green Recycler', 'email' => 'green@ewaste.com', 'role' => 'user']);
        $user3 = User::factory()->create(['name' => 'Earth Friend', 'email' => 'earth@ewaste.com', 'role' => 'user']);

        $defaultUser = User::where('email', 'user@ewaste.com')->first();

        // Seed Pickup Requests for Default User (Personal)
        \App\Models\PickupRequest::create([
            'user_id' => $defaultUser->id,
            'device_type' => 'TV',
            'brand' => 'Sony',
            'model' => 'Bravia 32"',
            'pickup_date' => '2026-01-15',
            'pickup_time' => '10:00 - 12:00',
            'address' => '123 User Street, Delhi',
            'contact_phone' => '1234567890',
            'status' => 'Completed',
            'notes' => 'Successfully recycled old CRT TV.'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $defaultUser->id,
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'model' => 'iPhone XR',
            'pickup_date' => '2026-02-18',
            'pickup_time' => '14:00 - 16:00',
            'address' => '123 User Street, Delhi',
            'contact_phone' => '1234567890',
            'status' => 'Completed',
            'notes' => 'Old battery bulging slightly.'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $defaultUser->id,
            'device_type' => 'Laptop',
            'brand' => 'Dell',
            'model' => 'Inspiron 15',
            'pickup_date' => '2026-03-10',
            'pickup_time' => '12:00 - 14:00',
            'address' => '123 User Street, Delhi',
            'contact_phone' => '1234567890',
            'status' => 'Completed',
            'notes' => 'No charger included.'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $defaultUser->id,
            'device_type' => 'Printer',
            'brand' => 'Canon',
            'model' => 'Pixma MG2520',
            'pickup_date' => '2026-04-05',
            'pickup_time' => '10:00 - 12:00',
            'address' => '123 User Street, Delhi',
            'contact_phone' => '1234567890',
            'status' => 'Cancelled',
            'notes' => 'Decided to keep it.'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $defaultUser->id,
            'device_type' => 'Battery',
            'brand' => 'Generic',
            'model' => 'Lithium Ion Pack',
            'pickup_date' => '2026-05-22',
            'pickup_time' => '16:00 - 18:00',
            'address' => '123 User Street, Delhi',
            'contact_phone' => '1234567890',
            'status' => 'Completed',
            'notes' => 'Laptop battery replacement.'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $defaultUser->id,
            'device_type' => 'Mobile',
            'brand' => 'Samsung',
            'model' => 'Galaxy S10',
            'pickup_date' => '2026-06-25',
            'pickup_time' => '10:00 - 12:00',
            'address' => '123 User Street, Delhi',
            'contact_phone' => '1234567890',
            'status' => 'Pending',
            'notes' => 'Please call before arrival.'
        ]);

        // Seed Pickup Requests for other users (Global Community)
        \App\Models\PickupRequest::create([
            'user_id' => $user1->id,
            'device_type' => 'Laptop',
            'brand' => 'HP',
            'model' => 'Pavilion x360',
            'pickup_date' => '2026-01-20',
            'pickup_time' => '12:00 - 14:00',
            'address' => '456 Green Ave, Delhi',
            'contact_phone' => '9876543210',
            'status' => 'Completed'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $user2->id,
            'device_type' => 'Printer',
            'brand' => 'HP',
            'model' => 'LaserJet 1020',
            'pickup_date' => '2026-02-14',
            'pickup_time' => '10:00 - 12:00',
            'address' => '789 Earth Blvd, Noida',
            'contact_phone' => '8765432109',
            'status' => 'Completed'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $user3->id,
            'device_type' => 'TV',
            'brand' => 'Samsung',
            'model' => 'QLED 55"',
            'pickup_date' => '2026-03-24',
            'pickup_time' => '14:00 - 16:00',
            'address' => '999 Hope Lane, Gurgaon',
            'contact_phone' => '7654321098',
            'status' => 'Completed'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $user1->id,
            'device_type' => 'Mobile',
            'brand' => 'OnePlus',
            'model' => '7 Pro',
            'pickup_date' => '2026-04-12',
            'pickup_time' => '16:00 - 18:00',
            'address' => '456 Green Ave, Delhi',
            'contact_phone' => '9876543210',
            'status' => 'Completed'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $user2->id,
            'device_type' => 'Battery',
            'brand' => 'Duracell',
            'model' => 'AA Rechargeables',
            'pickup_date' => '2026-05-02',
            'pickup_time' => '10:00 - 12:00',
            'address' => '789 Earth Blvd, Noida',
            'contact_phone' => '8765432109',
            'status' => 'Completed'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $user3->id,
            'device_type' => 'Laptop',
            'brand' => 'Apple',
            'model' => 'MacBook Pro 13',
            'pickup_date' => '2026-05-15',
            'pickup_time' => '12:00 - 14:00',
            'address' => '999 Hope Lane, Gurgaon',
            'contact_phone' => '7654321098',
            'status' => 'Completed'
        ]);

        \App\Models\PickupRequest::create([
            'user_id' => $user1->id,
            'device_type' => 'Battery',
            'brand' => 'Generic',
            'model' => 'Car Battery Lead-Acid',
            'pickup_date' => '2026-06-10',
            'pickup_time' => '14:00 - 16:00',
            'address' => '456 Green Ave, Delhi',
            'contact_phone' => '9876543210',
            'status' => 'Completed'
        ]);
    }
}
