import { type ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casino Interview Template",
  description: "Casino game lobby interview task",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
