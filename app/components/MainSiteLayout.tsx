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
        // `w-full` is load-bearing: body is a column flex container, and the
        // `lg:mx-auto` auto margins suppress the default `align-self: stretch`.
        // Without a definite width the shell is sized shrink-to-fit, so pages
        // with narrow content (an empty /blog, /register) rendered narrower
        // than the 1150px every other page happened to reach on its own.
        //
        // `overflow-x-clip` rather than `-hidden`: `overflow-x: hidden` makes
        // `overflow-y` compute to `auto`, which turned this into a scroll
        // container and put a scrollbar inside the column on short pages.
        <div className={cx("w-full max-w-full overflow-x-clip", !fullWidth && "md:max-w-[1150px] lg:mx-auto", className)}>
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
