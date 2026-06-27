import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Analytics({ kpis, deviceBreakdown, monthlyTrends, topRecyclers, facilityStats }) {
    const [hoveredSlice, setHoveredSlice] = useState(null);
    const [hoveredBar, setHoveredBar] = useState(null);

    // Donut chart math
    const totalDevicesCount = deviceBreakdown.reduce((sum, item) => sum + item.count, 0);
    const CIRCUMFERENCE = 314.16;
    let accumulatedPercent = 0;

    const donutSlices = deviceBreakdown.map((item) => {
        const percent = totalDevicesCount > 0 ? (item.count / totalDevicesCount) * 100 : 0;
        const dashArray = `${(percent * CIRCUMFERENCE) / 100} ${CIRCUMFERENCE}`;
        const dashOffset = CIRCUMFERENCE - (accumulatedPercent * CIRCUMFERENCE) / 100;
        accumulatedPercent += percent;
        return { ...item, percent, dashArray, dashOffset };
    });

    // Bar chart math (completed vs cancelled)
    const maxTrendVal = Math.max(...monthlyTrends.map(d => Math.max(d.completed, d.cancelled)), 5);
    const BAR_CHART_HEIGHT = 140;
    const getBarHeight = (val) => (val / maxTrendVal) * BAR_CHART_HEIGHT;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Platform Analytics & Performance
                </h2>
            }
        >
            <Head title="Platform Analytics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Admin Header Title */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-750">
                        <div className="relative z-10 space-y-2 max-w-2xl text-center md:text-left">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full">
                                Platform Overview
                            </span>
                            <h3 className="text-2xl font-black">Analytics Dashboard</h3>
                            <p className="text-slate-350 text-xs leading-relaxed">
                                Administrative metrics control panel. Review general user activity, certified facility distribution, and recycling transaction trends across the platform.
                            </p>
                        </div>
                        <div className="relative z-10 shrink-0 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-md flex gap-6 text-center">
                            <div>
                                <p className="text-2xl font-black text-emerald-400">{kpis.platform_carbon} t</p>
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total CO₂ Saved</p>
                            </div>
                            <div className="border-l border-slate-700/50 h-10 my-auto"></div>
                            <div>
                                <p className="text-2xl font-black text-cyan-400">{kpis.platform_waste} t</p>
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Total Waste Saved</p>
                            </div>
                        </div>
                    </div>

                    {/* KPI Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        
                        {/* Users & Centers */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider text-[10px]">MEMBERS & SITES</span>
                                <span className="text-xl">👥</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.total_users}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Recyclers</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-2xl font-black text-slate-850 dark:text-white">{kpis.total_facilities}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Centers</p>
                                </div>
                            </div>
                        </div>

                        {/* Points Issued */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider text-[10px]">POINTS DISTRIBUTED</span>
                                <span className="text-xl">🏆</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.total_points} <span className="text-xs text-slate-400">pts</span></h4>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Global rewards balance</p>
                            </div>
                        </div>

                        {/* Pickups Ratio */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider text-[10px]">PICKUPS STATUS</span>
                                <span className="text-xl">📦</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-bold text-slate-500">
                                <div className="bg-emerald-500/5 p-1.5 rounded-lg">
                                    <p className="text-emerald-600 dark:text-emerald-450 font-black">{kpis.completed_pickups}</p>
                                    <p className="text-[8px] text-slate-400 uppercase mt-0.5">Done</p>
                                </div>
                                <div className="bg-amber-500/5 p-1.5 rounded-lg">
                                    <p className="text-amber-600 dark:text-amber-500 font-black">{kpis.scheduled_pickups}</p>
                                    <p className="text-[8px] text-slate-400 uppercase mt-0.5">Sched</p>
                                </div>
                                <div className="bg-rose-500/5 p-1.5 rounded-lg">
                                    <p className="text-rose-600 dark:text-rose-450 font-black">{kpis.pending_pickups}</p>
                                    <p className="text-[8px] text-slate-400 uppercase mt-0.5">Pend</p>
                                </div>
                            </div>
                        </div>

                        {/* Cancellation Rate */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-slate-400 uppercase tracking-wider text-[10px]">CANCELLED PICKUPS</span>
                                <span className="text-xl">⚠️</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 dark:text-white">{kpis.cancelled_pickups} <span className="text-xs text-slate-450">pickups</span></h4>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">
                                    Ratio: {kpis.completed_pickups + kpis.cancelled_pickups > 0 
                                        ? Math.round((kpis.cancelled_pickups / (kpis.completed_pickups + kpis.cancelled_pickups)) * 100) 
                                        : 0}% cancellation rate
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chart Dashboard Panels */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* 1. Bar Chart: Completed vs Cancelled monthly (8 Cols) */}
                        <div className="md:col-span-8 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Recycling Collection Trends</h4>
                                    <p className="text-[10px] text-slate-450 mt-0.5">Monthly completed vs cancelled doorstep pickups</p>
                                </div>
                                <div className="flex items-center space-x-3 text-xs">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-3 w-3 rounded-full bg-emerald-500 block"></span>
                                        <span className="text-slate-500 font-semibold">Completed</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="h-3 w-3 rounded-full bg-rose-500 block"></span>
                                        <span className="text-slate-500 font-semibold">Cancelled</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative pt-6">
                                <svg className="w-full h-44" viewBox="0 0 960 180" xmlns="http://www.w3.org/2000/svg">
                                    {/* Grid lines */}
                                    <line x1="40" y1="20" x2="940" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-gray-850" />
                                    <line x1="40" y1="60" x2="940" y2="60" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-gray-850" />
                                    <line x1="40" y1="100" x2="940" y2="100" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-gray-850" />
                                    <line x1="40" y1="140" x2="940" y2="140" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-gray-700" />

                                    {/* Bar rendering */}
                                    {monthlyTrends.map((d, i) => {
                                        const colX = 100 + i * 150;
                                        const compHeight = getBarHeight(d.completed);
                                        const cancHeight = getBarHeight(d.cancelled);

                                        return (
                                            <g key={i} className="cursor-pointer group">
                                                {/* Cancelled Bar */}
                                                <rect
                                                    x={colX + 22}
                                                    y={140 - cancHeight}
                                                    width="20"
                                                    height={cancHeight}
                                                    fill="#f43f5e"
                                                    rx="4"
                                                    className="transition-all duration-300 hover:fill-rose-600"
                                                    onMouseEnter={() => setHoveredBar({ month: d.month, type: 'Cancelled', count: d.cancelled })}
                                                    onMouseLeave={() => setHoveredBar(null)}
                                                />
                                                {/* Completed Bar */}
                                                <rect
                                                    x={colX}
                                                    y={140 - compHeight}
                                                    width="20"
                                                    height={compHeight}
                                                    fill="#10b981"
                                                    rx="4"
                                                    className="transition-all duration-300 hover:fill-emerald-600"
                                                    onMouseEnter={() => setHoveredBar({ month: d.month, type: 'Completed', count: d.completed })}
                                                    onMouseLeave={() => setHoveredBar(null)}
                                                />
                                                {/* Month name */}
                                                <text
                                                    x={colX + 20}
                                                    y="160"
                                                    textAnchor="middle"
                                                    className="text-[10px] fill-slate-400 dark:fill-slate-500 font-bold"
                                                >
                                                    {d.month}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Tooltip */}
                                {hoveredBar && (
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg border border-slate-800">
                                        {hoveredBar.month}: {hoveredBar.count} {hoveredBar.type} request(s)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Donut Chart: Device Type Distribution (4 Cols) */}
                        <div className="md:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Category Distribution</h4>
                                <p className="text-[10px] text-slate-455 mt-0.5">E-Waste device counts recycled</p>
                            </div>

                            <div className="relative flex justify-center py-2">
                                <svg width="150" height="150" viewBox="0 0 120 120" className="transform -rotate-90">
                                    <circle cx="60" cy="60" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="12" className="dark:stroke-gray-900" />
                                    
                                    {totalDevicesCount > 0 && donutSlices.map((slice, idx) => (
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
                                            onMouseEnter={() => setHoveredSlice({ device: slice.device, percent: Math.round(slice.percent), count: slice.count })}
                                            onMouseLeave={() => setHoveredSlice(null)}
                                        />
                                    ))}
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                    {hoveredSlice ? (
                                        <>
                                            <span className="text-xs font-black text-slate-800 dark:text-white">{hoveredSlice.device}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{hoveredSlice.percent}% ({hoveredSlice.count})</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xs font-black text-slate-800 dark:text-white">Overall</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{totalDevicesCount} Items</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Legends */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 border-t border-slate-50 dark:border-slate-800/80 pt-3">
                                {deviceBreakdown.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-1.5">
                                        <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: item.color }} />
                                        <span>{item.device} ({item.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rankings Grid (Bottom Section) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Top Performing Recyclers */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800/80">Top Recyclers Leaderboard</h4>
                            
                            <div className="space-y-4 pt-2">
                                {topRecyclers.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                                        <div className="flex items-center gap-3">
                                            <span className={`h-6 w-6 flex items-center justify-center font-bold rounded-full ${
                                                idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-350 text-white' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
                                            }`}>
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <p className="font-extrabold text-slate-900 dark:text-white">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-emerald-600 dark:text-emerald-450">{item.completed_count} recycled</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{item.eco_points} points</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Facility Locations */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800/80">Facility Density by City</h4>
                            
                            <div className="space-y-4 pt-2">
                                {facilityStats.length > 0 ? (
                                    facilityStats.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">📍</span>
                                                <span className="font-extrabold text-slate-900 dark:text-white">{item.city}</span>
                                            </div>
                                            <div>
                                                <span className="font-black text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                                                    {item.count} Center(s)
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 text-center py-4">No facility location statistics found.</p>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
