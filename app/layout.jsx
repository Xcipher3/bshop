import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "Bijema - Shop Household Goods in Kenya",
  description: "Bijema - Your one-stop shop for all household goods in Kenya. Find kitchen & dining, appliances, bedroom, living room, bath, cleaning & laundry, and storage & organisation products at great prices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <StoreProvider>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}