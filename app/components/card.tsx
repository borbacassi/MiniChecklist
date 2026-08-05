    import { DateCard } from "@/types/dateCard";
    type CardProps = {
        date: DateCard
        onToggle: () => void;
        onDelete: () => void;
    };

    export default function Card({ date, onToggle, onDelete } : CardProps) {
    return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">

        <h2 className="text-lg font-bold text-rose-600">{date.titulo}</h2>
            <p className="text-gray-600">{date.descricao}</p>
            <p className="text-sm text-gray-400">{date.data}</p>

        <div className="flex gap-2">
            {(date.imgs ?? []).map((foto, index) => <img key={index} src={foto} 
            className="w-20 h-20 object-cover rounded" />)}
        </div>
        <div className="flex items-center justify-between">
            <input type="checkbox" checked={date.feito} onChange={onToggle} className="w-5 h-5 accent-rose-500" />
            <button onClick={onDelete} className="text-sm text-red-500 hover:text-red-700 hover:underline">Remover</button>
        </div>
    </div>

    );
    }