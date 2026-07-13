"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { highestBidLabel } from "@/lib/collection-utils";
import type { SpiritBull } from "@/data/collection";

type Props = {
  items: SpiritBull[];
  activeIndex: number;
  onChange: (index: number) => void;
  onSelect: (nft: SpiritBull) => void;
};

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function Carousel3D({ items, activeIndex, onChange, onSelect }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const didDrag = useRef(false);
  const pointerActive = useRef(false);
  const isDraggingRef = useRef(false);
  const activeRef = useRef(activeIndex);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  const next = useCallback(
    () => onChange(wrap(activeRef.current + 1, items.length)),
    [items.length, onChange],
  );
  const prev = useCallback(
    () => onChange(wrap(activeRef.current - 1, items.length)),
    [items.length, onChange],
  );

  useEffect(() => {
    if (isHovered || isDragging || items.length === 0) return;
    const id = window.setInterval(next, 4000);
    return () => window.clearInterval(id);
  }, [isHovered, isDragging, next, items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    pointerActive.current = true;
    didDrag.current = false;
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointerActive.current) return;

    dragDelta.current = e.clientX - dragStartX.current;
    if (!isDraggingRef.current && Math.abs(dragDelta.current) > 8) {
      isDraggingRef.current = true;
      setIsDragging(true);
      didDrag.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  }

  function endDrag(e: React.PointerEvent) {
    const wasDragging = isDraggingRef.current;
    pointerActive.current = false;

    if (wasDragging) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }

      const threshold = 60;
      if (dragDelta.current <= -threshold) next();
      else if (dragDelta.current >= threshold) prev();
    }

    dragDelta.current = 0;

    if (wasDragging || didDrag.current) {
      window.setTimeout(() => {
        didDrag.current = false;
      }, 50);
    }
  }

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative mx-auto h-[420px] w-full max-w-5xl touch-pan-y sm:h-[480px] md:h-[520px] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ perspective: "1400px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((nft, i) => {
            let offset = i - activeIndex;
            const half = Math.floor(items.length / 2);
            if (offset > half) offset -= items.length;
            if (offset < -half) offset += items.length;

            const abs = Math.abs(offset);
            const isActive = offset === 0;
            const translateX = offset * 210;
            const rotateY = offset * -28;
            const translateZ = isActive ? 120 : -abs * 90;
            const scale = isActive ? 1 : Math.max(0.65, 1 - abs * 0.14);
            const opacity = abs > 2 ? 0 : isActive ? 1 : Math.max(0.25, 1 - abs * 0.28);

            const imageSrc = nft.image;

            return (
              <button
                key={nft.id}
                type="button"
                aria-label={`View ${nft.name}`}
                onClick={() => {
                  if (didDrag.current) return;
                  if (isActive) onSelect(nft);
                  else onChange(i);
                }}
                className="absolute focus:outline-none"
                style={{
                  width: 260,
                  height: 340,
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 50 - abs,
                  transition: isDragging
                    ? "none"
                    : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease",
                  transformStyle: "preserve-3d",
                  pointerEvents: !isActive ? "none" : abs > 2 ? "none" : "auto",
                }}
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-2xl bg-black"
                  style={{
                    outline: isActive ? "1px solid rgba(255,255,255,0.12)" : undefined,
                  }}
                >
                  <Image
                    src={imageSrc}
                    alt={nft.name}
                    fill
                    className="object-cover"
                    sizes="260px"
                    priority={isActive}
                    draggable={false}
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-14">
                    <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/45">
                      Token #{String(nft.id).padStart(4, "0")}
                    </p>
                    <p className="truncate text-lg font-semibold text-white">{nft.name}</p>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-white/80">{highestBidLabel(nft)}</span>
                      {isActive && (
                        <span className="rounded-full bg-black/70 px-2 py-0.5 text-[10px] tracking-wider text-white/70 uppercase">
                          {nft.reserved ? "Ansem" : nft.airdropped ? "Holders" : "Bid"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase">
        Drag to slide · Click center to bid
      </p>

      <div className="mt-3 text-center">
        <Link
          href="/collection"
          className="text-sm text-white/55 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white/50"
        >
          View all collection
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <NavButton label="Previous" onClick={prev}>
          ‹
        </NavButton>
        <NavButton label="Next" onClick={next}>
          ›
        </NavButton>
      </div>
    </div>
  );
}

function NavButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-xl text-white/70 transition hover:bg-white/[0.12] hover:text-white"
    >
      {children}
    </button>
  );
}
