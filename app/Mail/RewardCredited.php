<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RewardCredited extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public int $points;
    public string $reason;

    public function __construct(User $user, int $points, string $reason = '')
    {
        $this->user = $user;
        $this->points = $points;
        $this->reason = $reason;
    }

    public function build()
    {
        $reasonText = $this->reason ? " for: <em>{$this->reason}</em>" : "";
        return $this->subject('Eco-Points Credited!')
            ->html("<h3>Congratulations! Eco-Points Credited</h3>
                    <p>Hello {$this->user->name},</p>
                    <p>You have been credited with <strong>{$this->points} Eco-Points</strong>{$reasonText}.</p>
                    <p>Your new total points balance is: <strong>{$this->user->eco_points}</strong>.</p>
                    <p>Keep recycling and level up on the leaderboard!</p>");
    }
}
