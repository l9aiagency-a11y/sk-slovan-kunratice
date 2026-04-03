type FormIndicatorProps = {
  form: ("W" | "D" | "L")[];
};

const colorMap: Record<"W" | "D" | "L", string> = {
  W: "bg-[var(--win)]",
  D: "bg-[var(--draw)]",
  L: "bg-[var(--loss)]",
};

export default function FormIndicator({ form }: FormIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {form.map((result, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${colorMap[result]}`}
          title={result}
        />
      ))}
    </div>
  );
}
