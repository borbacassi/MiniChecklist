"use client";

import { useState, useEffect } from "react";

// Data de início da contagem (já embutida a piada interna dos +5 anos)
const DATA_INICIO = new Date(2021, 5, 17); // mês é 0-indexado: 5 = junho

interface TempoDecorrido {
  anos: number;
  meses: number;
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcularTempo(inicio: Date): TempoDecorrido {
  const agora = new Date();

  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();
  let horas = agora.getHours() - inicio.getHours();
  let minutos = agora.getMinutes() - inicio.getMinutes();
  let segundos = agora.getSeconds() - inicio.getSeconds();

  if (segundos < 0) {
    segundos += 60;
    minutos--;
  }
  if (minutos < 0) {
    minutos += 60;
    horas--;
  }
  if (horas < 0) {
    horas += 24;
    dias--;
  }
  if (dias < 0) {
    const diasNoMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
    dias += diasNoMesAnterior;
    meses--;
  }
  if (meses < 0) {
    meses += 12;
    anos--;
  }

  return { anos, meses, dias, horas, minutos, segundos };
}

export default function TempoJuntos() {
  const [tempo, setTempo] = useState<TempoDecorrido>(() => calcularTempo(DATA_INICIO));

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempo(calcularTempo(DATA_INICIO));
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const unidades: { valor: number; label: string }[] = [
    { valor: tempo.anos, label: "anos" },
    { valor: tempo.meses, label: "meses" },
    { valor: tempo.dias, label: "dias" },
    { valor: tempo.horas, label: "horas" },
    { valor: tempo.minutos, label: "min" },
    { valor: tempo.segundos, label: "seg" },
  ];

  return (
    <div className="webcore-window w-full max-w-2xl mx-auto rounded-3xl overflow-hidden">
      <div className="webcore-titlebar rounded-t-3xl">contador.exe</div>
      <div className="flex flex-col items-center gap-3 p-6">
        <h2 className="text-lg sm:text-xl font-bold text-center">Tempo juntos</h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {unidades.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center justify-center bg-white/70 rounded-2xl px-3 py-2 min-w-[60px] shadow-sm"
            >
              <span className="text-2xl sm:text-3xl font-bold tabular-nums">{u.valor}</span>
              <span className="text-xs uppercase text-gray-600">{u.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}