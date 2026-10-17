import Link from "next/link";
import type { SVGProps } from "react";

const CONTACT_EMAIL = "hack@godawari.edu.np";

type FooterLink = { name: string; href: string };

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
    ],
  },
];

const SOCIAL_LINKS: { name: string; href: string; Icon: typeof FacebookIcon }[] =
  [
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
    <footer className="border-t border-border-primary/75 lg:border-x dark:border-neutral-700/75">
      <div className="px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-xl font-bold text-[#084750] dark:text-teal-300"
            >
              Godawari Hacks
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary dark:text-neutral-400">
              A student-run hackathon at Godawari College — build, ship and
              learn alongside Nepal&apos;s next generation of makers.
            </p>

            {SOCIAL_LINKS.length > 0 && (
              <ul className="mt-6 flex items-center gap-4">
                {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="block text-text-tertiary transition-colors hover:text-[#084750] dark:text-neutral-500 dark:hover:text-teal-300"
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:gap-x-20"
          >
            {LINK_COLUMNS.map(({ heading, links }) => (
              <div key={heading}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary dark:text-neutral-500">
                  {heading}
                </h2>
                <ul className="mt-5 space-y-3">
                  {links.map(({ name, href }) => (
                    <li key={name}>
                      <Link
                        href={href}
                        className="text-sm text-text-secondary transition-colors hover:text-[#084750] dark:text-neutral-400 dark:hover:text-teal-300"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border-primary/60 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700/60">
          <p className="text-sm text-text-tertiary dark:text-neutral-500">
            © {new Date().getFullYear()} Godawari Hacks
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm text-text-tertiary transition-colors hover:text-[#084750] dark:text-neutral-500 dark:hover:text-teal-300"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
