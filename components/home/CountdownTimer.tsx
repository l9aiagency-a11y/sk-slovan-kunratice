"use client";

import { useState, useEffect } from "react";

type CountdownTimerProps = {
  targetDate: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

type Unit = { value: string; label: string };

function DigitGroup({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-heading font-extrabold text-xl text-[var(--club-accent)] tabular-nums">
        {value}
      </span>
      <span className="font-body font-medium text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="text-gray-500 text-xl font-bold pb-3 select-none">:</span>
  );
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft(targetDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const now = Date.now();
  const target = new Date(targetDate).getTime();

  if (timeLeft === null) {
    if (now < target + 2 * 60 * 60 * 1000) {
      // within 2h after start — consider it ongoing
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--win)]/20 border border-[var(--win)]/40">
          <span className="w-2 h-2 rounded-full bg-[var(--win)] animate-pulse" />
          <span className="text-[var(--win)] text-xs font-semibold uppercase tracking-widest">
            Probíhá
          </span>
        </div>
      );
    }
    return (
      <span className="text-gray-500 text-xs uppercase tracking-widest">
        Skončeno
      </span>
    );
  }

  const units: Unit[] = [
    { value: String(timeLeft.days), label: "dní" },
    { value: pad(timeLeft.hours), label: "hodin" },
    { value: pad(timeLeft.minutes), label: "minut" },
    { value: pad(timeLeft.seconds), label: "vteřin" },
  ];

  return (
    <div className="flex gap-3 items-center">
      {units.map((u, i) => (
        <>
          <DigitGroup key={u.label} value={u.value} label={u.label} />
          {i < units.length - 1 && <Separator key={`sep-${i}`} />}
        </>
      ))}
    </div>
  );
}
