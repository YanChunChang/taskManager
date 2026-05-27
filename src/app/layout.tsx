import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Chilla Tasks",
  description: "A cozy purple productivity app with a virtual chinchilla pet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
