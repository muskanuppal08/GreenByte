@extends('layouts.app')

@section('content')

<div style="padding:20px;">

    <h2>📍 All E-Waste Centers</h2>

    <a href="/admin/centers/create"
       style="display:inline-block;margin:10px 0;padding:10px 15px;background:green;color:white;text-decoration:none;border-radius:5px;">
        ➕ Add New Center
    </a>

    @if($centers->count() == 0)
        <p>No centers found.</p>
    @else

        @foreach($centers as $center)

            <div style="border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:8px;background:#f9f9f9;">
                <h3>{{ $center->name }}</h3>
                <p>📍 {{ $center->address }}</p>
                <p>📞 {{ $center->phone }}</p>
                <p>📦 {{ $center->accepted_items }}</p>
                <p>⏰ {{ $center->open_time }} - {{ $center->close_time }}</p>
            </div>

        @endforeach

    @endif

</div>

@endsection