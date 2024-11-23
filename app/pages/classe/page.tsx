'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ITable } from '@/app/interface/ITable'

export default function ClasseTab() {
  const [limiteInferior, setLimiteInferior] = useState<number | null>(null)
  const [limiteSuperior, setLimiteSuperior] = useState<number | null>(null)
  const [intervalo, setIntervalo] = useState<number | null>(null)
  const [classes, setClasses] = useState<number | null>(null)
  const [frequencias, setFrequencias] = useState<number[]>([])
  const [tabela, setTabela] = useState<ITable[]>([])
  const [media, setMedia] = useState<number | null>(null)
  const [desvioPadrao, setDesvioPadrao] = useState<number | null>(null)

  const calcularClasses = () => {
    if (limiteInferior === null || limiteSuperior === null || intervalo === null) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
    if (limiteInferior >= limiteSuperior) {
      alert("O limite inferior deve ser menor que o superior.");
      return;
    }
    if (intervalo <= 0) {
      alert("O intervalo deve ser maior que zero.");
      return;
    }
    const numeroClasses = Math.ceil((limiteSuperior - limiteInferior) / intervalo);
    setClasses(numeroClasses);
    setFrequencias(new Array(numeroClasses).fill(0));
  };

  const calcularTabela = () => {
    if (frequencias.some((freq) => freq < 0)) {
      alert("As frequências devem ser valores não negativos.");
      return;
    }
    const novaTabela: ITable[] = [];
    let fac = 0;

    for (let i = 0; i < classes!; i++) {
      const limiteInferiorClasse = limiteInferior! + i * intervalo!;
      const limiteSuperiorClasse = limiteInferiorClasse + intervalo!;
      const xi = (limiteInferiorClasse + limiteSuperiorClasse) / 2;
      const fi = frequencias[i] || 0;
      fac += fi;
      novaTabela.push({
        classe: `${limiteInferiorClasse.toFixed(2)} - ${limiteSuperiorClasse.toFixed(2)}`,
        xi: Number(xi.toFixed(2)),
        fi,
        xifi: Number((xi * fi).toFixed(2)),
        fac,
      });
    }
    setTabela(novaTabela);

    const somaXiFi = novaTabela.reduce((acc, row) => acc + parseFloat(row.xifi.toString()), 0);
    const somaFi = novaTabela.reduce((acc, row) => acc + row.fi, 0);
    const novaMedia = somaXiFi / somaFi;
    setMedia(novaMedia);

    const somaQuadrados = novaTabela.reduce((acc, row) => acc + row.fi * Math.pow(parseFloat(row.xi.toString()) - novaMedia, 2), 0);
    const novoDesvioPadrao = Math.sqrt(somaQuadrados / somaFi);
    setDesvioPadrao(novoDesvioPadrao);
  };

  const handleFrequenciaChange = (index: number, valor: string) => {
    const numero = parseInt(valor);
    if (isNaN(numero) || numero < 0) return;
    const novasFrequencias = [...frequencias];
    novasFrequencias[index] = numero;
    setFrequencias(novasFrequencias);
  };

  return (
    <div className="flex flex-col w-full h-full mx-auto">
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
                value={limiteInferior || ''}
                placeholder="0"
                onChange={(e) => setLimiteInferior(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="limiteSuperior">Limite Superior</Label>
              <Input
                id="limiteSuperior"
                type="number"
                placeholder="0"
                value={limiteSuperior || ''}
                onChange={(e) => setLimiteSuperior(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="intervalo">Intervalo</Label>
              <Input
                id="intervalo"
                type="number"
                placeholder="0"
                value={intervalo || ''}
                onChange={(e) => setIntervalo(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={calcularClasses}>Calcular Classes</Button>
        </CardContent>
      </Card>

      {classes! > 0 && (
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
                    Classe {index + 1}: {(limiteInferior! + index * intervalo!).toFixed(2)} - {(limiteInferior! + (index + 1) * intervalo!).toFixed(2)}
                  </Label>
                  <Input
                    id={`freq-${index}`}
                    type="number"
                    value={freq || ''}
                    onChange={(e) => handleFrequenciaChange(index, e.target.value)}
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
  );
}
