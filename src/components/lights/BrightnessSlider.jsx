import { useEffect, useMemo, useRef, useState } from "react";

/**
 * BrightnessSlider
 *
 * value: number (0..100)
 * onValueChange: (newValue:number) => void
 * disabled: boolean
 * label: string (optional)
 */
export default function BrightnessSlider({
                                             value = 0,
                                             onValueChange,
                                             disabled = false,
                                             label = "Brightness",
                                         }) {
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const [internalValue, setInternalValue] = useState(clamp(value, 0, 100));
    const draggingRef = useRef(false);

    // Keep internal state in sync if parent updates value
    useEffect(() => {
        setInternalValue(clamp(value, 0, 100));
    }, [value]);

    const pct = useMemo(() => clamp(internalValue, 0, 100), [internalValue]);

    function onChange(e) {
        const val = Number(e.target.value);
        setInternalValue(val); // update slider UI only
    }

    function onPointerUp(e) {
        draggingRef.current = false;

        const val = Number(e.target.value);
        onValueChange?.(val); // fire ONLY when released
    }

    function onPointerDown() {
        draggingRef.current = true;
    }

    return (
        <>
            <style>{`
        .ml-slider {
          width: 80%;
          height: 65px;
          border-radius: 35px;
          display: grid;
          position: relative;
          user-select: none;
        }

        .ml-slider.is-disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .ml-slider-bg {
          width: 100%;
          height: 65px;
          border-radius: 65px;
          z-index: 100;
          grid-column: 1;
          grid-row: 1;
        }

        .ml-slider-fill {
          width: 100%;
          height: 65px;
          border-radius: 65px;
          z-index: 150;
          grid-column: 1;
          grid-row: 1;
          transition: clip-path 250ms ease-in-out;
          background: rgba(255, 255, 255, 0.25);
          clip-path: inset(0 ${100 - pct}% 0 0 round 65px);
        }

        .ml-slider-thumb {
          position: relative;
          grid-column: 1;
          grid-row: 1;
          z-index: 200;
          width: 20%;
          height: 75%;
          align-self: center;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.85);
        
          /* ✅ constrain thumb so it stays fully inside the track */
          left: calc((100% - 20%) * (${pct} / 100));
        
          transition: left 250ms ease-in-out, transform 120ms ease-in-out;
          display: grid;
          place-items: center;
        }

        .ml-slider-thumb.is-dragging {
          transform: scale(1.02);
        }

        .ml-slider-value {
          font-size: 12pt;
          font-weight: 500;
          opacity: 0.9;
        }

        /* Make the native range input invisible but keep it interactive */
        .ml-slider-input {
          grid-column: 1;
          grid-row: 1;
          z-index: 300;
          width: 100%;
          height: 65px;
          margin: 0;
          opacity: 0;
          cursor: pointer;
        }

        .ml-slider-input:disabled {
          cursor: default;
        }
      `}</style>

            <div className={`ml-slider ${disabled ? "is-disabled" : ""}`}>
                {/* frosted-glass background to match your toggle */}
                <div className="ml-slider-bg frosted-glass" />

                {/* animated fill */}
                <div className="ml-slider-fill" />

                {/* thumb + value */}
                <div className={`ml-slider-thumb ${draggingRef.current ? "is-dragging" : ""}`}>
                    <div className="ml-slider-value">{pct}</div>
                </div>

                {/* interaction layer */}
                <input
                    className="ml-slider-input"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={pct}
                    disabled={disabled}
                    onChange={onChange}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                />
            </div>
        </>
    );
}