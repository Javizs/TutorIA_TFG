import Providers from "./Providers";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata = {
  title: "English Tutor AI",
  description: "English Tutor AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <div className="container mx-auto">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
