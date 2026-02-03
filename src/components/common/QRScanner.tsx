import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, RefreshCw, X, Shield, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let animationFrameId: number;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    requestAnimationFrame(scan);
                }
            } catch (err) {
                console.error("Camera Access Error:", err);
                setError("Ocular access refused. Please verified permissions in your terminal.");
            }
        };

        const scan = () => {
            if (videoRef.current && canvasRef.current && isScanning) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d', { willReadFrequently: true });

                if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        onScan(code.data);
                        setIsScanning(false);
                        if (navigator.vibrate) navigator.vibrate(200);
                    }
                }
            }
            if (isScanning) {
                animationFrameId = requestAnimationFrame(scan);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [isScanning, onScan]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] bg-slate-900 shadow-2xl border border-white/10"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-peacock-500/20 to-transparent pointer-events-none" />

                <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-peacock-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Camera size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-xl italic tracking-tighter uppercase leading-none">Scanning Node</h3>
                            <p className="text-peacock-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Identity System v4</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <X size={24} />
                    </button>
                </div>

                {error ? (
                    <div className="h-[500px] flex flex-col items-center justify-center text-white p-12 text-center relative z-10">
                        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8 border border-red-500/30">
                            <X size={40} />
                        </div>
                        <p className="text-red-400 font-black text-lg mb-8 uppercase tracking-tighter italic leading-tight">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white text-slate-900 font-black px-8 py-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-all"
                        >
                            <RefreshCw size={20} /> RETRY VALIDATION
                        </button>
                    </div>
                ) : (
                    <div className="relative h-[600px]">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover grayscale opacity-60"
                            playsInline
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Scanner UI Overlays */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                            {/* Scanning Box */}
                            <div className="relative w-72 h-72 md:w-96 md:h-96">
                                <div className="absolute inset-0 border-[1px] border-white/10 rounded-[3rem]" />

                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-peacock-500 rounded-tl-3xl" />
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-peacock-500 rounded-tr-3xl" />
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-peacock-500 rounded-bl-3xl" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-peacock-500 rounded-br-3xl" />

                                {/* Moving Line */}
                                <motion.div
                                    animate={{ top: ['10%', '90%', '10%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute left-6 right-6 h-[2px] bg-peacock-400 shadow-[0_0_20px_rgba(77,143,143,0.8)] z-10"
                                />

                                {/* Pulse */}
                                <motion.div
                                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 bg-peacock-500/10 rounded-[3rem]"
                                />
                            </div>

                            {/* Status Indicators */}
                            <div className="mt-12 flex gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <Zap size={20} className="text-amber-500" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Power</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Activity size={20} className="text-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Shield size={20} className="text-peacock-500" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secure</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-0 right-0 text-center px-12">
                            <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-2xl py-4 px-8 inline-block shadow-2xl">
                                <p className="text-white/80 font-black text-xs uppercase tracking-[0.3em] leading-relaxed italic">
                                    Align Patient's QR Node <br className="md:hidden" /> within the optical frame
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default QRScanner;
