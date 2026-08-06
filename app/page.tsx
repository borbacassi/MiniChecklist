// page.tsx (Sua Página Principal)
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "./components/card";
import { DateCard } from "@/types/dateCard";
import { Doodles } from "./components/doodles"; // Certifique-se de que a importação está correta

export default function Home() {
  const gif =
  "/gifs/heart.gif";
  const [dates, setDates] = useState<DateCard[]>([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescr, setNovaDescr] = useState("");
  const [novaData, setNovaData] = useState("");

  // Links dos GIFs que você quer nas laterais. Substitua pelos seus preferidos!
  const gifEsquerdo = "/gifs/heart.gif"; // Ex: GIF 1 (Coração Pixel)
  const gifDireito = "/gifs/heart.gif"; // Ex: GIF 2 (Corações Girando)

  useEffect(() => {
    async function carregarDates() {
      const { data, error } = await supabase.from("datecards").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setDates(data || []);
    }
    carregarDates();
  }, []);

  // ... (manter funções criarDate, deleteDate, toggleFeito inalteradas)
  async function criarDate() {
    if (!novoTitulo.trim()) return;
    const novoDate = { titulo: novoTitulo, descricao: novaDescr, data: novaData, imgs: [], feito: false };
    const { data, error } = await supabase.from("datecards").insert([novoDate]).select();
    if (error) { console.error(error); return; }
    setDates([...dates, data[0]]);
    setNovoTitulo(""); setNovaDescr(""); setNovaData("");
  }

  async function deleteDate(id: string) {
    const { error } = await supabase.from("datecards").delete().eq("id", id);
    if (error) { console.error(error); return; }
    setDates(dates.filter((d) => d.id !== id));
  }

  async function toggleFeito(id: string) {
    const dateAtual = dates.find((d) => d.id === id);
    if (!dateAtual) return;
    const novoValor = !dateAtual.feito;
    const { error } = await supabase.from("datecards").update({ feito: novoValor }).eq("id", id);
    if (error) { console.error(error); return; }
    setDates(dates.map((d) => (d.id === id ? { ...d, feito: novoValor } : d)));
  }

  return (
    // Layout flex principal para centralizar o conteúdo
    <div className="min-h-screen flex items-stretch">
  <aside className="w-48 shrink-0">
    <Doodles side="left" gifUrl={gif} />
  </aside>

      {/* Conteúdo Centralizado */}
  <main className="flex-1 max-w-4xl mx-auto pt-6 pb-20 px-6">
       

        {/* Título */}
        <h1 className="drip-title text-3xl sm:text-4xl text-center font-bold">
          Lista de dates antes do casório!
        </h1>

        {/* Formulario / Janela Retro */}
        <div className="webcore-window w-full">
          <div className="webcore-titlebar">novo-date.exe</div>
          <div className="flex flex-col sm:flex-row gap-2 p-3">
            <input
              className="webcore-input flex-1 min-w-0"
              type="text"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              placeholder="Título"
            />
            <input
              className="webcore-input flex-1 min-w-0"
              type="text"
              value={novaDescr}
              onChange={(e) => setNovaDescr(e.target.value)}
              placeholder="Descrição"
            />
            <input
              className="webcore-input flex-1 min-w-0"
              type="text"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              placeholder="AAAA-MM-DD"
            />
            <button
              className="webcore-button whitespace-nowrap"
              onClick={criarDate}
            >
              + adicionar
            </button>
          </div>
        </div>

        {/* Lista de Cards */}
        <div className="w-full space-y-4">
          {dates.map((d) => (
            <Card
              key={d.id}
              date={d}
              onToggle={() => toggleFeito(d.id)}
              onDelete={() => deleteDate(d.id)}
            />
          ))}
        </div>

      </main>
      <aside className="w-48 shrink-0">
    <Doodles side="right" gifUrl={gif} />
  </aside>
    </div>
  );
}