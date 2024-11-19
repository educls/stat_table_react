'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React from 'react'

type DadoDiscreto = {
  valor: number;
  frequencia: number;
  xifi: number;
  fac: number;
}

export default function AgrupadoTab() {
  const [dados, setDados] = useState<DadoDiscreto[]>([{ valor: 0, frequencia: 0, xifi: 0, fac: 0 }])
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
  })

  const adicionarLinha = () => {
    setDados([...dados, { valor: 0, frequencia: 0, xifi: 0, fac: 0 }])
  }

  const atualizarDado = (index: number, campo: keyof DadoDiscreto, valor: number) => {
    const novosDados = dados.map((dado, i) => {
      if (i === index) {
        const novoDado = { ...dado, [campo]: valor }
        novoDado.xifi = novoDado.valor * novoDado.frequencia
        return novoDado
      }
      return dado
    })
    setDados(novosDados)
  }

  const calcularEstatisticas = () => {
    const dadosOrdenados = [...dados].sort((a, b) => a.valor - b.valor)
    let fac = 0
    const dadosProcessados = dadosOrdenados.map(dado => {
      fac += dado.frequencia
      return { ...dado, fac }
    })
    setDados(dadosProcessados)

    const n = dadosProcessados.reduce((sum, dado) => sum + dado.frequencia, 0)
    const soma = dadosProcessados.reduce((sum, dado) => sum + dado.xifi, 0)
    const media = soma / n

    const mediana = calcularMediana(dadosProcessados, n)
    const moda = calcularModa(dadosProcessados)

    const variancia = dadosProcessados.reduce((acc, dado) =>
      acc + dado.frequencia * Math.pow(dado.valor - media, 2), 0) / n
    const desvioPadrao = Math.sqrt(variancia)

    setEstatisticas({
      media,
      mediana,
      moda,
      variancia,
      desvioPadrao,
    })
  }

  const calcularMediana = (dadosProcessados: DadoDiscreto[], n: number): number => {
    const meioN = n / 2
    let soma = 0
    for (let dado of dadosProcessados) {
      soma += dado.frequencia
      if (soma > meioN) {
        return dado.valor
      } else if (soma === meioN) {
        const proximoDado = dadosProcessados[dadosProcessados.indexOf(dado) + 1]
        return (dado.valor + proximoDado.valor) / 2
      }
    }
    return 0
  }

  const calcularModa = (dadosProcessados: DadoDiscreto[]): number[] => {
    const maxFrequencia = Math.max(...dadosProcessados.map(d => d.frequencia))
    return dadosProcessados.filter(d => d.frequencia === maxFrequencia).map(d => d.valor)
  }

  return (
    <div className="flex mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Análise de Dados Discretos</CardTitle>
          <CardDescription>Insira os valores e suas frequências</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Label>Valor</Label>
              <Label>Frequência</Label>
              {dados.map((dado, index) => (
                <React.Fragment key={index}>
                  <Input
                    type="number"
                    value={dado.valor}
                    onChange={(e) => atualizarDado(index, 'valor', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    value={dado.frequencia}
                    onChange={(e) => atualizarDado(index, 'frequencia', Number(e.target.value))}
                  />
                </React.Fragment>
              ))}
            </div>
            <div className='flex justify-between'>
              <Button onClick={adicionarLinha}>Adicionar Linha</Button>
              <Button onClick={calcularEstatisticas}>Calcular Estatísticas</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {dados.length > 0 && dados[0].fac > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tabela de Frequências</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Valor (xi)</TableHead>
                  <TableHead>Frequência (fi)</TableHead>
                  <TableHead>xi * fi</TableHead>
                  <TableHead>Frequência Acumulada (fac)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.map((dado, index) => (
                  <TableRow key={index}>
                    <TableCell>{dado.valor}</TableCell>
                    <TableCell>{dado.frequencia}</TableCell>
                    <TableCell>{dado.xifi.toFixed(2)}</TableCell>
                    <TableCell>{dado.fac}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              <p><strong>Moda:</strong> {estatisticas.moda?.join(', ')}</p>
              <p><strong>Variância:</strong> {estatisticas.variancia?.toFixed(2)}</p>
              <p><strong>Desvio Padrão:</strong> {estatisticas.desvioPadrao?.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}