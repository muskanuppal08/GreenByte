<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatbotController extends Controller
{
    /**
     * Parse and respond to chatbot queries.
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $message = strtolower($validated['message']);
        $response = "";

        if (str_contains($message, 'battery') || str_contains($message, 'batteries') || str_contains($message, 'cell')) {
            $response = "🔋 **Battery Recycling Guide**:\nBatteries contain highly toxic heavy metals like Cadmium, Nickel, and Lithium. Dumping them in household waste causes chemical seepage into soil. Please wrap battery terminals in tape and schedule a doorstep collection on our platform, or locate the nearest center accepting Batteries.";
        } elseif (str_contains($message, 'phone') || str_contains($message, 'mobile') || str_contains($message, 'iphone') || str_contains($message, 'smartphone')) {
            $response = "📱 **Mobile Phone Recycling Guide**:\nPhones contain precious metals (Gold, Silver, Copper) and hazardous Lead. Recycling a mobile phone on GreenByte can award you up to **100 Eco-Points** and offset **2.5kg of CO₂**. Search for the closest mobile recycler using our Facility Locator!";
        } elseif (str_contains($message, 'laptop') || str_contains($message, 'computer') || str_contains($message, 'pc') || str_contains($message, 'notebook')) {
            $response = "💻 **Laptop Recycling Guide**:\nLaptops contain mercury backlights, lead solder, and valuable copper. Recycling a laptop redirects **2.0kg of waste** from landfills, offsets **15kg of CO₂**, and awards **250 Eco-Points** (scaled by condition). Book a doorstep pickup today!";
        } elseif (str_contains($message, 'tv') || str_contains($message, 'television') || str_contains($message, 'monitor') || str_contains($message, 'display')) {
            $response = "📺 **TV & Monitor Recycling Guide**:\nTV screens (especially older CRT monitors) contain up to **500g of Lead**, which causes severe brain and organ damage if released. Televisions represent a High-Risk hazard category. Please schedule a doorstep pickup so our team can handle it safely.";
        } elseif (str_contains($message, 'printer') || str_contains($message, 'scanner') || str_contains($message, 'copier')) {
            $response = "🖨️ **Printer Recycling Guide**:\nPrinters contain recyclable aluminum, copper, and hard plastics. Please remove any ink or toner cartridges before handoff (these can often be sent back to manufacturers). Standard printers earn **100 Eco-Points** when recycled.";
        } elseif (str_contains($message, 'point') || str_contains($message, 'reward') || str_contains($message, 'badge') || str_contains($message, 'level')) {
            $response = "🏆 **Eco-Points & Gamification Guide**:\nYou earn Eco-Points by completing doorstep recycling pickups or using the Reward Calculator. Points accumulate to raise your Green Level (*Eco Beginner* -> *Green Warrior* -> *Earth Saver*). Reaching point thresholds automatically unlocks custom badges on your Leaderboard page!";
        } else {
            $response = "👋 Hello! I am your **E-Waste Assistant**.\nI can help you recycle responsibly! Ask me about:\n- How to dispose of **Mobiles, Laptops, Batteries, TVs, or Printers**.\n- How our **Eco-Points, Rewards, or Leaderboard** systems work.\n- Where to dump your electronic waste.";
        }

        return response()->json([
            'response' => $response
        ]);
    }
}
