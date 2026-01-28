'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  importMenuItems,
  importDailySales,
  importDailySummaries,
  importCashbookTransactions,
  initializeIngredients
} from '@/lib/csv-import';

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleFileUpload = async (file: File, importFn: Function, label: string) => {
    try {
      const text = await file.text();
      const result = await importFn(text);
      return { label, success: true, result };
    } catch (error: any) {
      return { label, success: false, error: error.message };
    }
  };

  const handleImportAll = async () => {
    setLoading(true);
    setResults([]);
    const newResults = [];

    try {
      // Initialize ingredients first
      newResults.push({ label: 'Ingredients', success: true, result: await initializeIngredients() });
      setResults([...newResults]);

      // Read the CSV files from the workspace
      const files = [
        { name: 'Menu', path: 'Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Menu (1).csv' },
        { name: 'DailySales', path: 'Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Daily_Item_Sales.csv' },
        { name: 'DailySummary', path: 'Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Daily_Summary.csv' },
        { name: 'Cashbook', path: 'Menu, FakeSales, ingredients_Feb-Mar-Apr_2026_DailyItemDetail_AuditReady.xlsx - Cashbook_Audit.csv' }
      ];

      alert('Please note: For automated import, place CSV files in the public folder or use the file upload inputs below.');
      
    } catch (error: any) {
      newResults.push({ label: 'Import', success: false, error: error.message });
    } finally {
      setResults(newResults);
      setLoading(false);
    }
  };

  const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const text = await file.text();
      const result = await importMenuItems(text);
      setResults([...results, { label: 'Menu Items', success: true, result }]);
    } catch (error: any) {
      setResults([...results, { label: 'Menu Items', success: false, error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSalesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const text = await file.text();
      const result = await importDailySales(text);
      setResults([...results, { label: 'Daily Sales', success: true, result }]);
    } catch (error: any) {
      setResults([...results, { label: 'Daily Sales', success: false, error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummariesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const text = await file.text();
      const result = await importDailySummaries(text);
      setResults([...results, { label: 'Daily Summaries', success: true, result }]);
    } catch (error: any) {
      setResults([...results, { label: 'Daily Summaries', success: false, error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCashbookUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const text = await file.text();
      const result = await importCashbookTransactions(text);
      setResults([...results, { label: 'Cashbook Transactions', success: true, result }]);
    } catch (error: any) {
      setResults([...results, { label: 'Cashbook Transactions', success: false, error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInitIngredients = async () => {
    setLoading(true);
    try {
      const result = await initializeIngredients();
      setResults([...results, { label: 'Initialize Ingredients', success: true, result }]);
    } catch (error: any) {
      setResults([...results, { label: 'Initialize Ingredients', success: false, error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-6 w-6" />
              Import CSV Data
            </CardTitle>
            <CardDescription>
              Upload your restaurant data from CSV files to populate the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Initialize Ingredients */}
            <div className="rounded-lg border bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">1. Initialize Ingredients</Label>
                  <p className="text-sm text-slate-600">Set up basic ingredient list (run this first)</p>
                </div>
                <Button onClick={handleInitIngredients} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Initialize
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <Label htmlFor="menu-file" className="text-base font-semibold">
                2. Menu Items & Recipes
              </Label>
              <p className="text-sm text-slate-600">Upload: Menu (1).csv</p>
              <Input
                id="menu-file"
                type="file"
                accept=".csv"
                onChange={handleMenuUpload}
                disabled={loading}
              />
            </div>

            {/* Daily Sales */}
            <div className="space-y-2">
              <Label htmlFor="sales-file" className="text-base font-semibold">
                3. Daily Item Sales
              </Label>
              <p className="text-sm text-slate-600">Upload: Daily_Item_Sales.csv</p>
              <Input
                id="sales-file"
                type="file"
                accept=".csv"
                onChange={handleSalesUpload}
                disabled={loading}
              />
            </div>

            {/* Daily Summaries */}
            <div className="space-y-2">
              <Label htmlFor="summaries-file" className="text-base font-semibold">
                4. Daily Summaries (P&L)
              </Label>
              <p className="text-sm text-slate-600">Upload: Daily_Summary.csv</p>
              <Input
                id="summaries-file"
                type="file"
                accept=".csv"
                onChange={handleSummariesUpload}
                disabled={loading}
              />
            </div>

            {/* Cashbook */}
            <div className="space-y-2">
              <Label htmlFor="cashbook-file" className="text-base font-semibold">
                5. Cashbook Transactions
              </Label>
              <p className="text-sm text-slate-600">Upload: Cashbook_Audit.csv</p>
              <Input
                id="cashbook-file"
                type="file"
                accept=".csv"
                onChange={handleCashbookUpload}
                disabled={loading}
              />
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-2 rounded-lg border bg-white p-4">
                <h3 className="font-semibold">Import Results:</h3>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded border p-2"
                  >
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.label}</p>
                      {result.success ? (
                        <p className="text-sm text-slate-600">
                          Imported: {typeof result.result === 'object' 
                            ? JSON.stringify(result.result) 
                            : result.result} records
                        </p>
                      ) : (
                        <p className="text-sm text-red-600">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Step 1:</strong> Click "Initialize Ingredients" to set up the base ingredient list.
            </p>
            <p>
              <strong>Step 2:</strong> Upload the Menu CSV to import all menu items and their recipes.
            </p>
            <p>
              <strong>Step 3:</strong> Upload Daily Sales CSV to import item-level sales data.
            </p>
            <p>
              <strong>Step 4:</strong> Upload Daily Summary CSV to import P&L statements.
            </p>
            <p>
              <strong>Step 5:</strong> Upload Cashbook CSV to import financial transactions.
            </p>
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <p className="font-semibold text-blue-900">Note:</p>
              <p className="text-blue-800">
                CSV files must be located in your workspace directory. The system will read them from there.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
