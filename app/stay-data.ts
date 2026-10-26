export const rooms = [
  {
    id: "garden",
    name: "Garden Casita",
    tag: "YOUR OWN LITTLE HIDEAWAY",
    category: "For two",
    guests: 2,
    beds: "1 queen bed",
    size: "32 m²",
    price: 6800,
    image: "/images/garden.jpg",
    images: ["/images/garden.jpg", "/images/twin.jpg", "/images/bed.jpg"],
    description:
      "Wake to dappled light and slow mornings. A warm, intimate space with natural textures, thoughtful comforts, and a little garden all your own.",
    features: [
      "Private garden terrace",
      "Air conditioning",
      "En-suite bathroom",
      "Breakfast for two",
      "Wi-Fi",
      "Pool access",
    ],
  },
  {
    id: "suite",
    name: "Palm Suite",
    tag: "A LITTLE MORE ROOM TO UNWIND",
    category: "For family",
    guests: 4,
    beds: "2 double beds",
    size: "48 m²",
    price: 9800,
    image: "/images/suite.jpg",
    images: ["/images/suite.jpg", "/images/twin.jpg", "/images/bed.jpg"],
    description:
      "Made for long conversations and unhurried days together. An airy suite with generous space, tropical views, and a private terrace for your morning coffee.",
    features: [
      "Private terrace",
      "Air conditioning",
      "En-suite bathroom",
      "Breakfast for four",
      "Wi-Fi",
      "Pool access",
    ],
  },
  {
    id: "villa",
    name: "The Laya Villa",
    tag: "THE WHOLE PLACE, JUST FOR YOU",
    category: "For your people",
    guests: 8,
    beds: "3 bedrooms",
    size: "140 m²",
    price: 18500,
    image: "/images/villa.jpg",
    images: ["/images/villa.jpg", "/images/bed.jpg", "/images/hero.jpg"],
    description:
      "Bring your favourite people and make yourself at home. Your own spacious villa, with room to gather, room to retreat, and time to simply be together.",
    features: [
      "Private plunge pool",
      "Three bedrooms",
      "Equipped kitchenette",
      "Breakfast for eight",
      "Outdoor dining",
      "Wi-Fi",
    ],
  },
];
export type Room = (typeof rooms)[number];
export const scenes = [
  {
    name: "The grounds",
    caption: "Find your own pace among palms, water, and open skies.",
    image: "/images/aerial.jpg",
  },
  {
    name: "Poolside",
    caption: "A slow afternoon, a good book, and nowhere else to be.",
    image: "/images/hero.jpg",
  },
  {
    name: "Garden Casita",
    caption: "Soft light, natural textures, and your own corner of calm.",
    image: "/images/garden.jpg",
  },
  {
    name: "Palm Suite",
    caption: "Let the outside in. A place to put your feet up and stay awhile.",
    image: "/images/suite.jpg",
  },
  {
    name: "The Laya Villa",
    caption: "A private escape, with plenty of room for your favourite people.",
    image: "/images/villa.jpg",
  },
];
export const money = (n: number) => "₱" + n.toLocaleString("en-PH");
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function nightsBetween(start: string, end: string) {
  return Math.round(
    (Date.parse(end + "T00:00:00Z") - Date.parse(start + "T00:00:00Z")) /
      86400000,
  );
}
export function validISO(s: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(s) &&
    !Number.isNaN(Date.parse(s + "T00:00:00Z")) &&
    new Date(s + "T00:00:00Z").toISOString().slice(0, 10) === s
  );
}
export function dateError(start: string, end: string, now = todayISO()) {
  if (!validISO(start) || !validISO(end))
    return "Choose your arrival and departure dates.";
  if (start < now) return "Your arrival date must be today or later.";
  if (end <= start) return "Departure must be after arrival.";
  if (nightsBetween(start, end) > 30)
    return "For stays over 30 nights, please choose a shorter date range for your inquiry.";
  if (end > addDays(now, 365))
    return "Please choose dates within the next 12 months.";
  return "";
}
export function demoBlocked(room: string, date: string) {
  const index = rooms.findIndex((r) => r.id === room);
  return (
    (Math.floor(Date.parse(date + "T00:00:00Z") / 86400000) + index * 5) % 17 <
    2
  );
}
export function demoAvailable(room: string, start: string, end: string) {
  const n = nightsBetween(start, end);
  return (
    n > 0 &&
    Array.from({ length: Math.min(n, 30) }, (_, i) => addDays(start, i)).every(
      (d) => !demoBlocked(room, d),
    )
  );
}
