"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "./components/card";


export default function Home(){
  const dataExample = [
  { id: "qwoijew",
    titulo: "primeiro date",
    feito: true,
    descricao: "primeiro dasdwte oxi",
    data: "2026-05-31",
    imgs: ["https://i.pinimg.com/736x/f1/7a/bd/f17abda8d87c5044da38156a79b34eb3.jpg"]

}]


  const [dates, setDates] = useState(dataExample)
  function toggleFeito(id:string){ 
    setDates(
      dates.map(
        (d) => d.id === id ?  
        { ...d, feito: !d.feito } : d
      )
    );
  };
  
  
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescr, setNovaDescr] = useState("");
  const [novaData, setNovaData] = useState("")

  function criarDate(){
    const novoDate = {
    id: crypto.randomUUID(),
    titulo: novoTitulo,
    descricao: novaDescr,
    data: novaData,
    imgs: [],
    feito: false
  }
  setDates([...dates,novoDate])
  setNovoTitulo("");
  setNovaDescr("");
  setNovaData("");
}
  return(
    <div className="max-w-2xl mx-auto p-6 space-y-6">
  <div className="flex gap-2 bg-white p-4 rounded-xl shadow">
    <input className="border rounded px-3 py-2 flex-1" type="text" value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} />
    <input className="border rounded px-3 py-2 flex-1" type="text" value={novaDescr} onChange={(e) => setNovaDescr(e.target.value)} />
    <input className="border rounded px-3 py-2 flex-1" type="text" value={novaData} onChange={(e) => setNovaData(e.target.value)} />
    <button className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600" onClick={criarDate}>Adicionar</button>
  </div>
  <div className="space-y-4">
    {dates.map((d) => (
      <Card key={d.id} date={d} onToggle={() => toggleFeito(d.id)} />
    ))}
  </div>
</div>
  )
}