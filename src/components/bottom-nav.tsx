import { Link } from "@tanstack/react-router";

const items = [
  { to: "/", label: "Today" },
  { to: "/rituals", label: "Breathe" },
  { to: "/aurelia", label: "Aurelia" },
  { to: "/progress", label: "Progress" },
  { to: "/journal", label: "Journal" },
] as const;




export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-4">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-full border border-gold/20 bg-obsidian/85 px-6 backdrop-blur-xl">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1.5 opacity-50 transition-opacity hover:opacity-100"
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
                  className={`text-[9px] uppercase tracking-[0.18em] ${
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
