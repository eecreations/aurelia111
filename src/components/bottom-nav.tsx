import { Link } from "@tanstack/react-router";

const items = [
  { to: "/", label: "Today" },
  { to: "/progress", label: "Journey" },
  { to: "/studio", label: "Create" },
  { to: "/library", label: "Library" },
  { to: "/settings", label: "You" },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-5 pt-3 sm:px-6">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-full border border-gold/20 bg-obsidian/90 px-3 backdrop-blur-xl sm:px-5">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5 opacity-50 transition-opacity hover:opacity-100"
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{ className: "!opacity-100" }}
          >
            {({ isActive }) => (
              <>
                <span
                  className={
                    isActive
                      ? "h-1.5 w-1.5 rotate-45 bg-gold"
                      : "h-1.5 w-1.5 rotate-45 border border-ivory/50"
                  }
                />
                <span
                  className={`truncate text-[8px] uppercase tracking-[0.13em] sm:text-[9px] sm:tracking-[0.18em] ${
                    isActive ? "font-semibold text-gold" : "text-ivory"
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
