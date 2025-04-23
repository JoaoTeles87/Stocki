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
        title: "Barcode Scanned",
        description: `Value: ${barcodeData}`,
      });
    }
  }, [barcodeData]);

  const handleScanBarcode = async () => {
    const data = await scanBarcode();
    if (data) {
      setBarcodeData(data.rawValue);
    } else {
      toast({
        title: "Scan Failed",
        description: "Could not scan barcode.",
      });
    }
  };

  const handleManualStockUpdate = () => {
    if (stockLevel === undefined) {
      toast({
        title: "Input Needed",
        description: "Please enter a valid stock level.",
      });
      return;
    }

    toast({
      title: "Stock Updated",
      description: `Stock level set to: ${stockLevel}`,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <header className="text-center">
        <h1 className="text-3xl font-semibold">StockWise Dashboard</h1>
        <p className="text-muted-foreground">Manage your inventory with ease.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Manual Stock Input</CardTitle>
            <CardDescription>Update stock levels manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              type="number"
              placeholder="Enter stock level"
              onChange={(e) => setStockLevel(Number(e.target.value))}
            />
            <Button onClick={handleManualStockUpdate} className="w-full bg-teal-500 text-white hover:bg-teal-700">
              Update Stock
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barcode Scanner</CardTitle>
            <CardDescription>Scan product barcodes to fetch info.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleScanBarcode} className="w-full bg-teal-500 text-white hover:bg-teal-700">
              Scan Barcode
            </Button>
            {barcodeData && <p>Scanned Value: {barcodeData}</p>}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Stock Level Overview</CardTitle>
            <CardDescription>Current stock levels and reorder points.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Implement chart or table here to show stock levels.</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Sales Data</CardTitle>
            <CardDescription>Recent sales trends and statistics.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Display sales data and trends using charts.</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Stock Prediction</CardTitle>
            <CardDescription>Predict when products will run out of stock.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Display AI predictions and reorder recommendations.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
