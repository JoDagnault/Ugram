import { useEffect, useRef, useState } from 'react';

export interface ImageEditorResult {
    file: File;
}

interface Props {
    sourceFile: File;
    onConfirm: (result: ImageEditorResult) => void;
    onCancel: () => void;
}

interface SizePreset {
    label: string;
    description: string;
    maxDimension: number | null;
}

const SIZE_PRESETS: SizePreset[] = [
    {
        label: 'Original',
        description: 'Keep source dimensions',
        maxDimension: null,
    },
    { label: '1080p', description: 'Max 1920 px', maxDimension: 1920 },
    { label: 'Medium', description: 'Max 1280 px', maxDimension: 1280 },
    { label: 'Small', description: 'Max 800 px', maxDimension: 800 },
    { label: 'Thumbnail', description: 'Max 400 px', maxDimension: 400 },
];

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function fitDimensions(
    srcW: number,
    srcH: number,
    maxDimension: number | null,
): { w: number; h: number } {
    if (maxDimension === null) return { w: srcW, h: srcH };
    const scale = Math.min(maxDimension / Math.max(srcW, srcH), 1);
    return { w: Math.round(srcW * scale), h: Math.round(srcH * scale) };
}

function fitInside(w: number, h: number, maxW: number, maxH: number) {
    const scale = Math.min(maxW / w, maxH / h, 1);
    return { w: Math.round(w * scale), h: Math.round(h * scale) };
}

function clampDimension(value: number): number {
    return Math.max(1, Math.min(10000, Math.round(value)));
}

export default function ImageEditor({
    sourceFile,
    onConfirm,
    onCancel,
}: Props) {
    const [srcUrl, setSrcUrl] = useState('');
    const [naturalW, setNaturalW] = useState(0);
    const [naturalH, setNaturalH] = useState(0);

    const [selectedPreset, setSelectedPreset] = useState<number | null>(0);

    const [inputW, setInputW] = useState('');
    const [inputH, setInputH] = useState('');
    const [lockAspect, setLockAspect] = useState(true);

    const [outputW, setOutputW] = useState(0);
    const [outputH, setOutputH] = useState(0);

    const [previewUrl, setPreviewUrl] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const url = URL.createObjectURL(sourceFile);
        setSrcUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [sourceFile]);

    useEffect(() => {
        if (!srcUrl) return;
        loadImage(srcUrl).then((img) => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            setNaturalW(w);
            setNaturalH(h);
            setInputW(String(w));
            setInputH(String(h));
            setOutputW(w);
            setOutputH(h);
        });
    }, [srcUrl]);

    useEffect(() => {
        if (selectedPreset === null || !naturalW || !naturalH) return;
        const { w, h } = fitDimensions(
            naturalW,
            naturalH,
            SIZE_PRESETS[selectedPreset].maxDimension,
        );
        setOutputW(w);
        setOutputH(h);
        setInputW(String(w));
        setInputH(String(h));
    }, [selectedPreset, naturalW, naturalH]);

    useEffect(() => {
        if (!srcUrl || !outputW || !outputH) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        loadImage(srcUrl).then((img) => {
            canvas.width = outputW;
            canvas.height = outputH;
            const ctx = canvas.getContext('2d')!;
            ctx.clearRect(0, 0, outputW, outputH);
            ctx.drawImage(img, 0, 0, outputW, outputH);
            setPreviewUrl(canvas.toDataURL('image/jpeg', 0.82));
        });
    }, [srcUrl, outputW, outputH]);

    const handleWidthChange = (raw: string) => {
        setSelectedPreset(null);
        setInputW(raw);
        const parsed = parseInt(raw, 10);
        if (!parsed || parsed <= 0) return;
        const w = clampDimension(parsed);
        if (lockAspect && naturalW && naturalH) {
            const h = clampDimension(Math.round((w / naturalW) * naturalH));
            setOutputW(w);
            setOutputH(h);
            setInputH(String(h));
        } else {
            setOutputW(w);
            setOutputH((prev) => prev);
        }
    };

    const handleHeightChange = (raw: string) => {
        setSelectedPreset(null);
        setInputH(raw);
        const parsed = parseInt(raw, 10);
        if (!parsed || parsed <= 0) return;
        const h = clampDimension(parsed);
        if (lockAspect && naturalW && naturalH) {
            const w = clampDimension(Math.round((h / naturalH) * naturalW));
            setOutputW(w);
            setOutputH(h);
            setInputW(String(w));
        } else {
            setOutputH(h);
            setOutputW((prev) => prev);
        }
    };

    const handleConfirm = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const baseName = sourceFile.name.replace(/\.[^.]+$/, '');
                onConfirm({
                    file: new File([blob], `${baseName}.jpg`, {
                        type: 'image/jpeg',
                    }),
                });
            },
            'image/jpeg',
            0.82,
        );
    };

    const previewFit =
        outputW && outputH
            ? fitInside(outputW, outputH, 420, 260)
            : { w: 420, h: 260 };

    return (
        <div className="flex flex-col gap-4">
            <div
                className="flex items-center justify-center bg-gray-100 dark:bg-black/30 rounded-lg overflow-hidden"
                style={{ minHeight: 180 }}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: previewFit.w, height: previewFit.h }}
                        className="object-contain"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Loading…</span>
                )}
            </div>

            {outputW > 0 && outputH > 0 && (
                <p className="text-xs text-gray-500 text-center -mt-2">
                    Output: {outputW} × {outputH} px
                </p>
            )}

            <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                    Size presets
                </label>
                <div className="flex flex-wrap gap-2">
                    {SIZE_PRESETS.map((preset, i) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => setSelectedPreset(i)}
                            title={preset.description}
                            className={`
                                px-3 py-1.5 rounded-full border text-xs transition-colors
                                ${
                                    selectedPreset === i
                                        ? 'border-accent bg-accent/10 text-accent font-semibold'
                                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
                                }
                            `}
                        >
                            {preset.label}
                            <span className="ml-1 text-gray-400 font-normal">
                                — {preset.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                    Custom dimensions (px)
                </label>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-gray-500">Width</span>
                        <input
                            type="number"
                            min={1}
                            max={10000}
                            value={inputW}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            className="w-full border rounded p-2 bg-white dark:bg-dark text-sm"
                            placeholder="px"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setLockAspect((v) => !v)}
                        title={
                            lockAspect
                                ? 'Unlock aspect ratio'
                                : 'Lock aspect ratio'
                        }
                        className={`
                            mt-5 p-2 rounded-full border transition-colors shrink-0
                            ${
                                lockAspect
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                            }
                        `}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {lockAspect ? (
                                <>
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                        ry="2"
                                    />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </>
                            ) : (
                                <>
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                        ry="2"
                                    />
                                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                                </>
                            )}
                        </svg>
                    </button>

                    <div className="flex flex-col gap-1 flex-1">
                        <span className="text-xs text-gray-500">Height</span>
                        <input
                            type="number"
                            min={1}
                            max={10000}
                            value={inputH}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            className="w-full border rounded p-2 bg-white dark:bg-dark text-sm"
                            placeholder="px"
                        />
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2 justify-end pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-2 rounded-full border hover:bg-dark-gray hover:opacity-90"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!previewUrl}
                    className="px-3 py-2 rounded-full border dark:border-gray-500 bg-accent hover:bg-accent/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors disabled:opacity-50"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
