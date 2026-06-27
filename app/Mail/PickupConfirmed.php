<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PickupConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $deviceType;
    public string $pickupDate;

    public function __construct(User $user, string $deviceType, string $pickupDate)
    {
        $this->user = $user;
        $this->deviceType = $deviceType;
        $this->pickupDate = $pickupDate;
    }

    public function build()
    {
        return $this->subject('E-Waste Doorstep Pickup Confirmed')
            ->html("<h3>E-Waste Doorstep Pickup Confirmed</h3>
                    <p>Hello {$this->user->name},</p>
                    <p>Your doorstep collection request for a <strong>{$this->deviceType}</strong> has been successfully scheduled for <strong>{$this->pickupDate}</strong>.</p>
                    <p>Thank you for recycling responsibly!</p>");
    }
}
