"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "../components/card";
import { DateCard } from "@/types/dateCard";
import { Doodles } from "../components/doodles";
import MiniCalendar from "../components/minicalendar";

function hoje(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function gerarNomeArquivo(id: string, file: File): string {
  return `${id}/${Date.now()}-${file.name}`;
}

export default function Lista() {
  const gif = "/gifs/heart.gif";
  const [dates, setDates] = useState<DateCard[]>([]);
  
  // Estados do formulário
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescr, setNovaDescr] = useState("");
  const [novaDataAdd, setNovaDataAdd] = useState(hoje());
  const [novaDataFeito, setNovaDataFeito] = useState(hoje());

  useEffect(() => {
    async function carregarDates() {
      const { data, error } = await supabase
        .from("datecards")
        .select("*")
        .eq("feito", false);
      if (error) {
        console.error(error);
        return;
      }
      setDates(data || []);
    }
    carregarDates();
  }, []);

  async function criarDate() {
    if (!novoTitulo.trim()) return;
    const novoDate = {
      titulo: novoTitulo,
      descricao: novaDescr,
      dataAdd: novaDataAdd,
      dataFeito: novaDataFeito,
      imgs: [],
      feito: false,
    };
    const { data, error } = await supabase.from("datecards").insert([novoDate]).select();
    if (error) {
      console.error(error);
      return;
    }
    setDates([...dates, data[0]]);
    
    // Limpar o formulário após criar
    setNovoTitulo("");
    setNovaDescr("");
    setNovaDataAdd(hoje());
    setNovaDataFeito(hoje());
  }

  async function deleteDate(id: string) {
    const { error } = await supabase.from("datecards").delete().eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    setDates(dates.filter((d) => d.id !== id));
  }

  async function toggleFeito(id: string) {
    const dateAtual = dates.find((d) => d.id === id);
    if (!dateAtual) return;
    const novoValor = !dateAtual.feito;
    const { error } = await supabase.from("datecards").update({ feito: novoValor }).eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    // Marcado como feito -> some de /lista (agora vive em /recordacoes)
    if (novoValor) {
      setDates(dates.filter((d) => d.id !== id));
    } else {
      setDates(dates.map((d) => (d.id === id ? { ...d, feito: novoValor } : d)));
    }
  }

  async function editarDate(
    id: string,
    updates: { titulo: string; descricao: string; dataAdd: string; dataFeito: string }
  ) {
    const { error } = await supabase.from("datecards").update(updates).eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    setDates(dates.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }

  async function adicionarImagem(id: string, file: File) {
    const nomeArquivo = gerarNomeArquivo(id, file);

    const { error: erroUpload } = await supabase.storage
      .from("date-images")
      .upload(nomeArquivo, file);

    if (erroUpload) {
      console.error(erroUpload);
      return;
    }

    const { data: urlData } = supabase.storage.from("date-images").getPublicUrl(nomeArquivo);
    const novaUrl = urlData.publicUrl;

    const dateAtual = dates.find((d) => d.id === id);
    if (!dateAtual) return;

    const novasImgs = [...(dateAtual.imgs ?? []), novaUrl];

    const { error } = await supabase.from("datecards").update({ imgs: novasImgs }).eq("id", id);
    if (error) {
      console.error(error);
      return;
    }

    setDates(dates.map((d) => (d.id === id ? { ...d, imgs: novasImgs } : d)));
  }

  async function removerImagem(id: string, url: string) {
    const marcador = "/date-images/";
    const indice = url.indexOf(marcador);
    if (indice === -1) {
      console.error("Não foi possível extrair o caminho do arquivo:", url);
      return;
    }
    const caminhoArquivo = url.substring(indice + marcador.length);

    const { error: erroStorage } = await supabase.storage
      .from("date-images")
      .remove([caminhoArquivo]);

    if (erroStorage) {
      console.error(erroStorage);
      return;
    }

    const dateAtual = dates.find((d) => d.id === id);
    if (!dateAtual) return;

    const novasImgs = (dateAtual.imgs ?? []).filter((img) => img !== url);

    const { error } = await supabase.from("datecards").update({ imgs: novasImgs }).eq("id", id);
    if (error) {
      console.error(error);
      return;
    }

    setDates(dates.map((d) => (d.id === id ? { ...d, imgs: novasImgs } : d)));
  }

  return (
    <div className="max-w-screen flex items-stretch overflow-x-hidden">
      <aside className="hidden md:block shrink-0 w-48">
        <Doodles side="left" gifUrl={gif} />
      </aside>

      <main className="flex-1 w-full max-w-4xl mx-auto pt-6 pb-20 px-4 sm:px-6">
        <h1 className="drip-title text-2xl sm:text-3xl md:text-4xl text-center font-bold">
          Lista de Dates
        </h1>

        {/* FORMULÁRIO DE CRIAÇÃO RESTAURADO */}
        <div className="webcore-window w-full mt-6 mb-8">
          <div className="webcore-titlebar">novo_date.exe</div>
          <div className="p-3 space-y-3" style={{ fontFamily: "'Silkscreen', monospace", fontSize: "12px" }}>
            <input
              className="webcore-input w-full"
              type="text"
              placeholder="Título do date..."
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />
            <input
              className="webcore-input w-full"
              type="text"
              placeholder="Descrição ou ideias..."
              value={novaDescr}
              onChange={(e) => setNovaDescr(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <label className="text-xs text-gray-600">Adicionado em</label>
                <MiniCalendar className="webcore-input w-full" value={novaDataAdd} onChange={setNovaDataAdd} />
              </div>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <label className="text-xs text-gray-600">Planejado para</label>
                <MiniCalendar className="webcore-input w-full" value={novaDataFeito} onChange={setNovaDataFeito} />
              </div>
            </div>
            <button 
              className="webcore-button w-full mt-2"
              onClick={criarDate}
            >
              Adicionar à Lista
            </button>
          </div>
        </div>

        {/* LISTA DE CARDS */}
        <div className="w-full flex flex-col gap-6">
          {dates.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum date planejado no momento.</p>
          ) : (
            dates.map((d) => (
              <Card
                key={d.id}
                date={d}
                onToggle={() => toggleFeito(d.id)}
                onDelete={() => deleteDate(d.id)}
                onAddImage={(file) => adicionarImagem(d.id, file)}
                onRemoveImage={(url) => removerImagem(d.id, url)}
                onEdit={(updates) => editarDate(d.id, updates)}
              />
            ))
          )}
        </div>
      </main>

      <aside className="hidden md:block shrink-0 w-48">
        <Doodles side="right" gifUrl={gif} />
      </aside>
    </div>
  );
}