"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "../components/card";
import { DateCard } from "@/types/dateCard";
import { Doodles } from "../components/doodles";

export default function Recordacoes() {
  const gif = "/gifs/heart.gif";
  const [dates, setDates] = useState<DateCard[]>([]);

  useEffect(() => {
    async function carregarDates() {
      const { data, error } = await supabase
        .from("datecards")
        .select("*")
        .eq("feito", true)
        .order("dataFeito", { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      setDates(data || []);
    }
    carregarDates();
  }, []);

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
    // Desmarcado como feito -> some de /recordacoes (volta a viver em /lista)
    if (!novoValor) {
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
    const nomeArquivo = `${id}/${Date.now()}-${file.name}`;

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
    <div className="min-h-screen flex items-stretch">
      <aside className="shrink-0">
        <Doodles side="left" gifUrl={gif} />
      </aside>

      <main className="flex-1 max-w-4xl mx-auto pt-6 pb-20 px-3 sm:px-6">
        <h1 className="drip-title text-2xl sm:text-3xl md:text-4xl text-center font-bold">
          Recordações
        </h1>

        <div className="w-full space-y-4 mt-6">
          {dates.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma recordação ainda.</p>
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

      <aside className="shrink-0">
        <Doodles side="right" gifUrl={gif} />
      </aside>
    </div>
  );
}