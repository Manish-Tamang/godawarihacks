import { cx } from "../lib/utils";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BgGradient } from "./BgGradient";

interface MainSiteLayoutProps {
    children: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function MainSiteLayout({ children, className, fullWidth = false }: MainSiteLayoutProps) {
    return (
        <div className={cx("max-w-full overflow-x-hidden", !fullWidth && "md:max-w-[1150px] lg:mx-auto", className)}>
            <main className="relative flex flex-1 flex-col min-h-0 max-w-full lg:border-x lg:border-border-primary/75 dark:lg:border-neutral-700/75">
                <Navbar />
                <div className="relative px-3 lg:px-0 min-h-0">
                    <BgGradient />
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
