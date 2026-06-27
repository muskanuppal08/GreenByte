import React from 'react';

export default function CertificateModal({ isOpen, onClose, userName, deviceType, brand, model, date, carbonSaved, pointsEarned }) {
    if (!isOpen) return null;

    const qrData = `GreenByte Verified Recycler: ${userName}\nDevice: ${deviceType} (${brand} ${model})\nDate: ${date}\nCO2 Offset: ${carbonSaved} kg\nPoints: ${pointsEarned}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm print:p-0 print:bg-white print:static print:inset-auto">
            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-none print:w-full print:max-w-none print:static">
                
                {/* Print Styles Injection */}
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print-area, .print-area * {
                            visibility: visible;
                        }
                        .print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border: 20px double #10b981 !important;
                            padding: 40px !important;
                            box-sizing: border-box;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}} />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 no-print"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Certificate Print Area */}
                <div className="p-10 print-area text-center bg-gradient-to-br from-emerald-50/20 via-white to-cyan-50/20 border-8 border-double border-emerald-500/20 m-4 rounded-2xl relative">
                    {/* Watermark leaf */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none text-[150px]">
                        🌿
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* Certificate Header */}
                        <div className="space-y-2">
                            <span className="text-3xl">🌱</span>
                            <h3 className="text-2xl font-black text-slate-850 tracking-widest uppercase">Certificate of Responsible Recycling</h3>
                            <div className="h-1 w-28 bg-emerald-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Certificate Body */}
                        <div className="space-y-4">
                            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">This is proudly awarded to</p>
                            <h4 className="text-2xl font-extrabold text-emerald-600">{userName}</h4>
                            
                            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                                for successfully diverting electronic waste from landfills by recycling a 
                                <strong className="text-slate-800"> {deviceType} ({brand} {model})</strong> on <span className="font-semibold text-slate-800">{date}</span>.
                            </p>
                        </div>

                        {/* Impact Metrics details */}
                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-emerald-50/30 p-4 rounded-xl border border-emerald-500/10">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">CO₂ Offset</p>
                                <p className="text-lg font-black text-slate-800">-{carbonSaved} kg</p>
                            </div>
                            <div className="border-l border-emerald-500/15">
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Eco-Points Earned</p>
                                <p className="text-lg font-black text-slate-800">+{pointsEarned} pts</p>
                            </div>
                        </div>

                        {/* Certificate Footer */}
                        <div className="flex justify-between items-center max-w-md mx-auto pt-6 border-t border-slate-100">
                            {/* QR Code */}
                            <div className="text-left flex items-center gap-3">
                                <img
                                    src={qrUrl}
                                    alt="Verification QR Code"
                                    className="h-16 w-16 border border-slate-200 rounded-lg p-0.5"
                                />
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">VERIFY CODE</p>
                                    <p className="text-[8px] text-slate-400 max-w-[120px] leading-tight mt-0.5">Scan to verify this certificate on the GreenByte platform.</p>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="text-right">
                                <p className="font-semibold text-slate-700 italic text-sm">GreenByte Registry</p>
                                <div className="h-0.5 w-24 bg-slate-250 ml-auto my-1"></div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">OFFICIAL SEAL</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Actions */}
                <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 no-print">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/15 flex items-center space-x-1.5"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print Certificate</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
