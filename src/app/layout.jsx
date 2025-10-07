import { Geist } from "next/font/google";
import "./globals.css";
import Provider from "@/contexts/Provider";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "K-1000 Manager",
  description: "All in one management system for K-1000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
