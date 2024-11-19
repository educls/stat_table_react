'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClasseTab() {
  const [limiteInferior, setLimiteInferior] = useState<number>(0)
  const [limiteSuperior, setLimiteSuperior] = useState<number>(0)
  const [intervalo, setIntervalo] = useState<number>(0)
  const [classes, setClasses] = useState<number>(0)
  const [frequencias, setFrequencias] = useState<number[]>([])
  const [tabela, setTabela] = useState<any[]>([])
  const [media, setMedia] = useState<number | null>(null)
  const [desvioPadrao, setDesvioPadrao] = useState<number | null>(null)

  const calcularClasses = () => {
    if (limiteInferior < limiteSuperior && intervalo > 0) {
      const numeroClasses = Math.ceil((limiteSuperior - limiteInferior) / intervalo)
      setClasses(numeroClasses)
      setFrequencias(new Array(numeroClasses).fill(0))
    }
  }

  const calcularTabela = () => {
    let novaTabela = []
    let fac = 0
    for (let i = 0; i < classes; i++) {
      const limiteInferiorClasse = limiteInferior + i * intervalo
      const limiteSuperiorClasse = limiteInferiorClasse + intervalo
      const xi = (limiteInferiorClasse + limiteSuperiorClasse) / 2
      const fi = frequencias[i] || 0
      fac += fi
      novaTabela.push({
        classe: `${limiteInferiorClasse.toFixed(2)} - ${limiteSuperiorClasse.toFixed(2)}`,
        xi: xi.toFixed(2),
        fi,
        xifi: (xi * fi).toFixed(2),
        fac
      })
    }
    setTabela(novaTabela)

    // Calcular média
    const somaXiFi = novaTabela.reduce((acc, row) => acc + parseFloat(row.xifi), 0)
    const somaFi = novaTabela.reduce((acc, row) => acc + row.fi, 0)
    const novaMedia = somaXiFi / somaFi
    setMedia(novaMedia)

    // Calcular desvio padrão
    const somaQuadrados = novaTabela.reduce((acc, row) => {
      return acc + row.fi * Math.pow(parseFloat(row.xi) - novaMedia, 2)
    }, 0)
    const novoDesvioPadrao = Math.sqrt(somaQuadrados / somaFi)
    setDesvioPadrao(novoDesvioPadrao)
  }

  const handleFrequenciaChange = (index: number, valor: number) => {
    const novasFrequencias = [...frequencias]
    novasFrequencias[index] = valor
    setFrequencias(novasFrequencias)
  }

  return (
    <div className="flex w-full h-full mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Análise Estatística</CardTitle>
          <CardDescription>Insira os limites e o intervalo das classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="limiteInferior">Limite Inferior</Label>
              <Input
                id="limiteInferior"
                type="number"
                value={limiteInferior}
                onChange={(e) => setLimiteInferior(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="limiteSuperior">Limite Superior</Label>
              <Input
                id="limiteSuperior"
                type="number"
                value={limiteSuperior}
                onChange={(e) => setLimiteSuperior(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="intervalo">Intervalo</Label>
              <Input
                id="intervalo"
                type="number"
                value={intervalo}
                onChange={(e) => setIntervalo(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={calcularClasses}>Calcular Classes</Button>
        </CardContent>
      </Card>

      {classes > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Frequências</CardTitle>
            <CardDescription>Insira as frequências para cada classe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {frequencias.map((freq, index) => (
                <div key={index}>
                  <Label htmlFor={`freq-${index}`}>
                    Classe {index + 1}: {(limiteInferior + index * intervalo).toFixed(2)} - {(limiteInferior + (index + 1) * intervalo).toFixed(2)}
                  </Label>
                  <Input
                    id={`freq-${index}`}
                    type="number"
                    value={freq}
                    onChange={(e) => handleFrequenciaChange(index, parseInt(e.target.value))}
                  />
                </div>
              ))}
            </div>
            <Button className="mt-4" onClick={calcularTabela}>Calcular Tabela</Button>
          </CardContent>
        </Card>
      )}

      {tabela.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Classe</TableHead>
                  <TableHead>Xi</TableHead>
                  <TableHead>fi</TableHead>
                  <TableHead>Xi * fi</TableHead>
                  <TableHead>fac</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tabela.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.classe}</TableCell>
                    <TableCell>{row.xi}</TableCell>
                    <TableCell>{row.fi}</TableCell>
                    <TableCell>{row.xifi}</TableCell>
                    <TableCell>{row.fac}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <p><strong>Média:</strong> {media?.toFixed(2)}</p>
              <p><strong>Desvio Padrão:</strong> {desvioPadrao?.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}