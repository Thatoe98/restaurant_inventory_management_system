import { supabase } from './supabase';

// Helper to parse CSV string with proper quote handling
export function parseCSV(csvString: string, keyColumn?: string): Record<string, string>[] {
  const lines = csvString.trim().split('\n');
  
  // Function to parse a CSV line with quoted fields
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };
  
  // Find the header row - look for common header patterns
  let headerIndex = 0;
  let headers: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const parsed = parseLine(lines[i]);
    // Look for typical header keywords (Item ID, Date, Sales, etc.)
    const hasHeaders = parsed.some(h => 
      h.includes('Item ID') || 
      h.includes('Date') || 
      h.includes('Sales') ||
      h.includes('Ingredient Name') ||
      (h.length > 2 && h.includes('('))  // Likely a header with units like "Sales (MMK)"
    );
    
    if (hasHeaders) {
      headers = parsed.map(h => h.trim());
      headerIndex = i;
      break;
    }
  }
  
  if (headers.length === 0) {
    // If no clear headers found, use first line as headers
    headers = parseLine(lines[0]).map(h => h.trim());
    headerIndex = 0;
  }
  
  // Parse data rows
  const rows = lines.slice(headerIndex + 1)
    .filter(line => line.trim().length > 0)
    .map(line => {
      const values = parseLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });
      return row;
    });
  
  // Filter by key column if specified, otherwise return all non-empty rows
  if (keyColumn) {
    return rows.filter(row => row[keyColumn] && row[keyColumn].length > 0);
  }
  
  // Filter out rows where all values are empty
  return rows.filter(row => Object.values(row).some(val => val.length > 0));
}

// Helper to remove commas and parse numbers
export function parseNumber(value: string): number {
  if (!value || value === '-' || value === '') return 0;
  // Remove commas, quotes, and percentage signs
  return parseFloat(value.replace(/[,"%]/g, ''));
}

// Import Menu Items
export async function importMenuItems(csvData: string) {
  const rows = parseCSV(csvData, 'Item ID');
  console.log('Parsed rows:', rows.length);
  console.log('Sample row:', rows[0]);
  
  const menuItems: any[] = [];
  const recipeIngredients: any[] = [];
  
  const ingredientColumns = [
    'Flour_g', 'TomatoSauce_g', 'WhiteSauce_g', 'Mozzarella_g', 'Parmesan_g',
    'Pesto_g', 'VegMix_g', 'Mushroom_g', 'Garlic_g', 'Onion_g', 'Chicken_g',
    'Beef_g', 'Pork_g', 'Salmon_g', 'Seafood_g', 'Anchovy_g', 'Potato_g',
    'Bread_g', 'Pita_g', 'CookingOil_g', 'OliveOil_g', 'Milk_ml', 'Cream_ml',
    'Soda_ml', 'Beer_ml', 'Wine_ml', 'Soju_ml', 'Spirits_ml', 'Sugar_g',
    'Butter_g', 'Egg_count', 'Chocolate_g', 'SauceOther_g', 'Lime_g', 'Mint_g'
  ];

  // Get unique menu items (deduplicate by Item ID)
  const uniqueItems = new Map<string, any>();
  
  rows.forEach(row => {
    const itemId = row['Item ID'];
    if (!itemId || itemId === '') return;
    
    // Check if we already have this item
    if (uniqueItems.has(itemId)) return;
    
    // Use "Sales Price (MMK)" and "Supplier Cost (MMK)" from Menu CSV
    const unitPrice = parseNumber(row['Sales Price (MMK)']);
    const unitCost = parseNumber(row['Supplier Cost (MMK)']);
    const unitGP = unitPrice - unitCost;
    const costPct = parseNumber(row['Cost % (Calc)']);
    
    uniqueItems.set(itemId, {
      id: itemId,
      name: row['Item Name'],
      menu_type: row['Menu Type'],
      section: row['Section'],
      unit_price: unitPrice,
      unit_cost: unitCost,
      unit_gp: unitGP,
      cost_percentage: costPct,
      is_active: true
    });
    
    // Extract recipe ingredients (these columns might not exist in Menu CSV)
    ingredientColumns.forEach(col => {
      if (row[col]) {
        const quantity = parseNumber(row[col]);
        if (quantity > 0) {
          // Clean up ingredient name (remove unit suffix)
          const ingredientName = col.replace(/_g$|_ml$|_count$/, '').replace(/_/g, ' ');
          recipeIngredients.push({
            menu_item_id: itemId,
            ingredient_name: ingredientName,
            quantity: quantity
          });
        }
      }
    });
  });

  // Insert menu items
  const menuItemsArray = Array.from(uniqueItems.values());
  console.log(`Importing ${menuItemsArray.length} menu items...`);
  console.log('Sample menu item:', menuItemsArray[0]);
  
  const { error: menuError } = await supabase
    .from('menu_items')
    .upsert(menuItemsArray, { onConflict: 'id' });
  
  if (menuError) {
    console.error('Error importing menu items:', menuError);
    throw menuError;
  }

  // Insert recipe ingredients
  console.log(`Importing ${recipeIngredients.length} recipe ingredients...`);
  
  // Delete existing recipes first
  const { error: deleteError } = await supabase
    .from('recipe_ingredients')
    .delete()
    .in('menu_item_id', menuItemsArray.map(m => m.id));
  
  if (deleteError) console.error('Error deleting old recipes:', deleteError);

  // Insert new recipes in batches
  const batchSize = 500;
  for (let i = 0; i < recipeIngredients.length; i += batchSize) {
    const batch = recipeIngredients.slice(i, i + batchSize);
    const { error } = await supabase
      .from('recipe_ingredients')
      .insert(batch);
    
    if (error) {
      console.error('Error importing recipe batch:', error);
      throw error;
    }
  }

  return {
    menuItems: menuItemsArray.length,
    recipeIngredients: recipeIngredients.length
  };
}

// Import Daily Sales
export async function importDailySales(csvData: string) {
  const rows = parseCSV(csvData, 'Date');
  const sales: any[] = [];
  
  rows.forEach(row => {
    const date = row['Date'];
    const itemId = row['Item ID'];
    
    if (!date || !itemId || date === '') return;
    
    sales.push({
      date: date,
      day_of_week: row['Day'],
      is_open: row['Open?'] === 'Open',
      item_id: itemId,
      quantity_sold: parseInt(row['Qty']) || 0,
      sales_amount: parseNumber(row['Sales (MMK)']),
      cogs_amount: parseNumber(row['COGS (MMK)']),
      gross_profit: parseNumber(row['Gross Profit (MMK)'])
    });
  });

  console.log(`Importing ${sales.length} daily sales records...`);
  
  // Clear existing data
  await supabase.from('daily_item_sales').delete().gte('date', '2026-02-01');
  
  // Insert in batches
  const batchSize = 500;
  for (let i = 0; i < sales.length; i += batchSize) {
    const batch = sales.slice(i, i + batchSize);
    const { error } = await supabase
      .from('daily_item_sales')
      .upsert(batch, { onConflict: 'date,item_id' });
    
    if (error) {
      console.error('Error importing sales batch:', error);
      throw error;
    }
  }

  return sales.length;
}

// Import Daily Summaries
export async function importDailySummaries(csvData: string) {
  const rows = parseCSV(csvData, 'Date');
  const summaries: any[] = [];
  
  rows.forEach(row => {
    const date = row['Date'];
    if (!date || date === '') return;
    
    summaries.push({
      date: date,
      day_of_week: row['Day'],
      is_open: row['Open?'] === 'Open',
      open_hours: row['Open Hours'] || null,
      hours_open: parseNumber(row['Hours Open']),
      covers: parseInt(row['Covers']) || 0,
      net_sales: parseNumber(row['Net Sales (MMK)']),
      cogs: parseNumber(row['COGS (MMK)']),
      gross_profit: parseNumber(row['Gross Profit (MMK)']),
      rent: parseNumber(row['Rent']),
      waiters_salaries: parseNumber(row['Waiters Salaries (5p)']),
      chefs_salaries: parseNumber(row['Chefs Salaries (2p)']),
      other_staff_salaries: parseNumber(row['Other Staff Salaries (7p)']),
      electricity_grid: parseNumber(row['Electricity (Grid)']),
      generator_fuel: parseNumber(row['Generator Fuel (Diesel)']),
      marketing_social: parseNumber(row['Marketing & Social']),
      maintenance_sanitation: parseNumber(row['Maintenance & Sanitation']),
      consumables: parseNumber(row['Consumables']),
      fixed_opex_total: parseNumber(row['Fixed Opex Total']),
      card_fees: parseNumber(row['Card Fees']),
      bank_charges: parseNumber(row['Bank Charges']),
      total_opex: parseNumber(row['Total Opex']),
      operating_profit: parseNumber(row['Operating Profit']),
      notes: row['Notes'] || null
    });
  });

  console.log(`Importing ${summaries.length} daily summaries...`);
  
  // Clear existing data
  await supabase.from('daily_summaries').delete().gte('date', '2026-02-01');
  
  const { error } = await supabase
    .from('daily_summaries')
    .upsert(summaries, { onConflict: 'date' });
  
  if (error) {
    console.error('Error importing summaries:', error);
    throw error;
  }

  return summaries.length;
}

// Import Cashbook Transactions
export async function importCashbookTransactions(csvData: string) {
  const rows = parseCSV(csvData, 'Date');
  const transactions: any[] = [];
  
  rows.forEach(row => {
    const date = row['Date'];
    if (!date || date === '') return;
    
    transactions.push({
      txn_id: row['Txn ID'] || null,
      date: date,
      description: row['Description'],
      inflow: parseNumber(row['Inflow (MMK)']),
      outflow: parseNumber(row['Outflow (MMK)']),
      category: row['Category'],
      reference: row['Reference'] || null,
      running_balance: parseNumber(row['Running Balance (MMK)'])
    });
  });

  console.log(`Importing ${transactions.length} cashbook transactions...`);
  
  // Clear existing data
  await supabase.from('cashbook_transactions').delete().gte('date', '2026-02-01');
  
  // Insert in batches
  const batchSize = 500;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    const { error } = await supabase
      .from('cashbook_transactions')
      .insert(batch);
    
    if (error) {
      console.error('Error importing transaction batch:', error);
      throw error;
    }
  }

  return transactions.length;
}

// Initialize ingredients from menu data
export async function initializeIngredients() {
  const ingredientsList = [
    { name: 'Flour', unit: 'g', category: 'Grain' },
    { name: 'TomatoSauce', unit: 'g', category: 'Sauce' },
    { name: 'WhiteSauce', unit: 'g', category: 'Sauce' },
    { name: 'Mozzarella', unit: 'g', category: 'Dairy' },
    { name: 'Parmesan', unit: 'g', category: 'Dairy' },
    { name: 'Pesto', unit: 'g', category: 'Sauce' },
    { name: 'VegMix', unit: 'g', category: 'Vegetable' },
    { name: 'Mushroom', unit: 'g', category: 'Vegetable' },
    { name: 'Garlic', unit: 'g', category: 'Vegetable' },
    { name: 'Onion', unit: 'g', category: 'Vegetable' },
    { name: 'Chicken', unit: 'g', category: 'Meat' },
    { name: 'Beef', unit: 'g', category: 'Meat' },
    { name: 'Pork', unit: 'g', category: 'Meat' },
    { name: 'Salmon', unit: 'g', category: 'Seafood' },
    { name: 'Seafood', unit: 'g', category: 'Seafood' },
    { name: 'Anchovy', unit: 'g', category: 'Seafood' },
    { name: 'Potato', unit: 'g', category: 'Vegetable' },
    { name: 'Bread', unit: 'g', category: 'Grain' },
    { name: 'Pita', unit: 'g', category: 'Grain' },
    { name: 'CookingOil', unit: 'g', category: 'Oil' },
    { name: 'OliveOil', unit: 'g', category: 'Oil' },
    { name: 'Milk', unit: 'ml', category: 'Dairy' },
    { name: 'Cream', unit: 'ml', category: 'Dairy' },
    { name: 'Soda', unit: 'ml', category: 'Beverage' },
    { name: 'Beer', unit: 'ml', category: 'Alcohol' },
    { name: 'Wine', unit: 'ml', category: 'Alcohol' },
    { name: 'Soju', unit: 'ml', category: 'Alcohol' },
    { name: 'Spirits', unit: 'ml', category: 'Alcohol' },
    { name: 'Sugar', unit: 'g', category: 'Sweetener' },
    { name: 'Butter', unit: 'g', category: 'Dairy' },
    { name: 'Egg', unit: 'count', category: 'Dairy' },
    { name: 'Chocolate', unit: 'g', category: 'Sweetener' },
    { name: 'SauceOther', unit: 'g', category: 'Sauce' },
    { name: 'Lime', unit: 'g', category: 'Fruit' },
    { name: 'Mint', unit: 'g', category: 'Herb' }
  ];

  console.log(`Initializing ${ingredientsList.length} ingredients...`);
  
  const { error } = await supabase
    .from('ingredients')
    .upsert(ingredientsList, { onConflict: 'name' });
  
  if (error) {
    console.error('Error initializing ingredients:', error);
    throw error;
  }

  return ingredientsList.length;
}
