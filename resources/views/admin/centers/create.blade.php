@extends('layouts.app')

@section('content')

<div style="max-width:600px;margin:auto;padding:20px;">

    <h2>➕ Add E-Waste Center</h2>

    @if(session('success'))
        <p style="color:green;">{{ session('success') }}</p>
    @endif

    <form method="POST" action="{{ route('centers.store') }}">
        @csrf

        <input type="text" name="name" placeholder="Center Name"
               style="width:100%;padding:10px;margin:5px 0;" required>

        <input type="text" name="address" placeholder="Address"
               style="width:100%;padding:10px;margin:5px 0;" required>

        <input type="text" name="phone" placeholder="Phone"
               style="width:100%;padding:10px;margin:5px 0;">

        <input type="text" name="latitude" placeholder="Latitude"
               style="width:100%;padding:10px;margin:5px 0;" required>

        <input type="text" name="longitude" placeholder="Longitude"
               style="width:100%;padding:10px;margin:5px 0;" required>

        <input type="time" name="open_time"
               style="width:100%;padding:10px;margin:5px 0;">

        <input type="time" name="close_time"
               style="width:100%;padding:10px;margin:5px 0;">

        <input type="text" name="accepted_items" placeholder="Accepted Items"
               style="width:100%;padding:10px;margin:5px 0;">

        <button type="submit"
                style="padding:10px 15px;background:green;color:white;border:none;margin-top:10px;">
            Save Center
        </button>

    </form>

</div>

@endsection