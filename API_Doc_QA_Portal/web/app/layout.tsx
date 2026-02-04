import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "API Doc Q&A" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
