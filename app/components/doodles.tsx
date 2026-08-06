// components/doodles.tsx

interface DoodlesProps {
  side: "left" | "right";
  gifUrl: string;
}

const gifs = Array.from({ length: 12 });

export function Doodles({ side, gifUrl }: DoodlesProps) {
  return (
    <div
      className="h-full w-48"
      style={{
        backgroundImage: `url(${gifUrl})`,
        backgroundRepeat: "repeat-y",
        backgroundPosition: "center",
        backgroundSize: "80px",
      }}
    />
  );
}