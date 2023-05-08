function joinArray(arr: string[]): string {
  if (!arr.length) return "";
  else if (arr.length === 1) return arr[0];
  else if (arr.length === 2) return `${arr[0]} y ${arr[1]}`;
  else {
    const last = arr.slice(-1);
    const rest = arr.slice(0, -1);

    return `${rest.join(", ")} y ${last}`;
  }
}

export function getTimeString(hotdogCount: number): string {
  if (!hotdogCount || hotdogCount === 0) return "";

  const intervals = [
    { label: "año", seconds: 31_536_000 },
    { label: "mes", seconds: 2_592_000 },
    { label: "semana", seconds: 604_800 },
    { label: "día", seconds: 86_400 },
    { label: "hora", seconds: 3600 },
    { label: "minuto", seconds: 60 },
  ];

  let remainingTime = hotdogCount * 1800;
  let timeString = "";
  let intervalsAdded: string[] = [];

  for (const interval of intervals) {
    const intervalCount = Math.floor(remainingTime / interval.seconds);
    remainingTime -= intervalCount * interval.seconds;

    const newSanitizedLabel = `${intervalCount} ${interval.label}${
      interval.label === "mes" ? (intervalCount === 1 ? "" : "es") : intervalCount === 1 ? "" : "s"
    }`;

    if (intervalCount > 0) {
      intervalsAdded = [...intervalsAdded, newSanitizedLabel];

      timeString = joinArray(intervalsAdded);
    }
  }

  return timeString;
}
