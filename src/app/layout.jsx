import { Geist } from "next/font/google";
import "./globals.css";
import Provider from "@/contexts/Provider";
import GlobalNavbar from "@/components/Navbar";

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
      <body
        className={`${geistSans.className} bg-gradient-to-b from-background-200 to-background-100 min-h-screen dark`}
      >
        <Provider>
          <GlobalNavbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
