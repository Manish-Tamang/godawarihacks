import { cx } from "../lib/utils";
import Navbar from "./Navbar";
import { BgGradient } from "./BgGradient";

interface MainSiteLayoutProps {
    children: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function MainSiteLayout({ children, className, fullWidth = false }: MainSiteLayoutProps) {
    return (
        <div className={cx("max-w-full overflow-x-hidden md:overflow-y-auto", !fullWidth && "md:max-w-[880px] lg:mx-auto", className)}>
            <main className={cx("relative flex flex-1 flex-col min-h-0 max-w-full bg-bg-primary dark:bg-neutral-900")}>
                <Navbar />
                <div className="grid flex-1 grid-cols-1 lg:grid-cols-[32px_1fr_32px] min-h-0 bg-bg-primary dark:bg-neutral-900">
                    <div className="hidden w-full border-r border-border-primary dark:border-neutral-700 opacity-75 lg:block bg-bg-primary dark:bg-neutral-900"></div>
                    <div className="relative col-span-1 px-3 lg:px-0 min-h-0 bg-bg-primary dark:bg-neutral-900">
                        <BgGradient />
                        {children}
                    </div>
                    <div className="hidden w-full border-l border-border-primary dark:border-neutral-700 opacity-75 lg:block bg-bg-primary dark:bg-neutral-900"></div>
                </div>
            </main>
        </div>
    );
}
