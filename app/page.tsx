"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Card from "./components/card";
import { DateCard } from "@/types/dateCard";

export default function Home(){

  const [dates, setDates] = useState<DateCard[]>([])
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescr, setNovaDescr] = useState("");
  const [novaData, setNovaData] = useState("")

  useEffect(() => {
  async function carregarDates() {
    const { data, error } = await supabase.from("datecards").select("*");

    if (error) {console.error(error); return;}
    setDates(data);
                    }
  carregarDates();
              }, []);

  async function criarDate(){
      const novoDate = {
      titulo: novoTitulo,
      descricao: novaDescr,
      data: novaData,
      imgs: [],
      feito: false
    }
    const {data, error} = await supabase
      .from("datecards")
      .insert([novoDate])
      .select();

    if(error){
      console.error(error)
      return;
    }
    setDates([...dates, data[0]]);
    setNovoTitulo("");
    setNovaDescr("");
    setNovaData("");
  }

  async function deleteDate(id:string) {

    const {error} = await supabase
    .from("datecards")
    .delete()
    .eq("id",id)

    if(error){
      console.error(error)
      return;
    }

    setDates(dates.filter((d) => d.id !== id))
    
  }

 async function toggleFeito(id: string) {
  const dateAtual = dates.find((d) => d.id === id);
  if (!dateAtual) return; // se não achou, não faz nada
  const novoValor = !dateAtual.feito;

  const { error } = await supabase
    .from("datecards")
    .update({ feito: novoValor })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  setDates(
    dates.map((d) => (d.id === id ? { ...d, feito: novoValor } : d))
  );
}

  return(
    <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-2 bg-white p-4 rounded-xl shadow">
            <input className="border rounded px-3 py-2 flex-1 min-w-0" type="text" value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)} placeholder="Título" />
              
            <input className="border rounded px-3 py-2 flex-1 min-w-0" type="text" value={novaDescr} 
              onChange={(e) => setNovaDescr(e.target.value)} placeholder="Descrição" />

            <input className="border rounded px-3 py-2 flex-1 min-w-0" type="text" value={novaData} 
              onChange={(e) => setNovaData(e.target.value)} placeholder="AAAA-MM-DD" />

            <button className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 whitespace-nowrap" 
              onClick={criarDate}>Adicionar</button>
        </div>
        
  <div className="space-y-4">
    {dates.map((d) => (
      <Card key={d.id} date={d} onToggle={() => toggleFeito(d.id)} onDelete={() => deleteDate(d.id)} />
    ))}
  </div>
</div>
  )
}