import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ personalMetrics, globalMetrics, donutData, barChartData, lineChartData, recentHistory }) {
    const [hoveredSlice, setHoveredSlice] = useState(null);
    const [hoveredBar, setHoveredBar] = useState(null);
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // 1. Math for Donut Chart
    const totalDonutPersonal = donutData.reduce((sum, item) => sum + item.personal, 0);
    const totalDonutGlobal = donutData.reduce((sum, item) => sum + item.global, 0);
    
    // Circ = 2 * pi * r (r=50 => circ=314.16)
    const CIRCUMFERENCE = 314.16;
    let accumulatedPercentPersonal = 0;
    let accumulatedPercentGlobal = 0;

    const donutSlicesPersonal = donutData.map((item) => {
        const percent = totalDonutPersonal > 0 ? (item.personal / totalDonutPersonal) * 100 : 0;
        const dashArray = `${(percent * CIRCUMFERENCE) / 100} ${CIRCUMFERENCE}`;
        const dashOffset = CIRCUMFERENCE - (accumulatedPercentPersonal * CIRCUMFERENCE) / 100;
        accumulatedPercentPersonal += percent;
        return { ...item, percent, dashArray, dashOffset };
    });

    const donutSlicesGlobal = donutData.map((item) => {
        const percent = totalDonutGlobal > 0 ? (item.global / totalDonutGlobal) * 100 : 0;
        const dashArray = `${(percent * CIRCUMFERENCE) / 100} ${CIRCUMFERENCE}`;
        const dashOffset = CIRCUMFERENCE - (accumulatedPercentGlobal * CIRCUMFERENCE) / 100;
        accumulatedPercentGlobal += percent;
        return { ...item, percent, dashArray, dashOffset };
    });

    // 2. Math for Bar Chart (SVG height & scaling)
    const maxBarVal = Math.max(...barChartData.map(d => Math.max(d.personal, d.global)), 5);
    const BAR_CHART_HEIGHT = 160;
    const getBarHeight = (val) => (val / maxBarVal) * BAR_CHART_HEIGHT;

    // 3. Math for Line Chart (SVG height & scaling)
    const maxLineVal = Math.max(...lineChartData.map(d => d.global_carbon), 50);
    const LINE_CHART_HEIGHT = 140;
    const getLineY = (val) => LINE_CHART_HEIGHT - (val / maxLineVal) * LINE_CHART_HEIGHT + 20;

    // Generate Path D string for Line Chart (Global)
    const globalPoints = lineChartData.map((d, i) => ({
        x: 40 + i * 160,
        y: getLineY(d.global_carbon)
    }));
    const globalPathD = globalPoints.length > 0
        ? `M ${globalPoints[0].x} ${globalPoints[0].y} ` + globalPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : '';
    const globalAreaD = globalPoints.length > 0
        ? `${globalPathD} L ${globalPoints[globalPoints.length - 1].x} ${LINE_CHART_HEIGHT + 20} L ${globalPoints[0].x} ${LINE_CHART_HEIGHT + 20} Z`
        : '';

    // Generate Path D string for Line Chart (Personal)
    const personalPoints = lineChartData.map((d, i) => ({
        x: 40 + i * 160,
        y: getLineY(d.personal_carbon)
    }));
    const personalPathD = personalPoints.length > 0
        ? `M ${personalPoints[0].x} ${personalPoints[0].y} ` + personalPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : '';
    const personalAreaD = personalPoints.length > 0
        ? `${personalPathD} L ${personalPoints[personalPoints.length - 1].x} ${LINE_CHART_HEIGHT + 20} L ${personalPoints[0].x} ${LINE_CHART_HEIGHT + 20} Z`
        : '';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Environmental Impact Dashboard
                </h2>
            }
        >
            <Head title="Impact Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="absolute inset-0 bg-slate-950/15 backdrop-blur-[0.5px]" />
                        <div className="relative z-10 space-y-3 max-w-2xl text-center md:text-left">
                            <span className="bg-white/20 border border-white/30 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full">
                                Eco Performance Metrics
                            </span>
                            <h3 className="text-3xl font-black">Your Green Recycling Footprint</h3>
                            <p className="text-emerald-100 text-sm leading-relaxed">
                                Thank you for being an active recycler. Here, you can monitor your carbon savings, diverted landfill waste, and precious metals recovered. Compare your personal contribution against the global community's milestones!
                            </p>
                        </div>
                        <div className="relative z-10 shrink-0 bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md text-center">
                            <p className="text-3xl">🌱</p>
                            <p className="text-2xl font-black mt-2">{personalMetrics.co2_saved} kg</p>
                            <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">CO₂ Saved by You</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        
                        {/* Devices Recycled */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">📱</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">RECYCLED ITEMS</span>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-800 dark:text-white">{personalMetrics.count} <span className="text-xs font-semibold text-slate-400">devices</span></h4>
                                <p className="text-xs text-slate-400 mt-1">Community: <span className="font-bold text-emerald-600 dark:text-emerald-450">{globalMetrics.count}</span> total</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 flex justify-between font-semibold">
                                <span>Platform Share:</span>
                                <span>{globalMetrics.count > 0 ? round((personalMetrics.count / globalMetrics.count) * 100, 1) : 0}%</span>
                            </div>
                        </div>

                        {/* CO2 Emissions */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">⚡</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">CO₂ SAVED</span>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-800 dark:text-white">{personalMetrics.co2_saved} <span className="text-xs font-semibold text-slate-400">kg</span></h4>
                                <p className="text-xs text-slate-400 mt-1">Community: <span className="font-bold text-cyan-600 dark:text-cyan-400">{globalMetrics.co2_saved} kg</span></p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 flex justify-between font-semibold">
                                <span>Equivalent:</span>
                                <span>🌲 {Math.ceil(personalMetrics.co2_saved / 22)} Tree-years</span>
                            </div>
                        </div>

                        {/* Landfill Diverted */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">⚖️</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">WASTE DIVERTED</span>
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-slate-800 dark:text-white">{personalMetrics.waste_diverted} <span className="text-xs font-semibold text-slate-400">kg</span></h4>
                                <p className="text-xs text-slate-400 mt-1">Community: <span className="font-bold text-amber-600 dark:text-amber-500">{globalMetrics.waste_diverted} kg</span></p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 flex justify-between font-semibold">
                                <span>Saved from dump:</span>
                                <span>🗑️ {Math.ceil(personalMetrics.waste_diverted * 5)} Standard bins</span>
                            </div>
                        </div>

                        {/* Precious Metals */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl">✨</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">METALS RECOVERED</span>
                            </div>
                            <div className="space-y-1.5">
                                {personalMetrics.metals.slice(0, 3).map((metal, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-slate-500 dark:text-slate-400">{metal.name}</span>
                                        <span className="font-black text-slate-800 dark:text-slate-200">{metal.amount}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 text-center font-bold">
                                Gold & Silver extracted safely!
                            </div>
                        </div>
                    </div>

                    {/* Charts Panel Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* 1. Bar Chart: Monthly Recycled Compare (8 Cols) */}
                        <div className="md:col-span-8 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Monthly Recycling Activity</h4>
                                    <p className="text-[10px] text-slate-450 mt-0.5">Recycling counts: Personal (Green) vs Community (Cyan)</p>
                                </div>
                                <div className="flex items-center space-x-3 text-xs">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-3 w-3 rounded-full bg-emerald-500 block"></span>
                                        <span className="text-slate-500 font-semibold">You</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="h-3 w-3 rounded-full bg-cyan-500 block"></span>
                                        <span className="text-slate-500 font-semibold">Community</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bar Chart Container */}
                            <div className="relative pt-6">
                                <svg className="w-full h-48" viewBox="0 0 960 200" xmlns="http://www.w3.org/2000/svg">
                                    {/* Grid Lines */}
                                    <line x1="40" y1="20" x2="940" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-gray-850" />
                                    <line x1="40" y1="60" x2="940" y2="60" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-gray-850" />
                                    <line x1="40" y1="100" x2="940" y2="100" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-gray-850" />
                                    <line x1="40" y1="140" x2="940" y2="140" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-gray-850" />
                                    <line x1="40" y1="180" x2="940" y2="180" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-gray-700" />

                                    {/* Monthly Columns */}
                                    {barChartData.map((d, i) => {
                                        const colX = 100 + i * 150;
                                        const pHeight = getBarHeight(d.personal);
                                        const gHeight = getBarHeight(d.global);
                                        
                                        return (
                                            <g key={i} className="cursor-pointer group">
                                                {/* Global Bar */}
                                                <rect
                                                    x={colX + 22}
                                                    y={180 - gHeight}
                                                    width="20"
                                                    height={gHeight}
                                                    fill="#06b6d4"
                                                    rx="4"
                                                    className="transition-all duration-300 hover:fill-cyan-600"
                                                    onMouseEnter={() => setHoveredBar({ month: d.month, type: 'Community', count: d.global })}
                                                    onMouseLeave={() => setHoveredBar(null)}
                                                />
                                                {/* Personal Bar */}
                                                <rect
                                                    x={colX}
                                                    y={180 - pHeight}
                                                    width="20"
                                                    height={pHeight}
                                                    fill="#10b981"
                                                    rx="4"
                                                    className="transition-all duration-300 hover:fill-emerald-600"
                                                    onMouseEnter={() => setHoveredBar({ month: d.month, type: 'You', count: d.personal })}
                                                    onMouseLeave={() => setHoveredBar(null)}
                                                />
                                                {/* Month Label */}
                                                <text
                                                    x={colX + 20}
                                                    y="195"
                                                    textAnchor="middle"
                                                    className="text-[10px] fill-slate-400 dark:fill-slate-500 font-bold"
                                                >
                                                    {d.month}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Bar Chart Tooltip */}
                                {hoveredBar && (
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-slate-800">
                                        {hoveredBar.month}: {hoveredBar.type} recycled {hoveredBar.count} item(s)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Donut Chart: E-Waste Categories (4 Cols) */}
                        <div className="md:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6 flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Device Distribution</h4>
                                <p className="text-[10px] text-slate-450 mt-0.5">Distribution breakdown of items recycled</p>
                            </div>

                            {/* Donut graphic */}
                            <div className="relative flex justify-center py-4">
                                <svg width="160" height="160" viewBox="0 0 120 120" className="transform -rotate-90">
                                    <circle cx="60" cy="60" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="12" className="dark:stroke-gray-900" />
                                    
                                    {totalDonutGlobal > 0 && donutSlicesGlobal.map((slice, idx) => (
                                        <circle
                                            key={idx}
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            fill="transparent"
                                            stroke={slice.color}
                                            strokeWidth="12"
                                            strokeDasharray={slice.dashArray}
                                            strokeDashoffset={slice.dashOffset}
                                            strokeLinecap="round"
                                            className="transition-all duration-300 cursor-pointer"
                                            onMouseEnter={() => setHoveredSlice({ device: slice.device, percent: Math.round(slice.percent), count: slice.global })}
                                            onMouseLeave={() => setHoveredSlice(null)}
                                        />
                                    ))}
                                </svg>

                                {/* Centered tooltip label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                    {hoveredSlice ? (
                                        <>
                                            <span className="text-xs font-black text-slate-800 dark:text-white">{hoveredSlice.device}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{hoveredSlice.percent}% ({hoveredSlice.count})</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xs font-black text-slate-800 dark:text-white">Community</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{totalDonutGlobal} Items</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Color Legend */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 border-t border-slate-50 dark:border-slate-800/80 pt-3">
                                {donutData.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-1.5">
                                        <span className="h-2.5 w-2.5 rounded bg-block" style={{ backgroundColor: item.color }} />
                                        <span>{item.device} ({item.global})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Cumulative Carbon Line Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6">
                        <div>
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Cumulative Carbon Reduction</h4>
                            <p className="text-[10px] text-slate-450 mt-0.5">Chronological offset curves in kg of CO₂ saved</p>
                        </div>

                        <div className="relative">
                            <svg className="w-full h-44" viewBox="0 0 960 180" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="globalGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                                    </linearGradient>
                                    <linearGradient id="personalGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Y-Axis grid lines */}
                                <line x1="40" y1="20" x2="940" y2="20" stroke="#f8fafc" strokeWidth="1" className="dark:stroke-gray-850" />
                                <line x1="40" y1="60" x2="940" y2="60" stroke="#f8fafc" strokeWidth="1" className="dark:stroke-gray-850" />
                                <line x1="40" y1="100" x2="940" y2="100" stroke="#f8fafc" strokeWidth="1" className="dark:stroke-gray-850" />
                                <line x1="40" y1="140" x2="940" y2="140" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-gray-700" />

                                {/* Area shading */}
                                <path d={globalAreaD} fill="url(#globalGrad)" />
                                <path d={personalAreaD} fill="url(#personalGrad)" />

                                {/* Line curves */}
                                <path d={globalPathD} fill="none" stroke="#06b6d4" strokeWidth="3" />
                                <path d={personalPathD} fill="none" stroke="#10b981" strokeWidth="3" />

                                {/* Interactive Points */}
                                {lineChartData.map((d, i) => {
                                    const cxP = 40 + i * 160;
                                    const cyP = getLineY(d.personal_carbon);
                                    const cyG = getLineY(d.global_carbon);
                                    
                                    return (
                                        <g key={i} className="cursor-pointer">
                                            {/* Community dots */}
                                            <circle
                                                cx={cxP}
                                                cy={cyG}
                                                r="5"
                                                fill="#06b6d4"
                                                stroke="#ffffff"
                                                strokeWidth="1.5"
                                                className="transition-all duration-300 hover:r-7"
                                                onMouseEnter={() => setHoveredPoint({ month: d.month, personal: d.personal_carbon, global: d.global_carbon })}
                                                onMouseLeave={() => setHoveredPoint(null)}
                                            />
                                            {/* Personal dots */}
                                            <circle
                                                cx={cxP}
                                                cy={cyP}
                                                r="5"
                                                fill="#10b981"
                                                stroke="#ffffff"
                                                strokeWidth="1.5"
                                                className="transition-all duration-300 hover:r-7"
                                                onMouseEnter={() => setHoveredPoint({ month: d.month, personal: d.personal_carbon, global: d.global_carbon })}
                                                onMouseLeave={() => setHoveredPoint(null)}
                                            />
                                            {/* Axis labels */}
                                            <text x={cxP} y="160" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500">
                                                {d.month}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Line Chart Tooltip */}
                            {hoveredPoint && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-800 flex space-x-4">
                                    <span>📆 {hoveredPoint.month}</span>
                                    <span>You: <strong className="text-emerald-400">{hoveredPoint.personal} kg</strong></span>
                                    <span>Community: <strong className="text-cyan-400">{hoveredPoint.global} kg</strong></span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline logs */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800/80">Your Recent Recycling History</h4>
                        
                        {recentHistory.length > 0 ? (
                            <div className="space-y-4 pt-2">
                                {recentHistory.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">♻️</span>
                                            <div>
                                                <p className="font-extrabold text-slate-900 dark:text-white">{item.device_type} ({item.brand} {item.model})</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Recycled on: {item.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-right">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Carbon Saved</p>
                                                <p className="font-extrabold text-emerald-600 dark:text-emerald-450">-{item.carbon_saved} kg</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Points Earned</p>
                                                <p className="font-extrabold text-amber-500">+{item.points_earned} pts</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 pt-4 text-center">No completed recycling orders found in your history yet.</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
