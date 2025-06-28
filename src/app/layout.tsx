import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeviceCare Chatbot",
  description: "Your Customer Support Agent!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-full bg-gray-100 text-black">
        <main className="h-full w-full">{children}</main>
      </body>
    </html>
  );
}
