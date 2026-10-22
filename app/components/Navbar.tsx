"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { CloseIcon, MenuIcon } from "./icons/ui-icons";

type NavigationLink = {
  name: string;
  link: string;
};

const navigationLinks: readonly NavigationLink[] = [
  { name: "Home", link: "/" },
  { name: "Schedule", link: "#schedule" },
  { name: "Sponsors", link: "#sponsors" },
  { name: "Team", link: "#team" },
  { name: "About", link: "/about" },
  { name: "Blog", link: "/blog" },
] as const;

// Shown as the call-to-action button rather than in the link row.
const contactLink: NavigationLink = { name: "Contact", link: "/contact" };

const Navbar: React.FC = () => {
  const scrolled = useScrolled();
  // See-through at the top of the page; frosted once content scrolls under.
  const transparent = !scrolled;

  return (
    <header role="banner" className="sticky inset-x-0 top-0 z-30 w-full">
      <div
        className={cn(
          "absolute inset-0 border-b transition-all",
          transparent
            ? "border-transparent"
            : "border-neutral-100 bg-white/75 backdrop-blur-lg",
        )}
      />
      <div className="relative mx-auto w-full max-w-screen-lg px-3 lg:px-4 xl:px-0">
        <div className="flex h-14 items-center justify-between">
          <div className="grow basis-0">
            <NavLogo />
          </div>
          <DesktopNav />
          <div className="hidden grow basis-0 justify-end lg:flex">
            <Button href={contactLink.link} size="sm">
              {contactLink.name}
            </Button>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}

/**
 * Section links (`#schedule`) scroll smoothly on the homepage and navigate
 * to the homepage section from anywhere else.
 */
function NavLink({
  name,
  link,
  className,
  onNavigate,
}: NavigationLink & { className: string; onNavigate?: () => void }) {
  const path = usePathname();
  const isSection = link.startsWith("#");

  return (
    <Link
      href={isSection ? `/${link}` : link}
      prefetch={!isSection}
      data-active={path === link}
      aria-current={path === link ? "page" : undefined}
      onClick={(e) => {
        onNavigate?.();
        if (!isSection || path !== "/") return;
        e.preventDefault();
        document
          .querySelector(link)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={className}
    >
      {isSection ? `~/${name}` : name}
    </Link>
  );
}

function DesktopNav() {
  return (
    <nav aria-label="Desktop navigation" className="hidden lg:block">
      <ul className="flex">
        {navigationLinks.map((link) => (
          <li key={link.name}>
            <NavLink
              {...link}
              className="flex h-8 items-center rounded-lg px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-900/5 hover:text-neutral-900 data-[active=true]:bg-neutral-900/5"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileNav() {
  // Menu links close it themselves via `onNavigate`.
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex items-center gap-2 lg:hidden"
    >
      <Button
        href={contactLink.link}
        size="sm"
        className="h-8 px-3 text-[0.8125rem]"
      >
        {contactLink.name}
      </Button>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
        className="rounded-full p-2 transition-colors duration-200 hover:bg-neutral-200 active:bg-neutral-300"
      >
        <MenuIcon className="size-5 text-neutral-600" />
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 bg-white focus:outline-none lg:hidden"
      >
        <DialogPanel id="mobile-menu" className="size-full overflow-y-auto">
          <div className="flex h-14 items-center justify-between px-3">
            <NavLogo onClick={() => setIsOpen(false)} />
            <CloseButton
              aria-label="Close menu"
              className="rounded-full p-2 transition-colors hover:bg-neutral-200"
            >
              <CloseIcon className="size-5 text-neutral-600" />
            </CloseButton>
          </div>
          <ul className="grid divide-y divide-neutral-200 px-5">
            {[...navigationLinks, contactLink].map((link) => (
              <li key={link.name} className="py-3">
                <NavLink
                  {...link}
                  onNavigate={() => setIsOpen(false)}
                  className="flex w-full font-semibold text-neutral-900"
                />
              </li>
            ))}
          </ul>
        </DialogPanel>
      </Dialog>
    </nav>
  );
}

function NavLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Home"
      className="flex w-fit items-center gap-2 py-2 pr-2 font-display text-lg font-semibold text-neutral-900"
    >
      <Image
        src="/logo-godawari-hacks-nobg.png"
        alt=""
        width={150}
        height={150}
        className="size-7 rounded-full"
      />
      Godawari Hacks
    </Link>
  );
}

export default Navbar;
