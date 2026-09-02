"use client";

import { useRef, useState } from "react";
import { DateCard } from "@/types/dateCard";
import MiniCalendar from "./minicalendar";

type EdicaoDateCard = {
  titulo: string;
  descricao: string;
  dataAdd: string;
  dataFeito: string;
};

type CardProps = {
  date: DateCard;
  onToggle: () => void;
  onDelete: () => void;
  onAddImage?: (file: File) => void | Promise<void>;
  onRemoveImage?: (url: string) => void | Promise<void>;
  onEdit?: (updates: EdicaoDateCard) => void | Promise<void>;
};

export default function Card({ date, onToggle, onDelete, onAddImage, onRemoveImage, onEdit }: CardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [removendoUrl, setRemovendoUrl] = useState<string | null>(null);

  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [tituloEdit, setTituloEdit] = useState(date.titulo);
  const [descricaoEdit, setDescricaoEdit] = useState(date.descricao);
  const [dataAddEdit, setDataAddEdit] = useState(date.dataAdd);
  const [dataFeitoEdit, setDataFeitoEdit] = useState(date.dataFeito);

  async function handleArquivoSelecionado(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onAddImage) return;
    setEnviando(true);
    try {
      await onAddImage(file);
    } finally {
      setEnviando(false);
      e.target.value = "";
    }
  }

  async function handleRemoverImagem(url: string) {
    if (!onRemoveImage) return;
    setRemovendoUrl(url);
    try {
      await onRemoveImage(url);
    } finally {
      setRemovendoUrl(null);
    }
  }

  function iniciarEdicao() {
    setTituloEdit(date.titulo);
    setDescricaoEdit(date.descricao);
    setDataAddEdit(date.dataAdd);
    setDataFeitoEdit(date.dataFeito);
    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);
  }

  async function salvarEdicao() {
    if (!onEdit) return;
    setSalvando(true);
    try {
      await onEdit({
        titulo: tituloEdit,
        descricao: descricaoEdit,
        dataAdd: dataAddEdit,
        dataFeito: dataFeitoEdit,
      });
      setEditando(false);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="webcore-window">
      <div className="webcore-titlebar">{date.titulo || "sem-titulo"}.date</div>
      <div className="p-3 space-y-2" style={{ fontFamily: "'Silkscreen', monospace", fontSize: "12px" }}>
        <div className="flex flex-wrap gap-2 items-center">
          {(date.imgs ?? []).map((foto, index) => (
            <div key={index} className="relative w-1/3 aspect-square">
              <img
                src={foto}
                className="w-full h-full object-cover border border-black"
              />
              {onRemoveImage && (
                <button
                  type="button"
                  onClick={() => handleRemoverImagem(foto)}
                  disabled={removendoUrl === foto}
                  className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-black text-white text-xs leading-none hover:bg-red-600 disabled:opacity-50"
                  title="Remover imagem"
                >
                  {removendoUrl === foto ? "…" : "×"}
                </button>
              )}
            </div>
          ))}

          {onAddImage && (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={enviando}
                className="w-1/3 aspect-square flex items-center justify-center border border-dashed border-black text-3xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                title="Adicionar imagem"
              >
                {enviando ? "..." : "+"}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleArquivoSelecionado}
                className="hidden"
              />
            </>
          )}
        </div>

        {editando ? (
          <div className="space-y-2">
            <input
              className="webcore-input w-full"
              type="text"
              value={tituloEdit}
              onChange={(e) => setTituloEdit(e.target.value)}
              placeholder="Título"
            />
            <input
              className="webcore-input w-full"
              type="text"
              value={descricaoEdit}
              onChange={(e) => setDescricaoEdit(e.target.value)}
              placeholder="Descrição"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <label className="text-xs text-gray-600">Adicionado em</label>
                <MiniCalendar className="webcore-input w-full" value={dataAddEdit} onChange={setDataAddEdit} />
              </div>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <label className="text-xs text-gray-600">Realizado em</label>
                <MiniCalendar className="webcore-input w-full" value={dataFeitoEdit} onChange={setDataFeitoEdit} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <p>{date.descricao}</p>
            <p className="text-gray-600">Adicionado em: {date.dataAdd}</p>
            <p className="text-gray-600">Realizado em: {date.dataFeito}</p>
          </>
        )}

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={date.feito} onChange={onToggle} className="w-4 h-4" />
            {date.feito && <span>feito</span>}
          </label>

          <div className="flex gap-2">
            {editando ? (
              <>
                <button
                  onClick={salvarEdicao}
                  disabled={salvando}
                  className="webcore-button text-xs disabled:opacity-50"
                >
                  {salvando ? "salvando..." : "salvar"}
                </button>
                <button onClick={cancelarEdicao} className="webcore-button text-xs">
                  cancelar
                </button>
              </>
            ) : (
              <>
                {onEdit && (
                  <button onClick={iniciarEdicao} className="webcore-button text-xs">
                    editar
                  </button>
                )}
                <button onClick={onDelete} className="webcore-button text-xs">
                  remover
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}