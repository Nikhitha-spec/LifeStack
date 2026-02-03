import React, { useRef, useEffect, useState } from 'react';
import { Pen, Save, Trash2, X } from 'lucide-react';

interface ScribblePadProps {
    onSave: (base64: string) => void;
    onClose: () => void;
}

const ScribblePad: React.FC<ScribblePadProps> = ({ onSave, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#005F5F');
    const [brushWidth, setBrushWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set initial canvas size
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;

                // Fill white background (important for saving as image)
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.beginPath();
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.lineWidth = brushWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;

        let x, y;
        if ('touches' in e) {
            const rect = canvas.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            const rect = canvas.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const base64 = canvas.toDataURL('image/png');
            onSave(base64);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-5xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-slate-50 border-b p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <Pen className="text-peacock-500" /> CLINICAL SCRIBBLE PAD
                        </h3>
                        <p className="text-slate-500 font-medium italic">Handwrite prescriptions or notes below</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 relative cursor-crosshair">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                        className="w-full h-full"
                    />
                </div>

                {/* Toolbar */}
                <div className="p-6 bg-slate-50 border-t flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border shadow-sm">
                            <button
                                onClick={() => setBrushColor('#005F5F')}
                                className={`w-10 h-10 rounded-xl bg-peacock-500 ${brushColor === '#005F5F' ? 'ring-4 ring-peacock-100' : ''}`}
                            />
                            <button
                                onClick={() => setBrushColor('#000000')}
                                className={`w-10 h-10 rounded-xl bg-black ${brushColor === '#000000' ? 'ring-4 ring-slate-200' : ''}`}
                            />
                            <button
                                onClick={() => setBrushColor('#CC0000')}
                                className={`w-10 h-10 rounded-xl bg-red-600 ${brushColor === '#CC0000' ? 'ring-4 ring-red-100' : ''}`}
                            />
                            <div className="w-[2px] h-8 bg-slate-200 mx-2" />
                            <button
                                onClick={() => setBrushWidth(brushWidth === 10 ? 3 : 10)}
                                className={`w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center ${brushWidth === 10 ? 'bg-slate-200' : ''}`}
                            >
                                <div className={`rounded-full bg-slate-800 ${brushWidth === 10 ? 'w-4 h-4' : 'w-2 h-2'}`} />
                            </button>
                        </div>

                        <button
                            onClick={clearCanvas}
                            className="btn-secondary py-3"
                        >
                            <Trash2 size={20} /> Clear
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        className="btn-primary"
                    >
                        <Save size={20} /> Add to Identity Node
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScribblePad;
