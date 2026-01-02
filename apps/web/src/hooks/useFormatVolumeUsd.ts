
export function formatVolumeUsd (value: number)  {
 const format = (num: number, suffix: string) =>
    `$${num.toFixed(1).replace(/\.0$/, "")}${suffix}`;

  if (value >= 1e12) return format(value / 1e12, "T");
  if (value >= 1e9)  return format(value / 1e9, "B");
  if (value >= 1e6)  return format(value / 1e6, "M");
  if (value >= 1e3)  return format(value / 1e3, "K");
  return `$${Math.round(value)}`;
}