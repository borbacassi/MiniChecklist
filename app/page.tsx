"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "./components/card";
import { DateCard } from "@/types/dateCard";
import { Doodles } from "./components/doodles";
import TempoJuntos from "./components/TempoJuntos";

const QTD_ULTIMOS_DATES = 6;

export default function Home() {
  const gif = "/gifs/heart.gif";
  const [ultimosDates, setUltimosDates] = useState<DateCard[]>([]);

  useEffect(() => {
    async function carregarUltimosDates() {
      const { data, error } = await supabase
        .from("datecards")
        .select("*")
        .order("dataFeito", { ascending: false })
        .limit(QTD_ULTIMOS_DATES);

      if (error) {
        console.error(error);
        return;
      }
      setUltimosDates(data || []);
    }
    carregarUltimosDates();
  }, []);

  return (
    <div className="min-h-screen flex items-stretch">
      <aside className="shrink-0">
        <Doodles side="left" gifUrl={gif} />
      </aside>

      <main className="flex-1 max-w-4xl mx-auto pt-6 pb-20 px-3 sm:px-6 flex flex-col gap-8">
        {/* Título */}
        <h1 className="drip-title text-2xl sm:text-3xl md:text-4xl text-center font-bold">
          Dates antes do Casório
        </h1>

        {/* Contador */}
        <TempoJuntos />

        {/* Grid dos últimos dates */}
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 text-center sm:text-left">
            Últimos dates
          </h2>

          {ultimosDates.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum date registrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ultimosDates.map((d) => (
                <Card
                  key={d.id}
                  date={d}
                  onToggle={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <aside className="shrink-0">
        <Doodles side="right" gifUrl={gif} />
      </aside>
    </div>
  );
}