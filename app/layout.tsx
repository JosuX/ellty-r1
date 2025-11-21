import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";


export const metadata: Metadata = {
  title: "Round 1 Task for Application for Ellty",
  description: "Created by Jofer Usa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
