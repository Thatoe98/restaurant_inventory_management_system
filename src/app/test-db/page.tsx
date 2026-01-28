'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDBPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testDatabase() {
      const tests: any = {};
      
      // Test 1: Check items table
      try {
        const { data, error } = await supabase.from('items').select('*').limit(1);
        tests.items = error ? { error: error.message } : { success: true, count: data?.length || 0 };
      } catch (e) {
        tests.items = { error: String(e) };
      }

      // Test 2: Check batches table
      try {
        const { data, error } = await supabase.from('batches').select('*').limit(1);
        tests.batches = error ? { error: error.message } : { success: true, count: data?.length || 0 };
      } catch (e) {
        tests.batches = { error: String(e) };
      }

      // Test 3: Check transaction_logs table
      try {
        const { data, error } = await supabase.from('transaction_logs').select('*').limit(1);
        tests.transaction_logs = error ? { error: error.message } : { success: true, count: data?.length || 0 };
      } catch (e) {
        tests.transaction_logs = { error: String(e) };
      }

      // Test 4: Try to insert a test item
      try {
        const { data, error } = await supabase
          .from('items')
          .insert({
            name: 'Test Item',
            category: 'Test',
            unit: 'piece',
            is_high_value: false,
            min_stock_threshold: 5,
          })
          .select()
          .single();
        
        if (error) {
          tests.insert_test = { error: error.message };
        } else {
          tests.insert_test = { success: true, id: data.id };
          // Clean up - delete the test item
          await supabase.from('items').delete().eq('id', data.id);
        }
      } catch (e) {
        tests.insert_test = { error: String(e) };
      }

      setResults(tests);
      setLoading(false);
    }

    testDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
          <p className="text-lg">Testing database tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Database Connection Test</h1>
        
        <div className="space-y-4">
          {Object.entries(results).map(([table, result]: [string, any]) => (
            <div
              key={table}
              className={`p-6 rounded-lg border-2 ${
                result.error
                  ? 'border-red-500 bg-red-50'
                  : 'border-green-500 bg-green-50'
              }`}
            >
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {table.replace('_', ' ').toUpperCase()}
              </h2>
              {result.error ? (
                <div>
                  <p className="text-red-700 font-semibold">❌ Error:</p>
                  <pre className="text-sm mt-2 text-red-600 whitespace-pre-wrap">
                    {result.error}
                  </pre>
                </div>
              ) : (
                <p className="text-green-700 font-semibold">
                  ✅ Success! {result.count !== undefined && `(${result.count} records)`}
                  {result.id && ` - Test insert/delete successful`}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-500 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-900">
            <li>
              If you see errors about tables not existing, you need to run the SQL schema in Supabase
            </li>
            <li>
              Go to your Supabase dashboard: <br />
              <a
                href="https://yxjloclmfhxjczbipjru.supabase.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://yxjloclmfhxjczbipjru.supabase.co
              </a>
            </li>
            <li>Click on "SQL Editor" in the left sidebar</li>
            <li>
              Copy the contents of <code className="bg-gray-200 px-2 py-1 rounded">supabase-schema.sql</code> file
            </li>
            <li>Paste it into the SQL Editor and click "Run"</li>
            <li>Refresh this page to test again</li>
          </ol>
        </div>

        <div className="mt-4">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
