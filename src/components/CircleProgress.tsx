
interface CircleProgressProps {
  progress: number;
  size: number;
  strokeWidth: number;
}

export function CircleProgress({ progress, size, strokeWidth }: CircleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        className="stroke-muted"
        stroke-width={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="stroke-theme-purple transition-all duration-1000 ease-in-out"
        stroke-width={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
        }}
      />
    </svg>
  );
}
