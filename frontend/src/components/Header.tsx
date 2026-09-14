import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#problem", label: "Problem" },
  { href: "/#solution", label: "Solution" },
  { href: "/architecture", label: "Architecture" },
  { href: "/#features", label: "Features" },
  { href: "/#impact", label: "Impact" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="text-[15px] font-semibold tracking-tight text-ink">
          SkillSphere AI
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((l) =>
            l.href.startsWith("/#") ? (
              <a
                key={l.href}
                href={l.href}
                className="text-[12px] uppercase tracking-label text-ink-2 hover:text-ink"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                className="text-[12px] uppercase tracking-label text-ink-2 hover:text-ink"
              >
                {l.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-3">
          <NavLink
            to="/dashboard"
            className="hidden border border-ink px-4 py-2 text-[12px] uppercase tracking-label text-ink hover:border-sage hover:text-sage md:inline-block"
          >
            View Dashboard
          </NavLink>
          <button
            type="button"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-rule px-5 py-4 md:hidden">
          {links.map((l) =>
            l.href.startsWith("/#") ? (
              <a
                key={l.href}
                href={l.href}
                className="block py-2 text-[12px] uppercase tracking-label text-ink-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                className="block py-2 text-[12px] uppercase tracking-label text-ink-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
