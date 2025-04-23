"use client";

import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {scanBarcode} from "@/services/barcode-scanner";
import {useEffect} from 'react';
import {toast} from "@/hooks/use-toast";

export default function Home() {
  const [stockLevel, setStockLevel] = useState<number | undefined>(undefined);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);

  useEffect(() => {
    if (barcodeData) {
      toast({
        title: "Código de barras escaneado",
        description: `Valor: ${barcodeData}`,
      });
    }
  }, [barcodeData]);

  const handleScanBarcode = async () => {
    const data = await scanBarcode();
    if (data) {
      setBarcodeData(data.rawValue);
    } else {
      toast({
        title: "Falha na leitura",
        description: "Não foi possível escanear o código de barras.",
      });
    }
  };

  const handleManualStockUpdate = () => {
    if (stockLevel === undefined) {
      toast({
        title: "Entrada necessária",
        description: "Por favor, insira um nível de estoque válido.",
      });
      return;
    }

    if (stockLevel < 0) {
      toast({
        title: "Valor inválido",
        description: "O nível de estoque não pode ser negativo.",
      });
      return;
    }

    toast({
      title: "Estoque atualizado",
      description: `Nível de estoque definido como: ${stockLevel}`,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <header className="text-center">
        <h1 className="text-3xl font-semibold">Painel de Controle StockWise</h1>
        <p className="text-muted-foreground">Gerencie seu estoque com facilidade.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Entrada Manual de Estoque</CardTitle>
            <CardDescription>Atualize os níveis de estoque manualmente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              type="number"
              placeholder="Insira o nível de estoque"
              onChange={(e) => setStockLevel(Number(e.target.value))}
            />
            <Button onClick={handleManualStockUpdate} className="w-full bg-teal-500 text-white hover:bg-teal-700">
              Atualizar Estoque
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leitor de Código de Barras</CardTitle>
            <CardDescription>Escaneie códigos de barras para buscar informações.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleScanBarcode} className="w-full bg-teal-500 text-white hover:bg-teal-700">
              Escanear Código de Barras
            </Button>
            {barcodeData && <p>Valor Escaneado: {barcodeData}</p>}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Nível de Estoque</CardTitle>
            <CardDescription>Níveis de estoque atuais e pontos de reabastecimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Implemente um gráfico ou tabela aqui para mostrar os níveis de estoque.</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Dados de Vendas</CardTitle>
            <CardDescription>Tendências e estatísticas de vendas recentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Exiba dados de vendas e tendências usando gráficos.</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Previsão de Estoque com IA</CardTitle>
            <CardDescription>Preveja quando os produtos vão ficar sem estoque.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Exiba previsões de IA e recomendações de reabastecimento.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
