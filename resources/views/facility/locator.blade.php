@extends('layouts.app')

@section('content')

<h2>Find Nearest E-Waste Centers 📍</h2>

<p id="status">Detecting your location...</p>

<!-- SEARCH + FILTER -->
<div style="margin-bottom:10px;">
    <input type="text" id="searchBox" placeholder="Enter city or pincode"
        style="padding:8px;width:250px;">

    <button onclick="searchLocation()"
        style="padding:8px 12px;background:blue;color:white;">
        Search
    </button>

    <label style="margin-left:10px;">
        <input type="checkbox" id="openNow">
        Open Now
    </label>
</div>

<!-- MAP -->
<div id="map" style="height: 500px; width: 100%; margin-bottom: 20px;"></div>

<!-- LIST -->
<div id="results"></div>

<!-- Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script>

let lat, lng;
let map;
let centerMarkers = [];
let userMarker;
let selectedMarker;

// INIT MAP
map = L.map('map', {
    scrollWheelZoom: true,
    dragging: true,
    doubleClickZoom: true,
    zoomControl: true
}).setView([26.9124, 75.7873], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// CLICK MAP
map.on('click', function(e) {

    lat = e.latlng.lat;
    lng = e.latlng.lng;

    document.getElementById("status").innerText =
        "📍 Location selected. Loading nearby centers...";

    if (selectedMarker) {
        map.removeLayer(selectedMarker);
    }

    selectedMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 Selected Location")
        .openPopup();

    loadCenters(lat, lng);
});

// GPS LOCATION
navigator.geolocation.getCurrentPosition(
function(position) {

    lat = position.coords.latitude;
    lng = position.coords.longitude;

    document.getElementById("status").innerText =
        "📍 Location detected. Searching nearby centers...";

    userMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 You are here")
        .openPopup();

    map.setView([lat, lng], 13);

    loadCenters(lat, lng);

},
function() {
    document.getElementById("status").innerText =
        "❌ Location access denied.";
});

// 🌍 NAVIGATE FUNCTION (NEW CLEAN VERSION)
function navigateTo(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat + ',' + lng)}`;
    window.open(url, "_blank");
}

// SEARCH
function searchLocation() {

    let query = document.getElementById("searchBox").value;

    if (!query) return alert("Enter city or pincode");

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
    .then(res => res.json())
    .then(data => {

        if (!data.length) return alert("Location not found");

        lat = data[0].lat;
        lng = data[0].lon;

        map.setView([lat, lng], 13);
        loadCenters(lat, lng);
    });
}

// LOAD CENTERS
function loadCenters(userLat, userLng) {

    centerMarkers.forEach(m => map.removeLayer(m));
    centerMarkers = [];

    document.getElementById("status").innerText =
        "Loading nearby centers...";

    fetch("/nearest-centers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": "{{ csrf_token() }}"
        },
        body: JSON.stringify({
            latitude: userLat,
            longitude: userLng,
            open_now: document.getElementById("openNow").checked
        })
    })
    .then(res => res.json())
    .then(data => {

        let html = "";

        if (!data.length) {
            document.getElementById("results").innerHTML =
                "<h3>No centers found nearby</h3>";
            return;
        }

        data.forEach(center => {

            // MARKER
            let marker = L.marker([center.latitude, center.longitude])
                .addTo(map)
                .bindPopup(`
                    <b>${center.name}</b><br>
                    ${center.address}<br><br>

                    <button onclick="navigateTo(${center.latitude}, ${center.longitude})"
                        style="background:green;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">
                        Navigate
                    </button>
                `);

            centerMarkers.push(marker);

            // CARD
            html += `
                <div style="border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:8px;background:#f9f9f9;">
                    <h3>${center.name}</h3>
                    <p>📍 ${center.address}</p>
                    <p>📞 ${center.phone ?? 'Not Available'}</p>
                    <p>📏 ${center.distance.toFixed(2)} km away</p>

                    <button onclick="navigateTo(${center.latitude}, ${center.longitude})"
                        style="padding:6px 10px;background:green;color:white;border:none;border-radius:5px;cursor:pointer;">
                        Navigate
                    </button>
                </div>
            `;
        });

        document.getElementById("results").innerHTML = html;
        document.getElementById("status").innerText =
            "Nearest E-Waste Centers Found";

    })
    .catch(err => {
        console.log(err);
        document.getElementById("status").innerText =
            "Error loading centers";
    });
}

</script>

@endsection