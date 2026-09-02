"use client";

import { useState, useRef, useEffect } from "react";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatarAAAAMMDD(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseAAAAMMDD(str: string | undefined | null): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

interface MiniCalendarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function MiniCalendar({ value, onChange, className = "" }: MiniCalendarProps) {
  const [aberto, setAberto] = useState(false);
  const [mesAtual, setMesAtual] = useState<Date>(() => parseAAAAMMDD(value) || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const dataSelecionada = parseAAAAMMDD(value);

  const primeiroDiaDoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
  const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
  const diaSemanaInicio = primeiroDiaDoMes.getDay();

  const celulas: (number | null)[] = [];
  for (let i = 0; i < diaSemanaInicio; i++) celulas.push(null);
  for (let dia = 1; dia <= diasNoMes; dia++) celulas.push(dia);

  function selecionarDia(dia: number) {
    const nova = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);
    onChange(formatarAAAAMMDD(nova));
    setAberto(false);
  }

  function mudarMes(delta: number) {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + delta, 1));
  }

  function ehHoje(dia: number): boolean {
    const hoje = new Date();
    return (
      dia === hoje.getDate() &&
      mesAtual.getMonth() === hoje.getMonth() &&
      mesAtual.getFullYear() === hoje.getFullYear()
    );
  }

  function ehSelecionado(dia: number): boolean {
    return (
      !!dataSelecionada &&
      dia === dataSelecionada.getDate() &&
      mesAtual.getMonth() === dataSelecionada.getMonth() &&
      mesAtual.getFullYear() === dataSelecionada.getFullYear()
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        className={className}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setAberto(true)}
        placeholder="AAAA-MM-DD"
      />

      {aberto && (
        <div
          className="absolute z-50 mt-1 w-64 rounded-md border border-gray-300 bg-white shadow-lg p-3"
          style={{ fontFamily: "inherit" }}
        >
          {/* Cabeçalho: mês/ano + navegação */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => mudarMes(-1)}
              className="px-2 py-1 rounded hover:bg-gray-100 text-sm"
            >
              ‹
            </button>
            <span className="text-sm font-semibold">
              {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => mudarMes(1)}
              className="px-2 py-1 rounded hover:bg-gray-100 text-sm"
            >
              ›
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
            {DIAS_SEMANA.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* Grade de dias */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {celulas.map((dia, idx) =>
              dia === null ? (
                <span key={idx} />
              ) : (
                <button
                  type="button"
                  key={idx}
                  onClick={() => selecionarDia(dia)}
                  className={`rounded-full w-8 h-8 flex items-center justify-center
                    ${ehSelecionado(dia) ? "bg-blue-600 text-white" : ""}
                    ${!ehSelecionado(dia) && ehHoje(dia) ? "border border-blue-500" : ""}
                    ${!ehSelecionado(dia) ? "hover:bg-gray-100" : ""}
                  `}
                >
                  {dia}
                </button>
              )
            )}
          </div>

          {/* Botão hoje */}
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                const hoje = new Date();
                setMesAtual(hoje);
                selecionarDia(hoje.getDate());
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}