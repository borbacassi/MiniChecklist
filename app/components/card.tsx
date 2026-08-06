import { DateCard } from "@/types/dateCard";
type CardProps = {
  date: DateCard;
  onToggle: () => void;
  onDelete: () => void;
};

export default function Card({ date, onToggle, onDelete }: CardProps) {
  return (
    <div className="webcore-window">
      <div className="webcore-titlebar">{date.titulo || "sem-titulo"}.date</div>
      <div className="p-3 space-y-2" style={{ fontFamily: "'Silkscreen', monospace", fontSize: "12px" }}>
        <p>{date.descricao}</p>
        <p className="text-gray-600">{date.data}</p>
        <div className="flex gap-2">
          {(date.imgs ?? []).map((foto, index) => (
            <img key={index} src={foto} className="w-16 h-16 object-cover border border-black" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <input type="checkbox" checked={date.feito} onChange={onToggle} className="w-4 h-4" />
          <button onClick={onDelete} className="webcore-button text-xs">remover</button>
        </div>
      </div>
    </div>
  );
}