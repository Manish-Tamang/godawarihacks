import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, MailIcon } from "./icons/ui-icons";
import { FacebookIcon, GithubIcon, InstagramIcon } from "./icons/social-icons";

const CONTACT_EMAIL = "hack@godawari.edu.np";

type FooterLink = { name: string; href: string; external?: boolean };

const LINK_COLUMNS: { heading: string; links: readonly FooterLink[] }[] = [
  {
    heading: "Event",
    links: [
      { name: "About", href: "/about" },
      { name: "Schedule", href: "/#schedule" },
      { name: "Venue", href: "/#venue" },
      { name: "Sponsors", href: "/#sponsors" },
    ],
  },
  {
    heading: "Participate",
    links: [
      { name: "Register", href: "/register" },
      { name: "Rules", href: "/rules" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "More",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Diaries", href: "/archive" },
      { name: "Team", href: "/#team" },
      {
        name: "Godawari Hacks 25/26",
        // Snapshot of the 2025/26 edition's site on the Wayback Machine.
        href: "https://web.archive.org/web/20260309055556/https://hack.godawari.edu.np/#team",
        external: true,
      },
    ],
  },
];

const SOCIAL_LINKS: {
  name: string;
  href: string;
  Icon: typeof FacebookIcon;
}[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/godawarihacks/",
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61586598928514",
    Icon: FacebookIcon,
  },
  {
    name: "GitHub",
    href: "https://github.com/Godawari-Hacks",
    Icon: GithubIcon,
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-grid-border bg-white">
      <div className="mx-auto w-full max-w-screen-lg px-3 py-16 lg:px-4 xl:px-0">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="flex w-fit items-center gap-2 font-display text-xl font-semibold text-brand"
            >
              <Image
                src="/logo-godawari-hacks-nobg.png"
                alt=""
                width={150}
                height={150}
                className="size-8 rounded-full"
              />
              Godawari Hacks
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
              A student-run hackathon at Godawari College — build, ship and
              learn alongside Nepal&apos;s next generation of makers.
            </p>

            {SOCIAL_LINKS.length > 0 && (
              <ul className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="group block rounded-full p-1"
                    >
                      <Icon
                        className="size-4 text-neutral-900 transition-colors duration-75 group-hover:text-neutral-600"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav
            aria-label="Footer"
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2 xl:mt-0"
          >
            {LINK_COLUMNS.map(({ heading, links }) => (
              <div key={heading}>
                <h2 className="text-sm font-medium text-neutral-900">
                  {heading}
                </h2>
                <ul className="mt-2.5 flex flex-col gap-3.5">
                  {links.map(({ name, href, external }) => (
                    <li key={name}>
                      {external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-1 text-sm text-neutral-500 transition-colors duration-75 hover:text-neutral-700"
                        >
                          {name}
                          <ArrowUpRightIcon className="size-3 shrink-0 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-sm text-neutral-500 transition-colors duration-75 hover:text-neutral-700"
                        >
                          {name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex w-fit items-center gap-2 rounded-lg border border-neutral-200 bg-white py-2 pl-2 pr-2.5 text-xs font-medium leading-none text-neutral-600 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
          >
            <MailIcon className="size-3.5 text-neutral-500" />
            {CONTACT_EMAIL}
          </a>
          <p className="text-xs text-neutral-500 sm:text-right">
            © {new Date().getFullYear()} Godawari Hacks
          </p>
        </div>
      </div>
    </footer>
  );
}
