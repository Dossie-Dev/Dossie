import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { ToastContainer } from "react-toastify";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";


export const metadata: Metadata = {
  title: "Dossie",
  description: "Your efficient record management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <Header />
      <ToastContainer
          position="bottom-right"
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
