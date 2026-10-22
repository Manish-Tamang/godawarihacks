import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

/** Shell for every page: header, a stack of `GridSection` bands, footer. */
export function GridPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
