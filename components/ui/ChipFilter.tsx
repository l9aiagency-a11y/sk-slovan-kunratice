"use client";

type ChipFilterProps = {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
};

export default function ChipFilter({ options, selected, onChange }: ChipFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold font-heading uppercase tracking-wide transition-colors ${
            selected === option.value
              ? "bg-[var(--club-primary)] text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
