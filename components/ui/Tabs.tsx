"use client";

type TabsProps = {
  tabs: { label: string; value: string }[];
  active: string;
  onChange: (value: string) => void;
};

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold font-heading uppercase tracking-wide transition-colors ${
            active === tab.value
              ? "bg-[var(--club-primary)] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
