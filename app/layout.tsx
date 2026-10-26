import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Laya — A little closer to nowhere",
  description:
    "Slow mornings, sun-kissed afternoons, and a space to simply be. Discover a coastal resort concept, explore our stays, and plan your escape.",
  icons: { icon: "/favicon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
