import { useEffect, useMemo, useRef, useState } from "react";

/**
 * CircularColorPicker
 *
 * Props:
 *  - value: { r:number, g:number, b:number } | { red:number, green:number, blue:number }  (0..255)
 *  - onColorChange: (rgb:{r:number,g:number,b:number}) => void     // fires only on release
 *  - disabled: boolean
 *  - label: string
 *  - size: number (px)   // overall diameter
 *
 * Notes:
 *  - Drag around the ring to pick hue.
 *  - Drag inside the disk to pick saturation/value.
 *  - onColorChange fires ONLY on pointer release (like your BrightnessSlider).
 */
export default function CircularColorPicker({
                                                value = { r: 255, g: 255, b: 255 },
                                                onColorChange,
                                                disabled = false,
                                                label = "Color",
                                                size = 260,
                                            }) {
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    // Normalize incoming value to {r,g,b}
    const initialRgb = useMemo(() => {
        if (value && typeof value === "object") {
            const r = value.r ?? value.red ?? 255;
            const g = value.g ?? value.green ?? 255;
            const b = value.b ?? value.blue ?? 255;
            return {
                r: clamp(Number(r), 0, 255),
                g: clamp(Number(g), 0, 255),
                b: clamp(Number(b), 0, 255),
            };
        }
        return { r: 255, g: 255, b: 255 };
    }, [value]);

    // ===== Color math (RGB <-> HSV) =====
    function rgbToHsv({ r, g, b }) {
        const rr = r / 255, gg = g / 255, bb = b / 255;
        const max = Math.max(rr, gg, bb);
        const min = Math.min(rr, gg, bb);
        const d = max - min;

        let h = 0;
        if (d !== 0) {
            switch (max) {
                case rr:
                    h = ((gg - bb) / d) % 6;
                    break;
                case gg:
                    h = (bb - rr) / d + 2;
                    break;
                case bb:
                    h = (rr - gg) / d + 4;
                    break;
            }
            h *= 60;
            if (h < 0) h += 360;
        }

        const s = max === 0 ? 0 : d / max;
        const v = max;

        return { h, s, v };
    }

    function hsvToRgb({ h, s, v }) {
        const c = v * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;

        let rr = 0, gg = 0, bb = 0;
        if (0 <= h && h < 60) [rr, gg, bb] = [c, x, 0];
        else if (60 <= h && h < 120) [rr, gg, bb] = [x, c, 0];
        else if (120 <= h && h < 180) [rr, gg, bb] = [0, c, x];
        else if (180 <= h && h < 240) [rr, gg, bb] = [0, x, c];
        else if (240 <= h && h < 300) [rr, gg, bb] = [x, 0, c];
        else [rr, gg, bb] = [c, 0, x];

        return {
            r: Math.round((rr + m) * 255),
            g: Math.round((gg + m) * 255),
            b: Math.round((bb + m) * 255),
        };
    }

    // Internal HSV state drives UI
    const [hsv, setHsv] = useState(() => rgbToHsv(initialRgb));

    // Sync if parent updates value
    useEffect(() => {
        setHsv(rgbToHsv(initialRgb));
    }, [initialRgb]);

    const isDraggingRef = useRef(false);
    const dragModeRef = useRef(null); // "hue" | "sv" | null

    const rootRef = useRef(null);

    const ringWidth = Math.max(22, Math.round(size * 0.12));
    const radius = size / 2;
    const ringInnerRadius = radius - ringWidth;
    const svRadius = ringInnerRadius - 10; // padding between ring and disk

    const rgb = useMemo(() => hsvToRgb(hsv), [hsv]);
    const previewRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85)`;

    // Helpers for pointer math
    function getLocalXY(e) {
        const el = rootRef.current;
        if (!el) return null;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y, rect };
    }

    function computePolar(x, y) {
        const cx = size / 2;
        const cy = size / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180..180
        angle = (angle + 360) % 360;
        return { dist, angle, dx, dy };
    }

    function pickHueFromPointer(e) {
        const p = getLocalXY(e);
        if (!p) return;
        const { x, y } = p;

        const { angle } = computePolar(x, y); // 0° at 3 o’clock
        const cssHue = (angle + 90) % 360;    // 0° at 12 o’clock to match conic-gradient

        setHsv((prev) => ({ ...prev, h: cssHue }));
    }

    function pickSVFromPointer(e) {
        const p = getLocalXY(e);
        if (!p) return;

        const { x, y } = p;
        const cx = size / 2;
        const cy = size / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // constrain to disk radius
        const maxR = svRadius;
        const scale = dist > maxR ? maxR / dist : 1;

        const ndx = dx * scale;
        const ndy = dy * scale;

        // Map disk coords to S/V:
        // S increases left->right, V increases bottom->top
        const localX = ndx + maxR;   // 0..2R
        const localY = ndy + maxR;   // 0..2R

        const s = clamp(localX / (2 * maxR), 0, 1);
        const v = clamp(1 - (localY / (2 * maxR)), 0, 1);

        setHsv((prev) => ({ ...prev, s, v }));
    }

    function decideDragMode(e) {
        const p = getLocalXY(e);
        if (!p) return null;
        const { x, y } = p;
        const { dist } = computePolar(x, y);

        // In ring?
        if (dist <= radius && dist >= ringInnerRadius) return "hue";

        // In disk?
        if (dist <= svRadius) return "sv";

        // otherwise pick nearest: if outside overall, treat as hue when closer to ring
        if (dist > svRadius && dist < radius) return "hue";

        return null;
    }

    function onPointerDown(e) {
        if (disabled) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);

        const mode = decideDragMode(e);
        dragModeRef.current = mode;
        isDraggingRef.current = !!mode;

        if (mode === "hue") pickHueFromPointer(e);
        if (mode === "sv") pickSVFromPointer(e);
    }

    function onPointerMove(e) {
        if (disabled) return;
        if (!isDraggingRef.current) return;

        if (dragModeRef.current === "hue") pickHueFromPointer(e);
        if (dragModeRef.current === "sv") pickSVFromPointer(e);
    }

    function onPointerUp(e) {
        if (disabled) return;

        isDraggingRef.current = false;
        dragModeRef.current = null;

        // fire ONLY on release
        onColorChange?.(rgb);
    }

    // Knob positions
    const hueKnob = useMemo(() => {
        // Convert CSS hue (0° at 12 o’clock) back to math angle (0° at 3 o’clock)
        const mathDeg = (hsv.h - 90 + 360) % 360;
        const a = (mathDeg * Math.PI) / 180;

        const r = (ringInnerRadius + radius) / 2;
        const cx = size / 2;
        const cy = size / 2;

        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;

        return { x, y };
    }, [hsv.h, ringInnerRadius, radius, size]);

    const svKnob = useMemo(() => {
        const cx = size / 2;
        const cy = size / 2;
        const x = cx + (hsv.s * 2 - 1) * svRadius;          // -R..R
        const y = cy + ((1 - hsv.v) * 2 - 1) * svRadius;    // -R..R
        return { x, y };
    }, [hsv.s, hsv.v, svRadius, size]);

    // For the SV disk, we want a base hue color at full sat/full val
    const hueRgb = useMemo(() => hsvToRgb({ h: hsv.h, s: 1, v: 1 }), [hsv.h]);
    const hueCss = `rgb(${hueRgb.r}, ${hueRgb.g}, ${hueRgb.b})`;

    return (
        <>
            <style>{`
        .ccp-root {
          width: ${size}px;
          height: ${size}px;
          border-radius: ${size}px;
          display: grid;
          place-items: center;
          position: relative;
          user-select: none;
          overflow: hidden; /* <- ADD THIS */
        }

        .ccp-root.is-disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .ccp-bg {
          position: absolute;
          inset: 0;
          border-radius: ${size}px;
          z-index: 50;
        }

        /* Hue ring */
        .ccp-ring {
          position: absolute;
          inset: 0;
          border-radius: ${size}px;
          z-index: 100;
          background: conic-gradient(
            from 0deg,
            rgb(255, 0, 0),
            rgb(255, 255, 0),
            rgb(0, 255, 0),
            rgb(0, 255, 255),
            rgb(0, 0, 255),
            rgb(255, 0, 255),
            rgb(255, 0, 0)
          );
          /* Punch out center to make ring */
          -webkit-mask: radial-gradient(
            circle,
            transparent ${ringInnerRadius}px,
            #000 ${ringInnerRadius}px
          );
          mask: radial-gradient(
            circle,
            transparent ${ringInnerRadius}px,
            #000 ${ringInnerRadius}px
          );
        }

        /* Inner SV disk container */
        .ccp-disk-wrap {
          position: absolute;
          width: ${svRadius * 2}px;
          height: ${svRadius * 2}px;
          border-radius: ${svRadius * 2}px;
          z-index: 150;
          overflow: hidden;
          display: grid;
          place-items: center;
        }

        /* SV disk uses hue base + white/black overlays to emulate saturation/value */
        .ccp-disk {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: ${hueCss};
        }

        .ccp-disk-white {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 0% 50%, rgba(255,255,255,1), rgba(255,255,255,0));
          mix-blend-mode: screen;
        }

        .ccp-disk-black {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at 50% 100%, rgba(0,0,0,1), rgba(0,0,0,0));
          mix-blend-mode: multiply;
        }

        /* Knobs */
        .ccp-knob {
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 26px;
          transform: translate(-50%, -50%);
          z-index: 300;
          background: rgba(255, 255, 255, 0.85);
          display: grid;
          place-items: center;
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
        }

        .ccp-knob::after {
          content: "";
          width: 16px;
          height: 16px;
          border-radius: 16px;
          background: rgba(0,0,0,0.08);
        }

        .ccp-knob-sv {
          background: rgba(255, 255, 255, 0.88);
        }

        .ccp-knob-sv .ccp-knob-preview {
          width: 16px;
          height: 16px;
          border-radius: 16px;
          background: ${previewRgba};
          border: 1px solid rgba(0,0,0,0.15);
        }

        /* Interaction layer */
        .ccp-hit {
          position: absolute;
          inset: 0;
          z-index: 500;
          border-radius: ${size}px;
          cursor: pointer;
          touch-action: none; /* important for pointer dragging on touch devices */
          background: transparent;
        }
      `}</style>

            <div
                ref={rootRef}
                className={`ccp-root ${disabled ? "is-disabled" : ""}`}
            >
                {/* frosted glass base */}
                <div className="ccp-bg frosted-glass" />

                {/* hue ring */}
                <div className="ccp-ring" />

                {/* SV disk */}
                <div className="ccp-disk-wrap">
                    <div className="ccp-disk" />
                    <div className="ccp-disk-white" />
                    <div className="ccp-disk-black" />
                </div>

                {/* hue knob */}
                <div
                    className="ccp-knob"
                    style={{ left: `${hueKnob.x}px`, top: `${hueKnob.y}px` }}
                    title="Hue"
                />

                {/* sv knob */}
                <div
                    className="ccp-knob ccp-knob-sv"
                    style={{ left: `${svKnob.x}px`, top: `${svKnob.y}px` }}
                    title="Saturation / Value"
                >
                    <div className="ccp-knob-preview" />
                </div>

                {/* interaction layer */}
                <div
                    className="ccp-hit"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                />
            </div>
        </>
    );
}