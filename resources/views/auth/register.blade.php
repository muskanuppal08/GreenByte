<div style="display:flex; min-height:100vh;">

    <!-- LEFT SIDE IMAGE -->
    <div style="flex:1; background:#e8f5e9;
        display:flex;align-items:center;justify-content:center;">

        <div style="text-align:center;">
            <img src="https://cdn-icons-png.flaticon.com/512/1048/1048941.png"
                 style="width:200px;margin-bottom:20px;">

            <h2>Recycle E-Waste ♻️</h2>
            <p>Protect environment with smart disposal</p>
        </div>

    </div>

    <!-- RIGHT SIDE FORM -->
    <div style="flex:1; display:flex; align-items:center; justify-content:center;">

        <div style="width:80%;">

            <!-- KEEP YOUR EXISTING REGISTER FORM HERE -->
            {{ $slot ?? '' }}

        </div>

    </div>

</div>