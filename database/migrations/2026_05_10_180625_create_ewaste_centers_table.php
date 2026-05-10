<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ewaste_centers', function (Blueprint $table) {
            $table->id();

            // Basic Info
            $table->string('name');
            $table->text('address');
            $table->string('phone')->nullable();

            // Location (for distance calculation + Google Maps)
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);

            // Timing
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();

            // What they accept (comma-separated or JSON later)
            $table->text('accepted_items')->nullable();

            // Optional (for future features)
            $table->float('rating')->default(0);
            $table->integer('total_reviews')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ewaste_centers');
    }
};