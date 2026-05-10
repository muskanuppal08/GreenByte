@extends('layouts.app')

@section('content')

<div style="padding:20px;">

    <h1>Welcome to E-Waste Management System ♻️</h1>

    <p style="color:gray;">
        Find nearest recycling centers and manage e-waste responsibly.
    </p>

    <a href="/admin/centers/create"
   style="padding:10px 15px;background:#000;color:white;border-radius:8px;text-decoration:none;">
   ➕ Add Center
</a>
    <!-- QUICK ACTION CARD -->
    <div style="margin-top:20px; display:flex; gap:15px; flex-wrap:wrap;">

        <a href="/facility-locator"
           style="padding:15px 20px;background:#16a34a;color:white;
           border-radius:10px;text-decoration:none;">
            📍 Find Nearby Centers
        </a>

        <a href="/education"
           style="padding:15px 20px;background:#2563eb;color:white;
           border-radius:10px;text-decoration:none;">
            📚 Learn About E-Waste
        </a>

    </div>

    <!-- MINI INFO BOX -->
    <div style="margin-top:30px;padding:15px;border:1px solid #ddd;border-radius:10px;">
        <h3>🔎 Quick Overview</h3>
        <ul>
            <li>Find nearest e-waste centers using GPS</li>
            <li>Check accepted devices</li>
            <li>Navigate using Google Maps</li>
        </ul>
    </div>

    <!-- MINI MAP -->
    <h3 style="margin-top:30px;">🌍 Quick Map View</h3>
    <div id="miniMap" style="height:300px;margin-top:10px;border-radius:10px;"></div>

</div>

<!-- ✅ IMPORTANT: ADD LEAFLET -->
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {

    // Initialize map
    let miniMap = L.map('miniMap').setView([26.9124, 75.7873], 5);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(miniMap);

    // Optional marker (India center example)
    L.marker([26.9124, 75.7873])
        .addTo(miniMap)
        .bindPopup("E-Waste System Base Location")
        .openPopup();

});
</script>

@endsection