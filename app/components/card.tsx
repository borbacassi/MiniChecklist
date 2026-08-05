    import { DateCard } from "@/types/dateCard";
    type CardProps = {
        date: DateCard
        onToggle: () => void;
    };

    export default function Card({ date, onToggle } : CardProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
  <h2 className="text-lg font-bold text-rose-600">{date.titulo}</h2>
  <p className="text-gray-600">{date.descricao}</p>
  <p className="text-sm text-gray-400">{date.data}</p>
  <div className="flex gap-2">
    {date.imgs.map((foto, index) => <img key={index} src={foto} className="w-20 h-20 object-cover rounded" />)}
  </div>
  <input type="checkbox" checked={date.feito} onChange={onToggle} className="w-5 h-5 accent-rose-500" />
</div>

    );
    }