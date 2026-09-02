// components/doodles.tsx

interface DoodlesProps {
  side: "left" | "right";
  gifUrl: string;
}

const gifs = Array.from({ length: 12 });

export function Doodles({ side, gifUrl }: DoodlesProps) {
  return (
    <div
      className="h-full w-12 sm:w-16 md:w-48 shrink-0"
      style={{
        backgroundImage: `url(${gifUrl})`,
        backgroundRepeat: "repeat-y",
        backgroundPosition: "center",
        backgroundSize: "clamp(28px, 9vw, 80px)",
      }}
    />
  );
}