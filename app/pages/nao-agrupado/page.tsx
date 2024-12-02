'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NaoAgrupadosTab() {
  const [dadosInput, setDadosInput] = useState('');
  const [dados, setDados] = useState<number[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<{
    media: number | null;
    mediana: number | null;
    moda: number[] | null;
    variancia: number | null;
    desvioPadrao: number | null;
  }>({
    media: null,
    mediana: null,
    moda: null,
    variancia: null,
    desvioPadrao: null,
  });

  const processarDados = () => {
    const novosDados = dadosInput.split(',').map(Number).filter(n => !isNaN(n));
    if (novosDados.length === 0) {
      setErro("Por favor, insira valores numéricos válidos separados por vírgula.");
      return;
    }
    setErro(null);
    setDados(novosDados);
    calcularEstatisticas(novosDados);
  };

  const calcularEstatisticas = (dados: number[]) => {
    const n = dados.length;
    if (n === 0) return;

    // Média
    const soma = dados.reduce((a, b) => a + b, 0);
    const media = soma / n;

    // Mediana
    const dadosOrdenados = [...dados].sort((a, b) => a - b);
    const mediana =
      n % 2 === 0
        ? (dadosOrdenados[n / 2 - 1] + dadosOrdenados[n / 2]) / 2
        : dadosOrdenados[Math.floor(n / 2)];

    // Moda
    const frequencias = dados.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const maxFrequencia = Math.max(...Object.values(frequencias));
    const moda =
      maxFrequencia > 1
        ? Object.entries(frequencias)
          .filter(([, freq]) => freq === maxFrequencia) // Corrigido aqui: comparando a frequência e não o valor da chave
          .map(([val]) => Number(val))
        : [];

    // Variância e Desvio Padrão
    const variancia = dados.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / n - 1;
    const desvioPadrao = Math.sqrt(variancia);

    setEstatisticas({
      media,
      mediana,
      moda,
      variancia,
      desvioPadrao,
    });
  };

  return (
    <div className="flex flex-col w-full h-full mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dados Discretos Não Agrupados</CardTitle>
          <CardDescription>Insira os dados separados por vírgula</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dados">Dados</Label>
              <Input
                id="dados"
                value={dadosInput}
                onChange={(e) => setDadosInput(e.target.value)}
                placeholder="Ex: 1,2,2,3,4,4,4,5"
              />
            </div>
            <Button onClick={processarDados}>Calcular</Button>
            {erro && <p className="text-red-500">{erro}</p>}
          </div>
        </CardContent>
      </Card>

      {dados.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados Inseridos</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[100px] w-full rounded-md border p-4">
              {dados.join(', ')}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {estatisticas.media !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados Estatísticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Média:</strong> {estatisticas.media.toFixed(2)}</p>
              <p><strong>Mediana:</strong> {estatisticas.mediana?.toFixed(2)}</p>
              <p><strong>Moda:</strong> {estatisticas.moda?.length ? estatisticas.moda.join(', ') : 'Nenhuma moda'}</p>
              <p><strong>Variância:</strong> {estatisticas.variancia?.toFixed(2)}</p>
              <p><strong>Desvio Padrão:</strong> {estatisticas.desvioPadrao?.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
