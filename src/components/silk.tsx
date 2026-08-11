import silk from "@/assets/silk-emerald.jpg";

export function SilkBackdrop() {
  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src={silk}
          alt=""
          aria-hidden="true"
          width={1080}
          height={1920}
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-obsidian/55" />
      </div>
      <div className="golden-river pointer-events-none fixed bottom-0 left-0 right-0 z-0 h-40" />
      <div className="pointer-events-none fixed left-4 top-4 z-20 h-12 w-12 border-l border-t border-gold/30" />
      <div className="pointer-events-none fixed right-4 top-4 z-20 h-12 w-12 border-r border-t border-gold/30" />
    </>
  );
}

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px w-8 bg-gold/40" />
      <div className="h-1.5 w-1.5 rotate-45 border border-gold/60" />
      <div className="h-px w-8 bg-gold/40" />
    </div>
  );
}

export function Diamond({ className = "" }: { className?: string }) {
  return <div className={`h-2 w-2 rotate-45 bg-gold ${className}`} />;
}
