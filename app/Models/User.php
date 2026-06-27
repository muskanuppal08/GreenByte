<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'city',
        'pincode',
        'profile_picture',
        'phone',
        'eco_points',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     */
    protected $appends = [
        'profile_picture_url',
        'initials',
        'green_level',
        'next_level_progress',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // ─── Role Helpers ──────────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // ─── Profile Picture ───────────────────────────────────────────────────

    public function getProfilePictureUrlAttribute(): string
    {
        if ($this->profile_picture) {
            return asset('storage/' . $this->profile_picture);
        }
        // Gravatar fallback
        $hash = md5(strtolower(trim($this->email)));
        return "https://www.gravatar.com/avatar/{$hash}?d=identicon&s=200";
    }

    public function getInitialsAttribute(): string
    {
        $words = explode(' ', $this->name);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $word) {
            $initials .= strtoupper($word[0]);
        }
        return $initials;
    }

    public function rewardCalculations()
    {
        return $this->hasMany(RewardCalculation::class);
    }

    public function badges()
    {
        return $this->belongsToMany(Badge::class)->withTimestamps();
    }

    public function getGreenLevelAttribute(): string
    {
        if ($this->eco_points >= 1500) {
            return 'Earth Saver';
        } elseif ($this->eco_points >= 500) {
            return 'Green Warrior';
        }
        return 'Eco Beginner';
    }

    public function getNextLevelProgressAttribute(): array
    {
        $points = $this->eco_points;
        if ($points >= 1500) {
            return [
                'current' => $points,
                'target' => 1500,
                'percent' => 100,
                'next_level' => 'Max Level'
            ];
        } elseif ($points >= 500) {
            $target = 1500;
            $current = $points - 500;
            $range = 1000;
            $percent = min(100, (int) (($current / $range) * 100));
            return [
                'current' => $points,
                'target' => $target,
                'percent' => $percent,
                'next_level' => 'Earth Saver'
            ];
        } else {
            $target = 500;
            $current = $points;
            $range = 500;
            $percent = min(100, (int) (($current / $range) * 100));
            return [
                'current' => $points,
                'target' => $target,
                'percent' => $percent,
                'next_level' => 'Green Warrior'
            ];
        }
    }

    public function checkAndAwardBadges(): void
    {
        // Fetch all system badges
        $badges = Badge::all();
        if ($badges->isEmpty()) {
            return;
        }

        // Unlocked badges by this user
        $earnedBadgeIds = $this->badges()->pluck('badges.id')->toArray();

        // Calculate current metrics
        $calculationsCount = $this->rewardCalculations()->count();
        // Count only approved reviews
        $reviewsCount = $this->reviews()->where('approved', true)->count();
        $points = $this->eco_points;

        $badgesToAward = [];

        foreach ($badges as $badge) {
            if (in_array($badge->id, $earnedBadgeIds)) {
                continue;
            }

            $shouldAward = false;

            if ($badge->rule_type === 'points' && $points >= $badge->rule_value) {
                $shouldAward = true;
            } elseif ($badge->rule_type === 'calculations' && $calculationsCount >= $badge->rule_value) {
                $shouldAward = true;
            } elseif ($badge->rule_type === 'reviews' && $reviewsCount >= $badge->rule_value) {
                $shouldAward = true;
            }

            if ($shouldAward) {
                $badgesToAward[] = $badge->id;
            }
        }

        if (!empty($badgesToAward)) {
            $this->badges()->attach($badgesToAward);
        }
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function pickupRequests()
    {
        return $this->hasMany(PickupRequest::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}