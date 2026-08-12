import silk from "@/assets/silk-emerald.jpg";

interface CardInput {
  /** Journey day, when the affirmation comes from the 365-day library. */
  day?: number;
  category: string;
  affirmation: string;
  /** Overrides the small caption above the affirmation. */
  label?: string;
  /** Filename slug, used when there is no day number. */
  slug?: string;
}


interface CardOptions {
  width: number;
  height: number;
  /** Vertical center of the affirmation block, as a fraction of the height. */
  focus: number;
  fontSize: number;
  lineHeight: number;
}

const STORY: CardOptions = {
  width: 1080,
  height: 1920,
  focus: 0.5,
  fontSize: 76,
  lineHeight: 96,
};

/** Lock screens keep the top third for the clock, so the text sits lower. */
const SQUARE: CardOptions = {
  width: 1080,
  height: 1080,
  focus: 0.5,
  fontSize: 62,
  lineHeight: 80,
};

const WALLPAPER: CardOptions = {
  width: 1290,
  height: 2796,
  focus: 0.63,
  fontSize: 84,
  lineHeight: 110,
};

async function renderCard(input: CardInput, opts: CardOptions): Promise<Blob> {
  const { width: W, height: H } = opts;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = silk;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Background failed to load"));
  });

  const scale = Math.max(W / img.width, H / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

  const veil = ctx.createLinearGradient(0, 0, 0, H);
  veil.addColorStop(0, "rgba(6, 18, 16, 0.80)");
  veil.addColorStop(0.5, "rgba(11, 40, 34, 0.62)");
  veil.addColorStop(1, "rgba(4, 12, 11, 0.86)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, W, H);

  const gold = "#d9b26a";
  const cream = "#f8f4e8";
  const center = H * opts.focus;
  ctx.textAlign = "center";

  ctx.fillStyle = gold;
  ctx.font = "500 26px Inter, sans-serif";
  ctx.letterSpacing = "8px";
  const caption =
    input.label ??
    (input.day
      ? `DAY ${input.day} · ${input.category.toUpperCase()}`
      : input.category.toUpperCase());
  ctx.fillText(caption, W / 2, center - H * 0.17);
  ctx.letterSpacing = "0px";


  const ornament = (y: number) => {
    ctx.strokeStyle = "rgba(217, 178, 106, 0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 260, y);
    ctx.lineTo(W / 2 - 26, y);
    ctx.moveTo(W / 2 + 26, y);
    ctx.lineTo(W / 2 + 260, y);
    ctx.stroke();
    ctx.save();
    ctx.translate(W / 2, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = gold;
    ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();
  };

  ctx.font = `italic 700 ${opts.fontSize}px 'Playfair Display', Georgia, serif`;
  ctx.fillStyle = cream;
  const words = input.affirmation.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > W - 220 && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  const lineHeight = opts.lineHeight;
  const blockHeight = lines.length * lineHeight;
  const startY = center - blockHeight / 2 + lineHeight / 2;

  ornament(startY - lineHeight / 2 - 90);
  lines.forEach((text, i) => {
    ctx.fillText(text, W / 2, startY + i * lineHeight);
  });
  ornament(startY + blockHeight - lineHeight / 2 + 90);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Could not render the card");
  return blob;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function nameFor(input: CardInput, kind: string) {
  const suffix = input.day ? `day-${input.day}` : (input.slug ?? "affirmation");
  return `aurelia-${kind}-${suffix}.png`;
}

/** Renders the affirmation onto a 1080x1920 obsidian-and-gold card and downloads it. */
export async function downloadShareCard(input: CardInput) {
  download(await renderCard(input, STORY), nameFor(input, "story"));
}

/**
 * Renders a phone-sized lock screen wallpaper. Uses the native share sheet when
 * available (so iOS/Android can hand it straight to Photos), otherwise downloads.
 */
export async function saveWallpaper(input: CardInput) {
  const blob = await renderCard(input, WALLPAPER);
  const filename = nameFor(input, "lockscreen");
  const file = new File([blob], filename, { type: "image/png" });


  if (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], title: "Today's affirmation" });
      return "shared" as const;
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return "cancelled" as const;
    }
  }

  download(blob, filename);
  return "downloaded" as const;
}


export async function downloadSquareCard(input: CardInput) {
  download(await renderCard(input, SQUARE), nameFor(input, "square"));
}

export async function shareSocialCard(input: CardInput, format: "story" | "square" = "story") {
  const blob = await renderCard(input, format === "square" ? SQUARE : STORY);
  const filename = nameFor(input, format);
  const file = new File([blob], filename, { type: "image/png" });
  if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Aurelia affirmation", text: input.affirmation });
      return "shared" as const;
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return "cancelled" as const;
    }
  }
  download(blob, filename);
  return "downloaded" as const;
}
