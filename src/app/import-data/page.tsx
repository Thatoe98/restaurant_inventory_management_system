'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function DataImportPage() {
  const [importingMenu, setImportingMenu] = useState(false);
  const [importingIngredients, setImportingIngredients] = useState(false);
  const [importingRecipes, setImportingRecipes] = useState(false);
  const [importingSales, setImportingSales] = useState(false);
  const [importingSummaries, setImportingSummaries] = useState(false);
  const [importingUsage, setImportingUsage] = useState(false);
  const [importingAlerts, setImportingAlerts] = useState(false);
  const [importingPurchaseOrders, setImportingPurchaseOrders] = useState(false);
  const [importingPayroll, setImportingPayroll] = useState(false);
  const [menuResults, setMenuResults] = useState<any>(null);
  const [ingredientsResults, setIngredientsResults] = useState<any>(null);
  const [recipesResults, setRecipesResults] = useState<any>(null);
  const [salesResults, setSalesResults] = useState<any>(null);
  const [summariesResults, setSummariesResults] = useState<any>(null);
  const [usageResults, setUsageResults] = useState<any>(null);
  const [alertsResults, setAlertsResults] = useState<any>(null);
  const [purchaseOrdersResults, setPurchaseOrdersResults] = useState<any>(null);
  const [payrollResults, setPayrollResults] = useState<any>(null);
  const [importingInventoryStatus, setImportingInventoryStatus] = useState(false);
  const [inventoryStatusResults, setInventoryStatusResults] = useState<any>(null);
  const [syncingInventory, setSyncingInventory] = useState(false);
  const [syncResults, setSyncResults] = useState<any>(null);

  const importMenuData = async () => {
    setImportingMenu(true);
    setMenuResults(null);
    
    try {
      const menuData = [
        { item_id: 'F-001', menu_code: '001', name: 'Margherita (Tomato Sauce, Cheese & Basil)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 12000, unit_cost: 4200, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        { item_id: 'F-002', menu_code: '002', name: 'Mixed Veggie (Bell Pepper, Spinach, Onion, Tomato, Corn, Black Olive, Pesto)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 14000, unit_cost: 4900, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        { item_id: 'F-003', menu_code: '003', name: 'White Mushroom (White Sauce, Mixed Mushroom, Rocket Salad)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 16000, unit_cost: 5600, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        { item_id: 'F-004', menu_code: '006', name: "Yan'kin House (Chicken, Pesto, Black Olive, Rocket Salad)", menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 18000, unit_cost: 6300, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        { item_id: 'F-005', menu_code: '009', name: 'Mont Blanc (Pork Ham, Bacon, Parmesan, Rocket Salad)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 22000, unit_cost: 8800, is_high_value: true, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 3 },
        { item_id: 'F-006', menu_code: '017', name: 'Anchovies (Italian Anchovie, Capers, Black Olive)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 24000, unit_cost: 11040, is_high_value: true, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 4 },
        { item_id: 'F-007', menu_code: '018', name: 'Seafood (Mixed Seafood, Pesto, Garlic, Black Olive)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 20000, unit_cost: 8800, is_high_value: true, has_expiry_tracking: true, storage_location: 'Freezer', prep_station: 'Kitchen', lead_time_days: 4 },
        { item_id: 'F-008', menu_code: '020', name: 'Hokkaido (Salmon, Prawn, Onion, Garlic, Pesto)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 26000, unit_cost: 11960, is_high_value: true, has_expiry_tracking: true, storage_location: 'Freezer', prep_station: 'Kitchen', lead_time_days: 4 },
        { item_id: 'F-009', menu_code: '021', name: 'Buffalo Bill (Beef Tenderloin, Bell Pepper, Onion, Garlic, Rocket Salad)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 20000, unit_cost: 9200, is_high_value: true, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 4 },
        { item_id: 'F-010', menu_code: '023', name: 'Baby Face (White Sauce, Minced Beef, Black Olives, Rocket Salad)', menu_type: 'Food', section: 'Pizza Grande (11")', portion_size: '11 inch', unit_price: 22000, unit_cost: 8800, is_high_value: true, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 4 },
        // Petite Pizzas
        { item_id: 'F-011', menu_code: '024', name: 'Olivia (Onion, Garlic & Black Olive)', menu_type: 'Food', section: 'Pizza Petite (7")', portion_size: '7 inch', unit_price: 6800, unit_cost: 2244, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        { item_id: 'F-012', menu_code: '025', name: 'Mini Veggie (Mixed Veggie, Black Olive & Pesto)', menu_type: 'Food', section: 'Pizza Petite (7")', portion_size: '7 inch', unit_price: 7800, unit_cost: 2574, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        { item_id: 'F-013', menu_code: '028', name: 'Havana (Chicken, Corn, Coriander & Mixed Chillies)', menu_type: 'Food', section: 'Pizza Petite (7")', portion_size: '7 inch', unit_price: 7800, unit_cost: 2574, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 3 },
        { item_id: 'F-014', menu_code: '031', name: 'Rio (Beef, Onion, Garlic, Black Pepper & Mixed Chillies)', menu_type: 'Food', section: 'Pizza Petite (7")', portion_size: '7 inch', unit_price: 9500, unit_cost: 3135, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 3 },
        { item_id: 'F-015', menu_code: '033', name: 'Mauritius (Mixed Seafood, Pesto, Garlic & Black Olive)', menu_type: 'Food', section: 'Pizza Petite (7")', portion_size: '7 inch', unit_price: 8000, unit_cost: 3344, is_high_value: true, has_expiry_tracking: true, storage_location: 'Freezer', prep_station: 'Kitchen', lead_time_days: 3 },
        // Bruschetta
        { item_id: 'F-016', menu_code: '034', name: 'Greek Bruschetta (Ricotta, Tomato, Onion, Black Olive & Pesto)', menu_type: 'Food', section: 'Bruschetta', portion_size: '6 pcs', unit_price: 7800, unit_cost: 2184, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        { item_id: 'F-017', menu_code: '036', name: 'Yangon Eggplant Bruschetta (Eggplant, Tomato, Onion, Garlic, Coriander & Sesame Oil)', menu_type: 'Food', section: 'Bruschetta', portion_size: '6 pcs', unit_price: 6800, unit_cost: 1904, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 2 },
        // Pub Snacks
        { item_id: 'F-018', menu_code: '100', name: 'Cucumber & Sesame Oil', menu_type: 'Food', section: 'Pub Snacks', portion_size: 'small plate', unit_price: 2500, unit_cost: 800, is_high_value: false, has_expiry_tracking: false, storage_location: 'Ambient', prep_station: 'Kitchen', lead_time_days: 1 },
        { item_id: 'F-019', menu_code: '108', name: 'Potato Fries', menu_type: 'Food', section: 'Pub Snacks', portion_size: 'basket', unit_price: 3800, unit_cost: 1216, is_high_value: false, has_expiry_tracking: true, storage_location: 'Freezer', prep_station: 'Kitchen', lead_time_days: 3 },
        { item_id: 'F-020', menu_code: '120', name: 'Boneless Fried Chicken', menu_type: 'Food', section: 'Pub Snacks', portion_size: 'plate', unit_price: 4800, unit_cost: 1536, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 3 },
        { item_id: 'F-021', menu_code: '128', name: 'Chicken Wings', menu_type: 'Food', section: 'Pub Snacks', portion_size: '6 pcs', unit_price: 6500, unit_cost: 2080, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 3 },
        { item_id: 'F-022', menu_code: '132', name: 'Dried Beef Jerky (Myanmar Style)', menu_type: 'Food', section: 'Pub Snacks', portion_size: 'plate', unit_price: 6500, unit_cost: 2080, is_high_value: false, has_expiry_tracking: false, storage_location: 'Ambient', prep_station: 'Kitchen', lead_time_days: 7 },
        { item_id: 'F-023', menu_code: '138', name: 'Smoked Pork Belly', menu_type: 'Food', section: 'Pub Snacks', portion_size: 'plate', unit_price: 7800, unit_cost: 2496, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 4 },
        // Signature Dishes
        { item_id: 'F-024', menu_code: '140', name: 'Beirut (Hummus, Chicken Kofta, Pita & Condiments)', menu_type: 'Food', section: 'Signature Dishes', portion_size: 'plate', unit_price: 10000, unit_cost: 4000, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 3 },
        { item_id: 'F-025', menu_code: '146', name: 'Beef Tenderloin & Gravy', menu_type: 'Food', section: 'Signature Dishes', portion_size: 'plate', unit_price: 12000, unit_cost: 7500, is_high_value: true, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 4 },
        { item_id: 'F-026', menu_code: '152', name: 'Salmon Salt & Pepper', menu_type: 'Food', section: 'Grilled Fish', portion_size: 'plate', unit_price: 14000, unit_cost: 8750, is_high_value: true, has_expiry_tracking: true, storage_location: 'Freezer', prep_station: 'Kitchen', lead_time_days: 5 },
        // House Specials
        { item_id: 'F-027', menu_code: '264', name: 'Fish and Chips (Fried Seabass, Fries, Pink Tartar Sauce)', menu_type: 'Food', section: 'House Specials', portion_size: 'plate', unit_price: 14000, unit_cost: 5320, is_high_value: false, has_expiry_tracking: true, storage_location: 'Freezer', prep_station: 'Kitchen', lead_time_days: 4 },
        { item_id: 'F-028', menu_code: '266', name: 'Chicken Schnitzel II (Creamy Spinach, Fries, Pink Tartar Sauce)', menu_type: 'Food', section: 'House Specials', portion_size: 'plate', unit_price: 15000, unit_cost: 5700, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 4 },
        { item_id: 'F-029', menu_code: '269', name: 'French Stew & Steamed Potato (Slow Cooked Beef Tongue, Red Wine Sauce)', menu_type: 'Food', section: 'House Specials', portion_size: 'plate', unit_price: 18000, unit_cost: 9800, is_high_value: true, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 5 },
        { item_id: 'F-030', menu_code: '270', name: "Fry'kin Platter (Wings, Samosa, Spring Rolls, Bayarkyaw, Corn Tempura)", menu_type: 'Food', section: 'House Specials', portion_size: 'sharing platter', unit_price: 11000, unit_cost: 4180, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 3 },
        // Desserts
        { item_id: 'F-031', menu_code: '279', name: 'Brownie & Vanilla Ice Cream', menu_type: 'Food', section: 'Desserts', portion_size: 'plate', unit_price: 6500, unit_cost: 1625, is_high_value: false, has_expiry_tracking: true, storage_location: 'Freezer', prep_station: 'Kitchen', lead_time_days: 5 },
        { item_id: 'F-032', menu_code: '280', name: 'Chocolate Mousse', menu_type: 'Food', section: 'Desserts', portion_size: 'cup', unit_price: 6000, unit_cost: 1500, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Kitchen', lead_time_days: 5 },
        // Drinks
        { item_id: 'D-001', menu_code: '517', name: 'Plain Milk', menu_type: 'Drink', section: 'Iced Milk', portion_size: '300 ml', unit_price: 2800, unit_cost: 1540, is_high_value: false, has_expiry_tracking: true, storage_location: 'Chiller', prep_station: 'Bar', lead_time_days: 2 },
        { item_id: 'D-002', menu_code: '551', name: 'Coca-Cola', menu_type: 'Drink', section: 'Juice & Soft Drinks', portion_size: '330 ml', unit_price: 2500, unit_cost: 1125, is_high_value: false, has_expiry_tracking: false, storage_location: 'Ambient', prep_station: 'Bar', lead_time_days: 7 },
        { item_id: 'D-003', menu_code: '573', name: 'Heineken (Draught 50cl)', menu_type: 'Drink', section: 'Draught Beer', portion_size: '500 ml', unit_price: 5500, unit_cost: 1925, is_high_value: false, has_expiry_tracking: false, storage_location: 'Chiller', prep_station: 'Bar', lead_time_days: 2 },
        { item_id: 'D-004', menu_code: '576', name: 'Tiger (Draught 50cl)', menu_type: 'Drink', section: 'Draught Beer', portion_size: '500 ml', unit_price: 5000, unit_cost: 1750, is_high_value: false, has_expiry_tracking: false, storage_location: 'Chiller', prep_station: 'Bar', lead_time_days: 2 },
        { item_id: 'D-005', menu_code: '585', name: 'Heineken (Bottle)', menu_type: 'Drink', section: 'Beer Bottles', portion_size: '330 ml', unit_price: 5500, unit_cost: 2750, is_high_value: false, has_expiry_tracking: false, storage_location: 'Chiller', prep_station: 'Bar', lead_time_days: 5 },
        { item_id: 'D-006', menu_code: '586', name: 'Tiger Crystal (Bottle)', menu_type: 'Drink', section: 'Beer Bottles', portion_size: '330 ml', unit_price: 4500, unit_cost: 2250, is_high_value: false, has_expiry_tracking: false, storage_location: 'Chiller', prep_station: 'Bar', lead_time_days: 5 },
        { item_id: 'D-007', menu_code: '587', name: 'Hoegaarden (Bottle)', menu_type: 'Drink', section: 'Beer Bottles', portion_size: '330 ml', unit_price: 6000, unit_cost: 3000, is_high_value: false, has_expiry_tracking: false, storage_location: 'Chiller', prep_station: 'Bar', lead_time_days: 5 },
        { item_id: 'D-008', menu_code: '596', name: 'Chum-Churum Original Soju (0.36L)', menu_type: 'Drink', section: 'Soju', portion_size: '360 ml', unit_price: 10000, unit_cost: 5500, is_high_value: true, has_expiry_tracking: false, storage_location: 'Ambient', prep_station: 'Bar', lead_time_days: 10 },
        { item_id: 'D-009', menu_code: '559', name: 'House Red Wine (Glass)', menu_type: 'Drink', section: 'Wine', portion_size: '150 ml', unit_price: 8500, unit_cost: 5000, is_high_value: false, has_expiry_tracking: false, storage_location: 'Bar Shelf', prep_station: 'Bar', lead_time_days: 10 },
        { item_id: 'D-010', menu_code: '570', name: 'Catena Cabernet Sauvignon (Bottle)', menu_type: 'Drink', section: 'Red Wine Bottles', portion_size: '750 ml', unit_price: 85000, unit_cost: 46750, is_high_value: true, has_expiry_tracking: false, storage_location: 'Bar Shelf', prep_station: 'Bar', lead_time_days: 14 },
        { item_id: 'D-011', menu_code: '606', name: 'Jägermeister (Shot)', menu_type: 'Drink', section: 'Shots', portion_size: '30 ml', unit_price: 3800, unit_cost: 3000, is_high_value: true, has_expiry_tracking: false, storage_location: 'Bar Shelf', prep_station: 'Bar', lead_time_days: 14 },
        { item_id: 'D-012', menu_code: '623', name: "Jack Daniel's (Glass)", menu_type: 'Drink', section: 'Spirits', portion_size: '45 ml', unit_price: 6800, unit_cost: 6000, is_high_value: true, has_expiry_tracking: false, storage_location: 'Bar Shelf', prep_station: 'Bar', lead_time_days: 14 },
        { item_id: 'D-013', menu_code: '632', name: 'Glenfiddich 12 (Glass)', menu_type: 'Drink', section: 'Spirits', portion_size: '45 ml', unit_price: 10000, unit_cost: 8000, is_high_value: true, has_expiry_tracking: false, storage_location: 'Bar Shelf', prep_station: 'Bar', lead_time_days: 14 },
        { item_id: 'D-014', menu_code: '633', name: 'Glenfiddich 15 (Glass)', menu_type: 'Drink', section: 'Spirits', portion_size: '45 ml', unit_price: 14000, unit_cost: 10000, is_high_value: true, has_expiry_tracking: false, storage_location: 'Bar Shelf', prep_station: 'Bar', lead_time_days: 14 },
        { item_id: 'D-015', menu_code: '636', name: 'Gin & Tonic', menu_type: 'Drink', section: 'Cocktails', portion_size: '250 ml', unit_price: 6000, unit_cost: 4500, is_high_value: false, has_expiry_tracking: false, storage_location: 'Bar Shelf', prep_station: 'Bar', lead_time_days: 7 },
      ];

      // Insert menu items
      const { data: insertedMenu, error: menuError } = await supabase
        .from('menu_items')
        .insert(menuData)
        .select();

      if (menuError) throw menuError;

      setMenuResults({
        success: true,
        menuItems: insertedMenu?.length || 0,
        message: `Successfully imported ${insertedMenu?.length} menu items!`
      });

    } catch (error: any) {
      setMenuResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingMenu(false);
    }
  };

  const importIngredientsData = async () => {
    setImportingIngredients(true);
    setIngredientsResults(null);
    
    try {
      const ingredientsData = [
        { name: 'Beer_ml', category: 'Alcohol', unit: 'ml', avg_daily_usage: 17048.9, lead_time_days: 5, safety_stock_days: 14, reorder_point: 323929.18, target_stock_qty: 767200.68, shelf_life_days: 365, expiry_warn_days: 30, current_stock: 0, min_stock_threshold: 323929.18, max_stock_threshold: 767200.68, unit_cost: 5 },
        { name: 'Soju_ml', category: 'Alcohol', unit: 'ml', avg_daily_usage: 3708.49, lead_time_days: 5, safety_stock_days: 14, reorder_point: 70461.37, target_stock_qty: 166882.19, shelf_life_days: 365, expiry_warn_days: 30, current_stock: 0, min_stock_threshold: 70461.37, max_stock_threshold: 166882.19, unit_cost: 15 },
        { name: 'Spirits_ml', category: 'Alcohol', unit: 'ml', avg_daily_usage: 1273.77, lead_time_days: 5, safety_stock_days: 14, reorder_point: 24201.58, target_stock_qty: 57319.52, shelf_life_days: 365, expiry_warn_days: 30, current_stock: 0, min_stock_threshold: 24201.58, max_stock_threshold: 57319.52, unit_cost: 150 },
        { name: 'Wine_ml', category: 'Alcohol', unit: 'ml', avg_daily_usage: 1813.15, lead_time_days: 5, safety_stock_days: 14, reorder_point: 34449.86, target_stock_qty: 81591.78, shelf_life_days: 365, expiry_warn_days: 30, current_stock: 0, min_stock_threshold: 34449.86, max_stock_threshold: 81591.78, unit_cost: 100 },
        { name: 'Soda_ml', category: 'Beverage_NA', unit: 'ml', avg_daily_usage: 16025.75, lead_time_days: 3, safety_stock_days: 7, reorder_point: 160257.53, target_stock_qty: 480772.6, shelf_life_days: 90, expiry_warn_days: 14, current_stock: 0, min_stock_threshold: 160257.53, max_stock_threshold: 480772.6, unit_cost: 2 },
        { name: 'Butter_g', category: 'Dairy_Egg', unit: 'g', avg_daily_usage: 298.77, lead_time_days: 2, safety_stock_days: 2, reorder_point: 1195.07, target_stock_qty: 2987.67, shelf_life_days: 30, expiry_warn_days: 5, current_stock: 0, min_stock_threshold: 1195.07, max_stock_threshold: 2987.67, unit_cost: 10 },
        { name: 'Cream_ml', category: 'Dairy_Egg', unit: 'ml', avg_daily_usage: 1001.92, lead_time_days: 2, safety_stock_days: 2, reorder_point: 4007.67, target_stock_qty: 7013.42, shelf_life_days: 7, expiry_warn_days: 2, current_stock: 0, min_stock_threshold: 4007.67, max_stock_threshold: 7013.42, unit_cost: 8 },
        { name: 'Egg_count', category: 'Dairy_Egg', unit: 'count', avg_daily_usage: 19.71, lead_time_days: 2, safety_stock_days: 2, reorder_point: 78.85, target_stock_qty: 137.99, shelf_life_days: 14, expiry_warn_days: 5, current_stock: 0, min_stock_threshold: 78.85, max_stock_threshold: 137.99, unit_cost: 250 },
        { name: 'Milk_ml', category: 'Dairy_Egg', unit: 'ml', avg_daily_usage: 4035.62, lead_time_days: 2, safety_stock_days: 2, reorder_point: 16142.47, target_stock_qty: 28249.32, shelf_life_days: 5, expiry_warn_days: 2, current_stock: 0, min_stock_threshold: 16142.47, max_stock_threshold: 28249.32, unit_cost: 3 },
        { name: 'Mozzarella_g', category: 'Dairy_Egg', unit: 'g', avg_daily_usage: 4089.21, lead_time_days: 2, safety_stock_days: 2, reorder_point: 16356.82, target_stock_qty: 28624.44, shelf_life_days: 10, expiry_warn_days: 2, current_stock: 0, min_stock_threshold: 16356.82, max_stock_threshold: 28624.44, unit_cost: 12 },
        { name: 'Parmesan_g', category: 'Dairy_Egg', unit: 'g', avg_daily_usage: 62.19, lead_time_days: 2, safety_stock_days: 2, reorder_point: 248.77, target_stock_qty: 621.92, shelf_life_days: 30, expiry_warn_days: 5, current_stock: 0, min_stock_threshold: 248.77, max_stock_threshold: 621.92, unit_cost: 25 },
        { name: 'Anchovy_g', category: 'Dry_Pantry', unit: 'g', avg_daily_usage: 38.01, lead_time_days: 3, safety_stock_days: 7, reorder_point: 380.14, target_stock_qty: 1140.41, shelf_life_days: 180, expiry_warn_days: 14, current_stock: 0, min_stock_threshold: 380.14, max_stock_threshold: 1140.41, unit_cost: 80 },
        { name: 'Bread_g', category: 'Dry_Pantry', unit: 'g', avg_daily_usage: 716.3, lead_time_days: 3, safety_stock_days: 7, reorder_point: 7163.01, target_stock_qty: 2148.9, shelf_life_days: 2, expiry_warn_days: 3, current_stock: 0, min_stock_threshold: 7163.01, max_stock_threshold: 2148.9, unit_cost: 3 },
        { name: 'Chocolate_g', category: 'Dry_Pantry', unit: 'g', avg_daily_usage: 433.22, lead_time_days: 3, safety_stock_days: 7, reorder_point: 4332.19, target_stock_qty: 12996.58, shelf_life_days: 180, expiry_warn_days: 14, current_stock: 0, min_stock_threshold: 4332.19, max_stock_threshold: 12996.58, unit_cost: 15 },
        { name: 'Flour_g', category: 'Dry_Pantry', unit: 'g', avg_daily_usage: 7595.41, lead_time_days: 3, safety_stock_days: 7, reorder_point: 75954.11, target_stock_qty: 227862.33, shelf_life_days: 45, expiry_warn_days: 14, current_stock: 0, min_stock_threshold: 75954.11, max_stock_threshold: 227862.33, unit_cost: 2 },
        { name: 'Sugar_g', category: 'Dry_Pantry', unit: 'g', avg_daily_usage: 566.3, lead_time_days: 3, safety_stock_days: 7, reorder_point: 5663.01, target_stock_qty: 16989.04, shelf_life_days: 365, expiry_warn_days: 14, current_stock: 0, min_stock_threshold: 5663.01, max_stock_threshold: 16989.04, unit_cost: 2 },
        { name: 'CookingOil_g', category: 'Oil', unit: 'g', avg_daily_usage: 1199.79, lead_time_days: 3, safety_stock_days: 7, reorder_point: 11997.95, target_stock_qty: 35993.84, shelf_life_days: 120, expiry_warn_days: 14, current_stock: 0, min_stock_threshold: 11997.95, max_stock_threshold: 35993.84, unit_cost: 3 },
        { name: 'OliveOil_g', category: 'Oil', unit: 'g', avg_daily_usage: 377.41, lead_time_days: 3, safety_stock_days: 7, reorder_point: 3774.08, target_stock_qty: 11322.25, shelf_life_days: 120, expiry_warn_days: 14, current_stock: 0, min_stock_threshold: 3774.08, max_stock_threshold: 11322.25, unit_cost: 8 },
        { name: 'Pita_g', category: 'Other', unit: 'g', avg_daily_usage: 335.34, lead_time_days: 3, safety_stock_days: 3, reorder_point: 2012.05, target_stock_qty: 4694.79, shelf_life_days: 30, expiry_warn_days: 7, current_stock: 0, min_stock_threshold: 2012.05, max_stock_threshold: 4694.79, unit_cost: 4 },
        { name: 'Pork_g', category: 'Other', unit: 'g', avg_daily_usage: 1155.62, lead_time_days: 3, safety_stock_days: 3, reorder_point: 6933.7, target_stock_qty: 16178.63, shelf_life_days: 30, expiry_warn_days: 7, current_stock: 0, min_stock_threshold: 6933.7, max_stock_threshold: 16178.63, unit_cost: 18 },
        { name: 'Potato_g', category: 'Other', unit: 'g', avg_daily_usage: 6193.15, lead_time_days: 3, safety_stock_days: 3, reorder_point: 37158.9, target_stock_qty: 86704.11, shelf_life_days: 30, expiry_warn_days: 7, current_stock: 0, min_stock_threshold: 37158.9, max_stock_threshold: 86704.11, unit_cost: 1.5 },
        { name: 'Salmon_g', category: 'Other', unit: 'g', avg_daily_usage: 1023.29, lead_time_days: 3, safety_stock_days: 3, reorder_point: 6139.73, target_stock_qty: 14326.03, shelf_life_days: 30, expiry_warn_days: 7, current_stock: 0, min_stock_threshold: 6139.73, max_stock_threshold: 14326.03, unit_cost: 40 },
        { name: 'Garlic_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 109.5, lead_time_days: 1, safety_stock_days: 1, reorder_point: 218.99, target_stock_qty: 547.48, shelf_life_days: 5, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 218.99, max_stock_threshold: 547.48, unit_cost: 5 },
        { name: 'Lime_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 345.75, lead_time_days: 1, safety_stock_days: 1, reorder_point: 691.51, target_stock_qty: 1037.26, shelf_life_days: 4, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 691.51, max_stock_threshold: 1037.26, unit_cost: 3 },
        { name: 'Mint_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 21.37, lead_time_days: 1, safety_stock_days: 1, reorder_point: 42.74, target_stock_qty: 64.11, shelf_life_days: 4, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 42.74, max_stock_threshold: 64.11, unit_cost: 10 },
        { name: 'Mushroom_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 364.38, lead_time_days: 1, safety_stock_days: 1, reorder_point: 728.77, target_stock_qty: 1821.92, shelf_life_days: 5, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 728.77, max_stock_threshold: 1821.92, unit_cost: 8 },
        { name: 'Onion_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 477.77, lead_time_days: 1, safety_stock_days: 1, reorder_point: 955.53, target_stock_qty: 2388.84, shelf_life_days: 5, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 955.53, max_stock_threshold: 2388.84, unit_cost: 2 },
        { name: 'Pesto_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 240.48, lead_time_days: 1, safety_stock_days: 1, reorder_point: 480.96, target_stock_qty: 1202.4, shelf_life_days: 5, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 480.96, max_stock_threshold: 1202.4, unit_cost: 15 },
        { name: 'SauceOther_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 3023.67, lead_time_days: 1, safety_stock_days: 1, reorder_point: 6047.34, target_stock_qty: 15118.36, shelf_life_days: 7, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 6047.34, max_stock_threshold: 15118.36, unit_cost: 5 },
        { name: 'TomatoSauce_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 2618.14, lead_time_days: 1, safety_stock_days: 1, reorder_point: 5236.27, target_stock_qty: 7854.41, shelf_life_days: 4, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 5236.27, max_stock_threshold: 7854.41, unit_cost: 3 },
        { name: 'VegMix_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 3322.33, lead_time_days: 1, safety_stock_days: 1, reorder_point: 6644.66, target_stock_qty: 16611.64, shelf_life_days: 5, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 6644.66, max_stock_threshold: 16611.64, unit_cost: 4 },
        { name: 'WhiteSauce_g', category: 'Produce_Sauce', unit: 'g', avg_daily_usage: 398.9, lead_time_days: 1, safety_stock_days: 1, reorder_point: 797.81, target_stock_qty: 1196.71, shelf_life_days: 2, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 797.81, max_stock_threshold: 1196.71, unit_cost: 8 },
        { name: 'Beef_g', category: 'Protein_Fresh', unit: 'g', avg_daily_usage: 2385.34, lead_time_days: 1, safety_stock_days: 1, reorder_point: 4770.68, target_stock_qty: 11926.71, shelf_life_days: 4, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 4770.68, max_stock_threshold: 11926.71, unit_cost: 22 },
        { name: 'Chicken_g', category: 'Protein_Fresh', unit: 'g', avg_daily_usage: 6736.82, lead_time_days: 1, safety_stock_days: 1, reorder_point: 13473.64, target_stock_qty: 33684.11, shelf_life_days: 4, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 13473.64, max_stock_threshold: 33684.11, unit_cost: 15 },
        { name: 'Seafood_g', category: 'Protein_Fresh', unit: 'g', avg_daily_usage: 1468.82, lead_time_days: 1, safety_stock_days: 1, reorder_point: 2937.64, target_stock_qty: 4406.47, shelf_life_days: 2, expiry_warn_days: 1, current_stock: 0, min_stock_threshold: 2937.64, max_stock_threshold: 4406.47, unit_cost: 30 },
      ];

      // Insert ingredients
      const { data: insertedIngredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .insert(ingredientsData)
        .select();

      if (ingredientsError) throw ingredientsError;

      setIngredientsResults({
        success: true,
        ingredients: insertedIngredients?.length || 0,
        message: `Successfully imported ${insertedIngredients?.length} ingredients!`
      });

    } catch (error: any) {
      setIngredientsResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingIngredients(false);
    }
  };

  const importRecipesData = async () => {
    setImportingRecipes(true);
    setRecipesResults(null);
    
    try {

      // Recipe data from CSV (219 rows)
      const recipeData = [
        { item_id: 'F-001', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-001', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-001', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-001', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-001', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-001', ingredient: 'SauceOther_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-002', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-002', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-002', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-002', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-002', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-002', ingredient: 'VegMix_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-002', ingredient: 'Pesto_g', quantity_needed: 15, unit: 'g' },
        { item_id: 'F-002', ingredient: 'Onion_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-003', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-003', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-003', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-003', ingredient: 'WhiteSauce_g', quantity_needed: 80, unit: 'g' },
        { item_id: 'F-003', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-003', ingredient: 'Mushroom_g', quantity_needed: 140, unit: 'g' },
        { item_id: 'F-003', ingredient: 'VegMix_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-004', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-004', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-004', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-004', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-004', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-004', ingredient: 'Chicken_g', quantity_needed: 110, unit: 'g' },
        { item_id: 'F-004', ingredient: 'Pesto_g', quantity_needed: 15, unit: 'g' },
        { item_id: 'F-004', ingredient: 'VegMix_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-004', ingredient: 'Onion_g', quantity_needed: 15, unit: 'g' },
        { item_id: 'F-005', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-005', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-005', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-005', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-005', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-005', ingredient: 'Pork_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-005', ingredient: 'Parmesan_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-005', ingredient: 'VegMix_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-006', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-006', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-006', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-006', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-006', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-006', ingredient: 'Anchovy_g', quantity_needed: 25, unit: 'g' },
        { item_id: 'F-006', ingredient: 'SauceOther_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-007', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-007', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-007', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-007', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-007', ingredient: 'Garlic_g', quantity_needed: 4, unit: 'g' },
        { item_id: 'F-007', ingredient: 'Seafood_g', quantity_needed: 140, unit: 'g' },
        { item_id: 'F-007', ingredient: 'Pesto_g', quantity_needed: 15, unit: 'g' },
        { item_id: 'F-008', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-008', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-008', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-008', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-008', ingredient: 'Garlic_g', quantity_needed: 4, unit: 'g' },
        { item_id: 'F-008', ingredient: 'Salmon_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-008', ingredient: 'Seafood_g', quantity_needed: 70, unit: 'g' },
        { item_id: 'F-008', ingredient: 'Pesto_g', quantity_needed: 15, unit: 'g' },
        { item_id: 'F-008', ingredient: 'Onion_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-009', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-009', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-009', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-009', ingredient: 'TomatoSauce_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-009', ingredient: 'Garlic_g', quantity_needed: 3, unit: 'g' },
        { item_id: 'F-009', ingredient: 'Beef_g', quantity_needed: 110, unit: 'g' },
        { item_id: 'F-009', ingredient: 'VegMix_g', quantity_needed: 60, unit: 'g' },
        { item_id: 'F-009', ingredient: 'Onion_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-010', ingredient: 'Flour_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-010', ingredient: 'OliveOil_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-010', ingredient: 'Mozzarella_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-010', ingredient: 'WhiteSauce_g', quantity_needed: 80, unit: 'g' },
        { item_id: 'F-010', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-010', ingredient: 'Beef_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-010', ingredient: 'VegMix_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-011', ingredient: 'Flour_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-011', ingredient: 'OliveOil_g', quantity_needed: 4.8, unit: 'g' },
        { item_id: 'F-011', ingredient: 'Mozzarella_g', quantity_needed: 72, unit: 'g' },
        { item_id: 'F-011', ingredient: 'TomatoSauce_g', quantity_needed: 54, unit: 'g' },
        { item_id: 'F-011', ingredient: 'Garlic_g', quantity_needed: 3.6, unit: 'g' },
        { item_id: 'F-011', ingredient: 'Onion_g', quantity_needed: 27, unit: 'g' },
        { item_id: 'F-011', ingredient: 'VegMix_g', quantity_needed: 12, unit: 'g' },
        { item_id: 'F-012', ingredient: 'Flour_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-012', ingredient: 'OliveOil_g', quantity_needed: 4.8, unit: 'g' },
        { item_id: 'F-012', ingredient: 'Mozzarella_g', quantity_needed: 72, unit: 'g' },
        { item_id: 'F-012', ingredient: 'TomatoSauce_g', quantity_needed: 54, unit: 'g' },
        { item_id: 'F-012', ingredient: 'Garlic_g', quantity_needed: 1.2, unit: 'g' },
        { item_id: 'F-012', ingredient: 'VegMix_g', quantity_needed: 72, unit: 'g' },
        { item_id: 'F-012', ingredient: 'Pesto_g', quantity_needed: 9, unit: 'g' },
        { item_id: 'F-012', ingredient: 'Onion_g', quantity_needed: 12, unit: 'g' },
        { item_id: 'F-013', ingredient: 'Flour_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-013', ingredient: 'OliveOil_g', quantity_needed: 4.8, unit: 'g' },
        { item_id: 'F-013', ingredient: 'Mozzarella_g', quantity_needed: 72, unit: 'g' },
        { item_id: 'F-013', ingredient: 'TomatoSauce_g', quantity_needed: 54, unit: 'g' },
        { item_id: 'F-013', ingredient: 'Garlic_g', quantity_needed: 1.2, unit: 'g' },
        { item_id: 'F-013', ingredient: 'Chicken_g', quantity_needed: 66, unit: 'g' },
        { item_id: 'F-013', ingredient: 'VegMix_g', quantity_needed: 36, unit: 'g' },
        { item_id: 'F-013', ingredient: 'Onion_g', quantity_needed: 6, unit: 'g' },
        { item_id: 'F-014', ingredient: 'Flour_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-014', ingredient: 'OliveOil_g', quantity_needed: 4.8, unit: 'g' },
        { item_id: 'F-014', ingredient: 'Mozzarella_g', quantity_needed: 72, unit: 'g' },
        { item_id: 'F-014', ingredient: 'TomatoSauce_g', quantity_needed: 54, unit: 'g' },
        { item_id: 'F-014', ingredient: 'Garlic_g', quantity_needed: 3, unit: 'g' },
        { item_id: 'F-014', ingredient: 'Beef_g', quantity_needed: 60, unit: 'g' },
        { item_id: 'F-014', ingredient: 'Onion_g', quantity_needed: 12, unit: 'g' },
        { item_id: 'F-014', ingredient: 'SauceOther_g', quantity_needed: 6, unit: 'g' },
        { item_id: 'F-015', ingredient: 'Flour_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-015', ingredient: 'OliveOil_g', quantity_needed: 4.8, unit: 'g' },
        { item_id: 'F-015', ingredient: 'Mozzarella_g', quantity_needed: 72, unit: 'g' },
        { item_id: 'F-015', ingredient: 'TomatoSauce_g', quantity_needed: 54, unit: 'g' },
        { item_id: 'F-015', ingredient: 'Garlic_g', quantity_needed: 3.6, unit: 'g' },
        { item_id: 'F-015', ingredient: 'Seafood_g', quantity_needed: 84, unit: 'g' },
        { item_id: 'F-015', ingredient: 'Pesto_g', quantity_needed: 9, unit: 'g' },
        { item_id: 'F-016', ingredient: 'Bread_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-016', ingredient: 'OliveOil_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-016', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-016', ingredient: 'Onion_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-016', ingredient: 'VegMix_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-016', ingredient: 'Pesto_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-016', ingredient: 'SauceOther_g', quantity_needed: 30, unit: 'g' },
        { item_id: 'F-017', ingredient: 'Bread_g', quantity_needed: 90, unit: 'g' },
        { item_id: 'F-017', ingredient: 'OliveOil_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-017', ingredient: 'Garlic_g', quantity_needed: 2, unit: 'g' },
        { item_id: 'F-017', ingredient: 'Onion_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-017', ingredient: 'VegMix_g', quantity_needed: 60, unit: 'g' },
        { item_id: 'F-017', ingredient: 'SauceOther_g', quantity_needed: 5, unit: 'g' },
        { item_id: 'F-018', ingredient: 'VegMix_g', quantity_needed: 150, unit: 'g' },
        { item_id: 'F-018', ingredient: 'SauceOther_g', quantity_needed: 8, unit: 'g' },
        { item_id: 'F-019', ingredient: 'Potato_g', quantity_needed: 250, unit: 'g' },
        { item_id: 'F-019', ingredient: 'CookingOil_g', quantity_needed: 25, unit: 'g' },
        { item_id: 'F-019', ingredient: 'SauceOther_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-020', ingredient: 'Chicken_g', quantity_needed: 180, unit: 'g' },
        { item_id: 'F-020', ingredient: 'Flour_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-020', ingredient: 'CookingOil_g', quantity_needed: 25, unit: 'g' },
        { item_id: 'F-020', ingredient: 'SauceOther_g', quantity_needed: 15, unit: 'g' },
        { item_id: 'F-021', ingredient: 'Chicken_g', quantity_needed: 300, unit: 'g' },
        { item_id: 'F-021', ingredient: 'CookingOil_g', quantity_needed: 25, unit: 'g' },
        { item_id: 'F-021', ingredient: 'SauceOther_g', quantity_needed: 30, unit: 'g' },
        { item_id: 'F-022', ingredient: 'Beef_g', quantity_needed: 80, unit: 'g' },
        { item_id: 'F-022', ingredient: 'SauceOther_g', quantity_needed: 5, unit: 'g' },
        { item_id: 'F-023', ingredient: 'Pork_g', quantity_needed: 140, unit: 'g' },
        { item_id: 'F-023', ingredient: 'SauceOther_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-024', ingredient: 'Chicken_g', quantity_needed: 150, unit: 'g' },
        { item_id: 'F-024', ingredient: 'Pita_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-024', ingredient: 'SauceOther_g', quantity_needed: 180, unit: 'g' },
        { item_id: 'F-024', ingredient: 'VegMix_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-025', ingredient: 'Beef_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-025', ingredient: 'Butter_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-025', ingredient: 'SauceOther_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-026', ingredient: 'Salmon_g', quantity_needed: 180, unit: 'g' },
        { item_id: 'F-026', ingredient: 'OliveOil_g', quantity_needed: 5, unit: 'g' },
        { item_id: 'F-026', ingredient: 'SauceOther_g', quantity_needed: 5, unit: 'g' },
        { item_id: 'F-027', ingredient: 'Seafood_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-027', ingredient: 'Flour_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-027', ingredient: 'CookingOil_g', quantity_needed: 35, unit: 'g' },
        { item_id: 'F-027', ingredient: 'Potato_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-027', ingredient: 'SauceOther_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-028', ingredient: 'Chicken_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-028', ingredient: 'Flour_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-028', ingredient: 'Egg_count', quantity_needed: 1, unit: 'count' },
        { item_id: 'F-028', ingredient: 'SauceOther_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-028', ingredient: 'CookingOil_g', quantity_needed: 35, unit: 'g' },
        { item_id: 'F-028', ingredient: 'Potato_g', quantity_needed: 200, unit: 'g' },
        { item_id: 'F-028', ingredient: 'VegMix_g', quantity_needed: 60, unit: 'g' },
        { item_id: 'F-028', ingredient: 'Cream_ml', quantity_needed: 60, unit: 'ml' },
        { item_id: 'F-029', ingredient: 'Beef_g', quantity_needed: 180, unit: 'g' },
        { item_id: 'F-029', ingredient: 'Wine_ml', quantity_needed: 60, unit: 'ml' },
        { item_id: 'F-029', ingredient: 'Potato_g', quantity_needed: 250, unit: 'g' },
        { item_id: 'F-029', ingredient: 'Butter_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'F-029', ingredient: 'SauceOther_g', quantity_needed: 120, unit: 'g' },
        { item_id: 'F-030', ingredient: 'Chicken_g', quantity_needed: 250, unit: 'g' },
        { item_id: 'F-030', ingredient: 'Potato_g', quantity_needed: 250, unit: 'g' },
        { item_id: 'F-030', ingredient: 'Flour_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-030', ingredient: 'CookingOil_g', quantity_needed: 60, unit: 'g' },
        { item_id: 'F-030', ingredient: 'VegMix_g', quantity_needed: 100, unit: 'g' },
        { item_id: 'F-030', ingredient: 'SauceOther_g', quantity_needed: 80, unit: 'g' },
        { item_id: 'F-031', ingredient: 'Flour_g', quantity_needed: 25, unit: 'g' },
        { item_id: 'F-031', ingredient: 'Sugar_g', quantity_needed: 40, unit: 'g' },
        { item_id: 'F-031', ingredient: 'Butter_g', quantity_needed: 30, unit: 'g' },
        { item_id: 'F-031', ingredient: 'Egg_count', quantity_needed: 1, unit: 'count' },
        { item_id: 'F-031', ingredient: 'Chocolate_g', quantity_needed: 15, unit: 'g' },
        { item_id: 'F-031', ingredient: 'Milk_ml', quantity_needed: 60, unit: 'ml' },
        { item_id: 'F-032', ingredient: 'Cream_ml', quantity_needed: 120, unit: 'ml' },
        { item_id: 'F-032', ingredient: 'Chocolate_g', quantity_needed: 50, unit: 'g' },
        { item_id: 'F-032', ingredient: 'Sugar_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'F-032', ingredient: 'Egg_count', quantity_needed: 1, unit: 'count' },
        { item_id: 'D-001', ingredient: 'Milk_ml', quantity_needed: 300, unit: 'ml' },
        { item_id: 'D-002', ingredient: 'Soda_ml', quantity_needed: 330, unit: 'ml' },
        { item_id: 'D-003', ingredient: 'Beer_ml', quantity_needed: 500, unit: 'ml' },
        { item_id: 'D-004', ingredient: 'Beer_ml', quantity_needed: 500, unit: 'ml' },
        { item_id: 'D-005', ingredient: 'Beer_ml', quantity_needed: 330, unit: 'ml' },
        { item_id: 'D-006', ingredient: 'Beer_ml', quantity_needed: 330, unit: 'ml' },
        { item_id: 'D-007', ingredient: 'Beer_ml', quantity_needed: 330, unit: 'ml' },
        { item_id: 'D-008', ingredient: 'Soju_ml', quantity_needed: 360, unit: 'ml' },
        { item_id: 'D-010', ingredient: 'Wine_ml', quantity_needed: 750, unit: 'ml' },
        { item_id: 'D-011', ingredient: 'Spirits_ml', quantity_needed: 30, unit: 'ml' },
        { item_id: 'D-012', ingredient: 'Spirits_ml', quantity_needed: 45, unit: 'ml' },
        { item_id: 'D-013', ingredient: 'Spirits_ml', quantity_needed: 45, unit: 'ml' },
        { item_id: 'D-014', ingredient: 'Spirits_ml', quantity_needed: 45, unit: 'ml' },
        { item_id: 'D-015', ingredient: 'Spirits_ml', quantity_needed: 45, unit: 'ml' },
        { item_id: 'D-015', ingredient: 'Soda_ml', quantity_needed: 150, unit: 'ml' },
        { item_id: 'D-015', ingredient: 'Lime_g', quantity_needed: 20, unit: 'g' },
        { item_id: 'D-016', ingredient: 'Spirits_ml', quantity_needed: 45, unit: 'ml' },
        { item_id: 'D-016', ingredient: 'Sugar_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'D-016', ingredient: 'Lime_g', quantity_needed: 25, unit: 'g' },
        { item_id: 'D-016', ingredient: 'Egg_count', quantity_needed: 1, unit: 'count' },
        { item_id: 'D-017', ingredient: 'Spirits_ml', quantity_needed: 45, unit: 'ml' },
        { item_id: 'D-017', ingredient: 'Soda_ml', quantity_needed: 120, unit: 'ml' },
        { item_id: 'D-017', ingredient: 'Sugar_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'D-017', ingredient: 'Lime_g', quantity_needed: 25, unit: 'g' },
        { item_id: 'D-017', ingredient: 'Mint_g', quantity_needed: 5, unit: 'g' },
        { item_id: 'D-018', ingredient: 'Spirits_ml', quantity_needed: 75, unit: 'ml' },
        { item_id: 'D-018', ingredient: 'Soda_ml', quantity_needed: 120, unit: 'ml' },
        { item_id: 'D-018', ingredient: 'Sugar_g', quantity_needed: 10, unit: 'g' },
        { item_id: 'D-018', ingredient: 'Lime_g', quantity_needed: 20, unit: 'g' },
      ];

      // Insert recipe ingredients directly (schema uses TEXT fields, not UUIDs)
      const { data: insertedRecipes, error: recipesError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeData)
        .select();

      if (recipesError) throw recipesError;

      setRecipesResults({
        success: true,
        recipes: insertedRecipes?.length || 0,
        message: `Successfully imported ${insertedRecipes?.length} recipe ingredients!`
      });

    } catch (error: any) {
      setRecipesResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingRecipes(false);
    }
  };

  const importDailySalesData = async () => {
    setImportingSales(true);
    setSalesResults(null);
    
    try {
      const salesData = [
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-010', quantity_sold: 4, sales_amount: 340000, cogs_amount: 187000, gross_profit: 153000 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-010', quantity_sold: 2, sales_amount: 170000, cogs_amount: 93500, gross_profit: 76500 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-010', quantity_sold: 2, sales_amount: 170000, cogs_amount: 93500, gross_profit: 76500 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-010', quantity_sold: 1, sales_amount: 85000, cogs_amount: 46750, gross_profit: 38250 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-010', quantity_sold: 2, sales_amount: 170000, cogs_amount: 93500, gross_profit: 76500 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-010', quantity_sold: 1, sales_amount: 85000, cogs_amount: 46750, gross_profit: 38250 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-010', quantity_sold: 2, sales_amount: 170000, cogs_amount: 93500, gross_profit: 76500 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-002', quantity_sold: 53, sales_amount: 132500, cogs_amount: 59625, gross_profit: 72875 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-002', quantity_sold: 52, sales_amount: 130000, cogs_amount: 58500, gross_profit: 71500 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-002', quantity_sold: 32, sales_amount: 80000, cogs_amount: 36000, gross_profit: 44000 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-002', quantity_sold: 31, sales_amount: 77500, cogs_amount: 34875, gross_profit: 42625 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-002', quantity_sold: 42, sales_amount: 105000, cogs_amount: 47250, gross_profit: 57750 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-002', quantity_sold: 55, sales_amount: 137500, cogs_amount: 61875, gross_profit: 75625 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-002', quantity_sold: 48, sales_amount: 120000, cogs_amount: 54000, gross_profit: 66000 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-008', quantity_sold: 8, sales_amount: 80000, cogs_amount: 44000, gross_profit: 36000 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-008', quantity_sold: 6, sales_amount: 60000, cogs_amount: 33000, gross_profit: 27000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-008', quantity_sold: 7, sales_amount: 70000, cogs_amount: 38500, gross_profit: 31500 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-008', quantity_sold: 11, sales_amount: 110000, cogs_amount: 60500, gross_profit: 49500 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-008', quantity_sold: 7, sales_amount: 70000, cogs_amount: 38500, gross_profit: 31500 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-008', quantity_sold: 15, sales_amount: 150000, cogs_amount: 82500, gross_profit: 67500 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-008', quantity_sold: 15, sales_amount: 150000, cogs_amount: 82500, gross_profit: 67500 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-029', quantity_sold: 2, sales_amount: 36000, cogs_amount: 19600, gross_profit: 16400 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-029', quantity_sold: 11, sales_amount: 198000, cogs_amount: 107800, gross_profit: 90200 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-029', quantity_sold: 4, sales_amount: 72000, cogs_amount: 39200, gross_profit: 32800 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-029', quantity_sold: 2, sales_amount: 36000, cogs_amount: 19600, gross_profit: 16400 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-029', quantity_sold: 6, sales_amount: 108000, cogs_amount: 58800, gross_profit: 49200 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-029', quantity_sold: 3, sales_amount: 54000, cogs_amount: 29400, gross_profit: 24600 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-029', quantity_sold: 4, sales_amount: 72000, cogs_amount: 39200, gross_profit: 32800 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-026', quantity_sold: 6, sales_amount: 84000, cogs_amount: 52500, gross_profit: 31500 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-026', quantity_sold: 4, sales_amount: 56000, cogs_amount: 35000, gross_profit: 21000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-026', quantity_sold: 4, sales_amount: 56000, cogs_amount: 35000, gross_profit: 21000 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-026', quantity_sold: 5, sales_amount: 70000, cogs_amount: 43750, gross_profit: 26250 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-026', quantity_sold: 5, sales_amount: 70000, cogs_amount: 43750, gross_profit: 26250 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-026', quantity_sold: 12, sales_amount: 168000, cogs_amount: 105000, gross_profit: 63000 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-026', quantity_sold: 1, sales_amount: 14000, cogs_amount: 8750, gross_profit: 5250 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-005', quantity_sold: 4, sales_amount: 88000, cogs_amount: 35200, gross_profit: 52800 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-005', quantity_sold: 5, sales_amount: 110000, cogs_amount: 44000, gross_profit: 66000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-005', quantity_sold: 4, sales_amount: 88000, cogs_amount: 35200, gross_profit: 52800 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-005', quantity_sold: 1, sales_amount: 22000, cogs_amount: 8800, gross_profit: 13200 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-005', quantity_sold: 7, sales_amount: 154000, cogs_amount: 61600, gross_profit: 92400 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-005', quantity_sold: 2, sales_amount: 44000, cogs_amount: 17600, gross_profit: 26400 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-005', quantity_sold: 1, sales_amount: 22000, cogs_amount: 8800, gross_profit: 13200 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-018', quantity_sold: 7, sales_amount: 59500, cogs_amount: 70000, gross_profit: -10500 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-018', quantity_sold: 6, sales_amount: 51000, cogs_amount: 60000, gross_profit: -9000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-018', quantity_sold: 5, sales_amount: 42500, cogs_amount: 50000, gross_profit: -7500 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-018', quantity_sold: 9, sales_amount: 76500, cogs_amount: 90000, gross_profit: -13500 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-018', quantity_sold: 9, sales_amount: 76500, cogs_amount: 90000, gross_profit: -13500 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-018', quantity_sold: 12, sales_amount: 102000, cogs_amount: 120000, gross_profit: -18000 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-018', quantity_sold: 6, sales_amount: 51000, cogs_amount: 60000, gross_profit: -9000 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-003', quantity_sold: 8, sales_amount: 44000, cogs_amount: 15400, gross_profit: 28600 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-003', quantity_sold: 12, sales_amount: 66000, cogs_amount: 23100, gross_profit: 42900 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-003', quantity_sold: 5, sales_amount: 27500, cogs_amount: 9625, gross_profit: 17875 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-003', quantity_sold: 14, sales_amount: 77000, cogs_amount: 26950, gross_profit: 50050 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-003', quantity_sold: 10, sales_amount: 55000, cogs_amount: 19250, gross_profit: 35750 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-003', quantity_sold: 7, sales_amount: 38500, cogs_amount: 13475, gross_profit: 25025 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-003', quantity_sold: 20, sales_amount: 110000, cogs_amount: 38500, gross_profit: 71500 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-004', quantity_sold: 3, sales_amount: 54000, cogs_amount: 18900, gross_profit: 35100 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-004', quantity_sold: 3, sales_amount: 54000, cogs_amount: 18900, gross_profit: 35100 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-004', quantity_sold: 4, sales_amount: 72000, cogs_amount: 25200, gross_profit: 46800 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-004', quantity_sold: 4, sales_amount: 72000, cogs_amount: 25200, gross_profit: 46800 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-004', quantity_sold: 3, sales_amount: 54000, cogs_amount: 18900, gross_profit: 35100 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-004', quantity_sold: 3, sales_amount: 54000, cogs_amount: 18900, gross_profit: 35100 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-004', quantity_sold: 3, sales_amount: 54000, cogs_amount: 18900, gross_profit: 35100 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-028', quantity_sold: 2, sales_amount: 30000, cogs_amount: 11400, gross_profit: 18600 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-028', quantity_sold: 5, sales_amount: 75000, cogs_amount: 28500, gross_profit: 46500 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-028', quantity_sold: 4, sales_amount: 60000, cogs_amount: 22800, gross_profit: 37200 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-028', quantity_sold: 4, sales_amount: 60000, cogs_amount: 22800, gross_profit: 37200 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-028', quantity_sold: 4, sales_amount: 60000, cogs_amount: 22800, gross_profit: 37200 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-028', quantity_sold: 8, sales_amount: 120000, cogs_amount: 45600, gross_profit: 74400 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-028', quantity_sold: 2, sales_amount: 30000, cogs_amount: 11400, gross_profit: 18600 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-027', quantity_sold: 4, sales_amount: 56000, cogs_amount: 21280, gross_profit: 34720 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-027', quantity_sold: 4, sales_amount: 56000, cogs_amount: 21280, gross_profit: 34720 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-027', quantity_sold: 6, sales_amount: 84000, cogs_amount: 31920, gross_profit: 52080 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-027', quantity_sold: 5, sales_amount: 70000, cogs_amount: 26600, gross_profit: 43400 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-027', quantity_sold: 5, sales_amount: 70000, cogs_amount: 26600, gross_profit: 43400 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-027', quantity_sold: 4, sales_amount: 56000, cogs_amount: 21280, gross_profit: 34720 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-027', quantity_sold: 5, sales_amount: 70000, cogs_amount: 26600, gross_profit: 43400 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-001', quantity_sold: 3, sales_amount: 36000, cogs_amount: 12600, gross_profit: 23400 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-001', quantity_sold: 6, sales_amount: 72000, cogs_amount: 25200, gross_profit: 46800 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-001', quantity_sold: 4, sales_amount: 48000, cogs_amount: 16800, gross_profit: 31200 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-001', quantity_sold: 5, sales_amount: 60000, cogs_amount: 21000, gross_profit: 39000 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-001', quantity_sold: 6, sales_amount: 72000, cogs_amount: 25200, gross_profit: 46800 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-001', quantity_sold: 2, sales_amount: 24000, cogs_amount: 8400, gross_profit: 15600 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-001', quantity_sold: 6, sales_amount: 72000, cogs_amount: 25200, gross_profit: 46800 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-030', quantity_sold: 4, sales_amount: 44000, cogs_amount: 16720, gross_profit: 27280 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-030', quantity_sold: 6, sales_amount: 66000, cogs_amount: 25080, gross_profit: 40920 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-030', quantity_sold: 3, sales_amount: 33000, cogs_amount: 12540, gross_profit: 20460 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-030', quantity_sold: 5, sales_amount: 55000, cogs_amount: 20900, gross_profit: 34100 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-030', quantity_sold: 3, sales_amount: 33000, cogs_amount: 12540, gross_profit: 20460 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-030', quantity_sold: 5, sales_amount: 55000, cogs_amount: 20900, gross_profit: 34100 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-030', quantity_sold: 5, sales_amount: 55000, cogs_amount: 20900, gross_profit: 34100 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-010', quantity_sold: 4, sales_amount: 88000, cogs_amount: 35200, gross_profit: 52800 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-010', quantity_sold: 4, sales_amount: 88000, cogs_amount: 35200, gross_profit: 52800 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-010', quantity_sold: 1, sales_amount: 22000, cogs_amount: 8800, gross_profit: 13200 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-010', quantity_sold: 1, sales_amount: 22000, cogs_amount: 8800, gross_profit: 13200 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-010', quantity_sold: 5, sales_amount: 110000, cogs_amount: 44000, gross_profit: 66000 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-010', quantity_sold: 2, sales_amount: 44000, cogs_amount: 17600, gross_profit: 26400 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-010', quantity_sold: 5, sales_amount: 110000, cogs_amount: 44000, gross_profit: 66000 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-007', quantity_sold: 4, sales_amount: 80000, cogs_amount: 35200, gross_profit: 44800 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-007', quantity_sold: 2, sales_amount: 40000, cogs_amount: 17600, gross_profit: 22400 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-007', quantity_sold: 2, sales_amount: 40000, cogs_amount: 17600, gross_profit: 22400 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-007', quantity_sold: 3, sales_amount: 60000, cogs_amount: 26400, gross_profit: 33600 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-007', quantity_sold: 2, sales_amount: 40000, cogs_amount: 17600, gross_profit: 22400 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-007', quantity_sold: 3, sales_amount: 60000, cogs_amount: 26400, gross_profit: 33600 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-007', quantity_sold: 1, sales_amount: 20000, cogs_amount: 8800, gross_profit: 11200 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-004', quantity_sold: 13, sales_amount: 65000, cogs_amount: 22750, gross_profit: 42250 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-004', quantity_sold: 8, sales_amount: 40000, cogs_amount: 14000, gross_profit: 26000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-004', quantity_sold: 10, sales_amount: 50000, cogs_amount: 17500, gross_profit: 32500 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-004', quantity_sold: 9, sales_amount: 45000, cogs_amount: 15750, gross_profit: 29250 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-004', quantity_sold: 11, sales_amount: 55000, cogs_amount: 19250, gross_profit: 35750 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-004', quantity_sold: 12, sales_amount: 60000, cogs_amount: 21000, gross_profit: 39000 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-004', quantity_sold: 5, sales_amount: 25000, cogs_amount: 8750, gross_profit: 16250 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-021', quantity_sold: 4, sales_amount: 26000, cogs_amount: 8320, gross_profit: 17680 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-021', quantity_sold: 10, sales_amount: 65000, cogs_amount: 20800, gross_profit: 44200 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-021', quantity_sold: 11, sales_amount: 71500, cogs_amount: 22880, gross_profit: 48620 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-021', quantity_sold: 16, sales_amount: 104000, cogs_amount: 33280, gross_profit: 70720 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-021', quantity_sold: 9, sales_amount: 58500, cogs_amount: 18720, gross_profit: 39780 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-021', quantity_sold: 15, sales_amount: 97500, cogs_amount: 31200, gross_profit: 66300 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-021', quantity_sold: 5, sales_amount: 32500, cogs_amount: 10400, gross_profit: 22100 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-031', quantity_sold: 10, sales_amount: 65000, cogs_amount: 16250, gross_profit: 48750 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-031', quantity_sold: 9, sales_amount: 58500, cogs_amount: 14625, gross_profit: 43875 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-031', quantity_sold: 8, sales_amount: 52000, cogs_amount: 13000, gross_profit: 39000 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-031', quantity_sold: 8, sales_amount: 52000, cogs_amount: 13000, gross_profit: 39000 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-031', quantity_sold: 6, sales_amount: 39000, cogs_amount: 9750, gross_profit: 29250 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-031', quantity_sold: 9, sales_amount: 58500, cogs_amount: 14625, gross_profit: 43875 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-031', quantity_sold: 4, sales_amount: 26000, cogs_amount: 6500, gross_profit: 19500 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-009', quantity_sold: 2, sales_amount: 40000, cogs_amount: 18400, gross_profit: 21600 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-009', quantity_sold: 0, sales_amount: 0, cogs_amount: 0, gross_profit: 0 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-009', quantity_sold: 3, sales_amount: 60000, cogs_amount: 27600, gross_profit: 32400 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-009', quantity_sold: 1, sales_amount: 20000, cogs_amount: 9200, gross_profit: 10800 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-009', quantity_sold: 4, sales_amount: 80000, cogs_amount: 36800, gross_profit: 43200 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-009', quantity_sold: 0, sales_amount: 0, cogs_amount: 0, gross_profit: 0 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-009', quantity_sold: 1, sales_amount: 20000, cogs_amount: 9200, gross_profit: 10800 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-002', quantity_sold: 5, sales_amount: 70000, cogs_amount: 24500, gross_profit: 45500 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-002', quantity_sold: 6, sales_amount: 84000, cogs_amount: 29400, gross_profit: 54600 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-002', quantity_sold: 4, sales_amount: 56000, cogs_amount: 19600, gross_profit: 36400 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-002', quantity_sold: 5, sales_amount: 70000, cogs_amount: 24500, gross_profit: 45500 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-002', quantity_sold: 4, sales_amount: 56000, cogs_amount: 19600, gross_profit: 36400 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-002', quantity_sold: 4, sales_amount: 56000, cogs_amount: 19600, gross_profit: 36400 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-002', quantity_sold: 2, sales_amount: 28000, cogs_amount: 9800, gross_profit: 18200 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-023', quantity_sold: 2, sales_amount: 15600, cogs_amount: 4992, gross_profit: 10608 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-023', quantity_sold: 4, sales_amount: 31200, cogs_amount: 9984, gross_profit: 21216 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-023', quantity_sold: 5, sales_amount: 39000, cogs_amount: 12480, gross_profit: 26520 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-023', quantity_sold: 5, sales_amount: 39000, cogs_amount: 12480, gross_profit: 26520 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-023', quantity_sold: 7, sales_amount: 54600, cogs_amount: 17472, gross_profit: 37128 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-023', quantity_sold: 4, sales_amount: 31200, cogs_amount: 9984, gross_profit: 21216 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-023', quantity_sold: 5, sales_amount: 39000, cogs_amount: 12480, gross_profit: 26520 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-003', quantity_sold: 3, sales_amount: 48000, cogs_amount: 16800, gross_profit: 31200 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-003', quantity_sold: 1, sales_amount: 16000, cogs_amount: 5600, gross_profit: 10400 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-003', quantity_sold: 4, sales_amount: 64000, cogs_amount: 22400, gross_profit: 41600 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-003', quantity_sold: 1, sales_amount: 16000, cogs_amount: 5600, gross_profit: 10400 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-003', quantity_sold: 2, sales_amount: 32000, cogs_amount: 11200, gross_profit: 20800 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-003', quantity_sold: 8, sales_amount: 128000, cogs_amount: 44800, gross_profit: 83200 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-003', quantity_sold: 3, sales_amount: 48000, cogs_amount: 16800, gross_profit: 31200 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-025', quantity_sold: 6, sales_amount: 72000, cogs_amount: 45000, gross_profit: 27000 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-025', quantity_sold: 2, sales_amount: 24000, cogs_amount: 15000, gross_profit: 9000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-025', quantity_sold: 7, sales_amount: 84000, cogs_amount: 52500, gross_profit: 31500 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-025', quantity_sold: 5, sales_amount: 60000, cogs_amount: 37500, gross_profit: 22500 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-025', quantity_sold: 2, sales_amount: 24000, cogs_amount: 15000, gross_profit: 9000 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-025', quantity_sold: 1, sales_amount: 12000, cogs_amount: 7500, gross_profit: 4500 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-025', quantity_sold: 1, sales_amount: 12000, cogs_amount: 7500, gross_profit: 4500 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-032', quantity_sold: 4, sales_amount: 24000, cogs_amount: 6000, gross_profit: 18000 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-032', quantity_sold: 8, sales_amount: 48000, cogs_amount: 12000, gross_profit: 36000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-032', quantity_sold: 10, sales_amount: 60000, cogs_amount: 15000, gross_profit: 45000 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-032', quantity_sold: 14, sales_amount: 84000, cogs_amount: 21000, gross_profit: 63000 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-032', quantity_sold: 5, sales_amount: 30000, cogs_amount: 7500, gross_profit: 22500 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-032', quantity_sold: 7, sales_amount: 42000, cogs_amount: 10500, gross_profit: 31500 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-032', quantity_sold: 13, sales_amount: 78000, cogs_amount: 19500, gross_profit: 58500 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-020', quantity_sold: 7, sales_amount: 33600, cogs_amount: 10752, gross_profit: 22848 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-020', quantity_sold: 5, sales_amount: 24000, cogs_amount: 7680, gross_profit: 16320 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-020', quantity_sold: 3, sales_amount: 14400, cogs_amount: 4608, gross_profit: 9792 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-020', quantity_sold: 7, sales_amount: 33600, cogs_amount: 10752, gross_profit: 22848 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-020', quantity_sold: 8, sales_amount: 38400, cogs_amount: 12288, gross_profit: 26112 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-020', quantity_sold: 10, sales_amount: 48000, cogs_amount: 15360, gross_profit: 32640 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-020', quantity_sold: 9, sales_amount: 43200, cogs_amount: 13824, gross_profit: 29376 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-006', quantity_sold: 1, sales_amount: 24000, cogs_amount: 11040, gross_profit: 12960 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-006', quantity_sold: 4, sales_amount: 96000, cogs_amount: 44160, gross_profit: 51840 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-006', quantity_sold: 1, sales_amount: 24000, cogs_amount: 11040, gross_profit: 12960 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-006', quantity_sold: 1, sales_amount: 24000, cogs_amount: 11040, gross_profit: 12960 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-006', quantity_sold: 0, sales_amount: 0, cogs_amount: 0, gross_profit: 0 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-006', quantity_sold: 1, sales_amount: 24000, cogs_amount: 11040, gross_profit: 12960 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-006', quantity_sold: 1, sales_amount: 24000, cogs_amount: 11040, gross_profit: 12960 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'F-019', quantity_sold: 12, sales_amount: 45600, cogs_amount: 14592, gross_profit: 31008 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'F-019', quantity_sold: 9, sales_amount: 34200, cogs_amount: 10944, gross_profit: 23256 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'F-019', quantity_sold: 10, sales_amount: 38000, cogs_amount: 12160, gross_profit: 25840 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'F-019', quantity_sold: 7, sales_amount: 26600, cogs_amount: 8512, gross_profit: 18088 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'F-019', quantity_sold: 10, sales_amount: 38000, cogs_amount: 12160, gross_profit: 25840 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'F-019', quantity_sold: 11, sales_amount: 41800, cogs_amount: 13376, gross_profit: 28424 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'F-019', quantity_sold: 6, sales_amount: 22800, cogs_amount: 7296, gross_profit: 15504 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-007', quantity_sold: 6, sales_amount: 36000, cogs_amount: 18000, gross_profit: 18000 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-007', quantity_sold: 6, sales_amount: 36000, cogs_amount: 18000, gross_profit: 18000 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-007', quantity_sold: 7, sales_amount: 42000, cogs_amount: 21000, gross_profit: 21000 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-007', quantity_sold: 6, sales_amount: 36000, cogs_amount: 18000, gross_profit: 18000 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-007', quantity_sold: 4, sales_amount: 24000, cogs_amount: 12000, gross_profit: 12000 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-007', quantity_sold: 10, sales_amount: 60000, cogs_amount: 30000, gross_profit: 30000 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-007', quantity_sold: 14, sales_amount: 84000, cogs_amount: 42000, gross_profit: 42000 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-005', quantity_sold: 8, sales_amount: 44000, cogs_amount: 22000, gross_profit: 22000 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-005', quantity_sold: 5, sales_amount: 27500, cogs_amount: 13750, gross_profit: 13750 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-005', quantity_sold: 5, sales_amount: 27500, cogs_amount: 13750, gross_profit: 13750 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-005', quantity_sold: 6, sales_amount: 33000, cogs_amount: 16500, gross_profit: 16500 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-005', quantity_sold: 8, sales_amount: 44000, cogs_amount: 22000, gross_profit: 22000 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-005', quantity_sold: 8, sales_amount: 44000, cogs_amount: 22000, gross_profit: 22000 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-005', quantity_sold: 2, sales_amount: 11000, cogs_amount: 5500, gross_profit: 5500 },
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, item_id: 'D-001', quantity_sold: 15, sales_amount: 42000, cogs_amount: 23100, gross_profit: 18900 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, item_id: 'D-001', quantity_sold: 11, sales_amount: 30800, cogs_amount: 16940, gross_profit: 13860 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, item_id: 'D-001', quantity_sold: 7, sales_amount: 19600, cogs_amount: 10780, gross_profit: 8820 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, item_id: 'D-001', quantity_sold: 15, sales_amount: 42000, cogs_amount: 23100, gross_profit: 18900 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, item_id: 'D-001', quantity_sold: 12, sales_amount: 33600, cogs_amount: 18480, gross_profit: 15120 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, item_id: 'D-001', quantity_sold: 12, sales_amount: 33600, cogs_amount: 18480, gross_profit: 15120 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, item_id: 'D-001', quantity_sold: 12, sales_amount: 33600, cogs_amount: 18480, gross_profit: 15120 },
      ];

      const { data: insertedSales, error: salesError } = await supabase
        .from('daily_item_sales')
        .insert(salesData)
        .select();

      if (salesError) throw salesError;

      setSalesResults({
        success: true,
        itemSales: insertedSales?.length || 0,
        message: `Successfully imported ${insertedSales?.length} daily item sales records!`
      });

    } catch (error: any) {
      setSalesResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingSales(false);
    }
  };

  const importDailySummariesData = async () => {
    setImportingSummaries(true);
    setSummariesResults(null);
    
    try {
      const summariesData = [
        { date: '2026-02-01', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2456000, cogs: 1194481, gross_profit: 1261519, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 29472, bank_charges: 0, total_opex: 714829, operating_profit: 546690 },
        { date: '2026-02-02', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2297500, cogs: 1082371, gross_profit: 1215129, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 27570, bank_charges: 10000, total_opex: 722927, operating_profit: 492202 },
        { date: '2026-02-03', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2045800, cogs: 1008669, gross_profit: 1037131, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 24550, bank_charges: 0, total_opex: 709907, operating_profit: 327224 },
        { date: '2026-02-04', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2057200, cogs: 931206, gross_profit: 1125994, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 24686, bank_charges: 0, total_opex: 710044, operating_profit: 415950 },
        { date: '2026-02-05', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2230700, cogs: 1061956, gross_profit: 1168744, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 26768, bank_charges: 0, total_opex: 712126, operating_profit: 456618 },
        { date: '2026-02-06', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2325800, cogs: 1118442, gross_profit: 1207358, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 27910, bank_charges: 0, total_opex: 713267, operating_profit: 494091 },
        { date: '2026-02-07', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2058200, cogs: 938344, gross_profit: 1119856, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 24698, bank_charges: 0, total_opex: 710056, operating_profit: 409800 },
        { date: '2026-02-08', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2599800, cogs: 1232757, gross_profit: 1367043, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 31198, bank_charges: 0, total_opex: 716555, operating_profit: 650488 },
        { date: '2026-02-09', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2116700, cogs: 1021961, gross_profit: 1094739, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 25400, bank_charges: 10000, total_opex: 720758, operating_profit: 373981 },
        { date: '2026-02-10', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2336700, cogs: 1137992, gross_profit: 1198708, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 28040, bank_charges: 0, total_opex: 713398, operating_profit: 485310 },
        { date: '2026-02-11', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1964400, cogs: 932024, gross_profit: 1032376, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 23573, bank_charges: 0, total_opex: 708930, operating_profit: 323446 },
        { date: '2026-02-12', day_of_week: 'Thursday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 0, bank_charges: 0, total_opex: 685357, operating_profit: -685357 },
        { date: '2026-02-13', day_of_week: 'Friday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 0, bank_charges: 0, total_opex: 685357, operating_profit: -685357 },
        { date: '2026-02-14', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2878600, cogs: 1463319, gross_profit: 1415281, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 34543, bank_charges: 0, total_opex: 719900, operating_profit: 695381 },
        { date: '2026-02-15', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2242900, cogs: 1122197, gross_profit: 1120703, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 26915, bank_charges: 0, total_opex: 712272, operating_profit: 408431 },
        { date: '2026-02-16', day_of_week: 'Monday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 0, bank_charges: 10000, total_opex: 695357, operating_profit: -695357 },
        { date: '2026-02-17', day_of_week: 'Tuesday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 0, bank_charges: 0, total_opex: 685357, operating_profit: -685357 },
        { date: '2026-02-18', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2067500, cogs: 994640, gross_profit: 1072860, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 24810, bank_charges: 0, total_opex: 710167, operating_profit: 362693 },
        { date: '2026-02-19', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1959900, cogs: 1008075, gross_profit: 951825, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 23519, bank_charges: 0, total_opex: 708876, operating_profit: 242949 },
        { date: '2026-02-20', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2295400, cogs: 1185282, gross_profit: 1110118, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 27545, bank_charges: 0, total_opex: 712902, operating_profit: 397216 },
        { date: '2026-02-21', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2324700, cogs: 1114537, gross_profit: 1210163, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 27896, bank_charges: 0, total_opex: 713254, operating_profit: 496909 },
        { date: '2026-02-22', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2428200, cogs: 1126727, gross_profit: 1301473, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 29138, bank_charges: 0, total_opex: 714496, operating_profit: 586977 },
        { date: '2026-02-23', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1963500, cogs: 907014, gross_profit: 1056486, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 23562, bank_charges: 10000, total_opex: 718919, operating_profit: 337567 },
        { date: '2026-02-24', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1993100, cogs: 927107, gross_profit: 1065993, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 23917, bank_charges: 0, total_opex: 709274, operating_profit: 356719 },
        { date: '2026-02-25', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1785800, cogs: 898186, gross_profit: 887614, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 21430, bank_charges: 0, total_opex: 706787, operating_profit: 180827 },
        { date: '2026-02-26', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2141900, cogs: 988212, gross_profit: 1153688, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 25703, bank_charges: 0, total_opex: 711060, operating_profit: 442628 },
        { date: '2026-02-27', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2847800, cogs: 1402649, gross_profit: 1445151, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 34174, bank_charges: 0, total_opex: 719531, operating_profit: 725620 },
        { date: '2026-02-28', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2257800, cogs: 1061334, gross_profit: 1196466, rent: 178571, waiters_salaries: 80357, chefs_salaries: 60714, other_staff_salaries: 163929, electricity_grid: 33929, generator_fuel: 89286, marketing_social: 42857, maintenance_sanitation: 25000, consumables: 10714, fixed_opex_total: 685357, card_fees: 27094, bank_charges: 0, total_opex: 712451, operating_profit: 484015 },
        { date: '2026-03-01', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2279200, cogs: 1102738, gross_profit: 1176462, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 27350, bank_charges: 0, total_opex: 646383, operating_profit: 530079 },
        { date: '2026-03-02', day_of_week: 'Monday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 0, bank_charges: 10000, total_opex: 629032, operating_profit: -629032 },
        { date: '2026-03-03', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2096500, cogs: 997608, gross_profit: 1098892, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 25158, bank_charges: 0, total_opex: 644190, operating_profit: 454702 },
        { date: '2026-03-04', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2056500, cogs: 971081, gross_profit: 1085419, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 24678, bank_charges: 0, total_opex: 643710, operating_profit: 441709 },
        { date: '2026-03-05', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1814200, cogs: 844298, gross_profit: 969902, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 21770, bank_charges: 0, total_opex: 640803, operating_profit: 329099 },
        { date: '2026-03-06', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2218400, cogs: 1034229, gross_profit: 1184171, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 26621, bank_charges: 0, total_opex: 645653, operating_profit: 538518 },
        { date: '2026-03-07', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2465400, cogs: 1239147, gross_profit: 1226253, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 29585, bank_charges: 0, total_opex: 648617, operating_profit: 577636 },
        { date: '2026-03-08', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2213000, cogs: 1041729, gross_profit: 1171271, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 26556, bank_charges: 0, total_opex: 645588, operating_profit: 525683 },
        { date: '2026-03-09', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2250400, cogs: 1027545, gross_profit: 1222855, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 27005, bank_charges: 10000, total_opex: 656037, operating_profit: 566818 },
        { date: '2026-03-10', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2503700, cogs: 1211296, gross_profit: 1292404, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 30044, bank_charges: 0, total_opex: 649077, operating_profit: 643327 },
        { date: '2026-03-11', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1966900, cogs: 921484, gross_profit: 1045416, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 23603, bank_charges: 0, total_opex: 642635, operating_profit: 402781 },
        { date: '2026-03-12', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2268000, cogs: 1060651, gross_profit: 1207349, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 27216, bank_charges: 0, total_opex: 646248, operating_profit: 561101 },
        { date: '2026-03-13', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2327100, cogs: 1127588, gross_profit: 1199512, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 27925, bank_charges: 0, total_opex: 646957, operating_profit: 552555 },
        { date: '2026-03-14', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2333000, cogs: 1110746, gross_profit: 1222254, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 27996, bank_charges: 0, total_opex: 647028, operating_profit: 575226 },
        { date: '2026-03-15', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2181500, cogs: 1065415, gross_profit: 1116085, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 26178, bank_charges: 0, total_opex: 645210, operating_profit: 470875 },
        { date: '2026-03-16', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2247800, cogs: 1078896, gross_profit: 1168904, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 26974, bank_charges: 10000, total_opex: 656006, operating_profit: 512898 },
        { date: '2026-03-17', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1875900, cogs: 885165, gross_profit: 990735, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 22511, bank_charges: 0, total_opex: 641543, operating_profit: 349192 },
        { date: '2026-03-18', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2031400, cogs: 938365, gross_profit: 1093035, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 24377, bank_charges: 0, total_opex: 643409, operating_profit: 449626 },
        { date: '2026-03-19', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1932300, cogs: 938913, gross_profit: 993387, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 23188, bank_charges: 0, total_opex: 642220, operating_profit: 351167 },
        { date: '2026-03-20', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2326500, cogs: 1144376, gross_profit: 1182124, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 27918, bank_charges: 0, total_opex: 646950, operating_profit: 535174 },
        { date: '2026-03-21', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2118600, cogs: 972592, gross_profit: 1146008, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 25423, bank_charges: 0, total_opex: 644455, operating_profit: 501553 },
        { date: '2026-03-22', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2375200, cogs: 1097741, gross_profit: 1277459, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 28502, bank_charges: 0, total_opex: 647535, operating_profit: 629924 },
        { date: '2026-03-23', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1989900, cogs: 979978, gross_profit: 1009922, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 23879, bank_charges: 10000, total_opex: 652911, operating_profit: 357011 },
        { date: '2026-03-24', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2022000, cogs: 981494, gross_profit: 1040506, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 24264, bank_charges: 0, total_opex: 643296, operating_profit: 397210 },
        { date: '2026-03-25', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2106500, cogs: 1003197, gross_profit: 1103303, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 25278, bank_charges: 0, total_opex: 644310, operating_profit: 458993 },
        { date: '2026-03-26', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2160300, cogs: 1040770, gross_profit: 1119530, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 25924, bank_charges: 0, total_opex: 644956, operating_profit: 474574 },
        { date: '2026-03-27', day_of_week: 'Friday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 0, bank_charges: 0, total_opex: 619032, operating_profit: -619032 },
        { date: '2026-03-28', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2658700, cogs: 1250552, gross_profit: 1408148, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 31904, bank_charges: 0, total_opex: 650937, operating_profit: 757211 },
        { date: '2026-03-29', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2472500, cogs: 1148138, gross_profit: 1324362, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 29670, bank_charges: 0, total_opex: 648702, operating_profit: 675660 },
        { date: '2026-03-30', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1899800, cogs: 892897, gross_profit: 1006903, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 22798, bank_charges: 10000, total_opex: 651830, operating_profit: 355073 },
        { date: '2026-03-31', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2174400, cogs: 1041804, gross_profit: 1132596, rent: 161290, waiters_salaries: 72581, chefs_salaries: 54839, other_staff_salaries: 148065, electricity_grid: 30645, generator_fuel: 80645, marketing_social: 38710, maintenance_sanitation: 22581, consumables: 9677, fixed_opex_total: 619032, card_fees: 26093, bank_charges: 0, total_opex: 645125, operating_profit: 487471 },
        { date: '2026-04-01', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2128300, cogs: 1002613, gross_profit: 1125687, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 25540, bank_charges: 0, total_opex: 665206, operating_profit: 460481 },
        { date: '2026-04-02', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1895200, cogs: 912765, gross_profit: 982435, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 22742, bank_charges: 0, total_opex: 662409, operating_profit: 320026 },
        { date: '2026-04-03', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2132200, cogs: 1020115, gross_profit: 1112085, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 25586, bank_charges: 0, total_opex: 665253, operating_profit: 446832 },
        { date: '2026-04-04', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1963200, cogs: 896021, gross_profit: 1067179, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 23558, bank_charges: 0, total_opex: 663225, operating_profit: 403954 },
        { date: '2026-04-05', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2118900, cogs: 1008267, gross_profit: 1110633, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 25427, bank_charges: 0, total_opex: 665093, operating_profit: 445540 },
        { date: '2026-04-06', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1989300, cogs: 972608, gross_profit: 1016692, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 23872, bank_charges: 10000, total_opex: 673538, operating_profit: 343154 },
        { date: '2026-04-07', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1940800, cogs: 901552, gross_profit: 1039248, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 23290, bank_charges: 0, total_opex: 662956, operating_profit: 376292 },
        { date: '2026-04-08', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1808400, cogs: 799196, gross_profit: 1009204, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 21701, bank_charges: 0, total_opex: 661367, operating_profit: 347837 },
        { date: '2026-04-09', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1909100, cogs: 923524, gross_profit: 985576, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 22909, bank_charges: 0, total_opex: 662576, operating_profit: 323000 },
        { date: '2026-04-10', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2419700, cogs: 1206820, gross_profit: 1212880, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 29036, bank_charges: 0, total_opex: 668703, operating_profit: 544177 },
        { date: '2026-04-11', day_of_week: 'Saturday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-12', day_of_week: 'Sunday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-13', day_of_week: 'Monday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 10000, total_opex: 649667, operating_profit: -649667 },
        { date: '2026-04-14', day_of_week: 'Tuesday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-15', day_of_week: 'Wednesday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-16', day_of_week: 'Thursday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-17', day_of_week: 'Friday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-18', day_of_week: 'Saturday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-19', day_of_week: 'Sunday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
        { date: '2026-04-20', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1819200, cogs: 853374, gross_profit: 965826, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 21830, bank_charges: 10000, total_opex: 671497, operating_profit: 294329 },
        { date: '2026-04-21', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2222300, cogs: 1074130, gross_profit: 1148170, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 26668, bank_charges: 0, total_opex: 666334, operating_profit: 481836 },
        { date: '2026-04-22', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2125200, cogs: 1021166, gross_profit: 1104034, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 25502, bank_charges: 0, total_opex: 665169, operating_profit: 438865 },
        { date: '2026-04-23', day_of_week: 'Thursday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2174800, cogs: 1016059, gross_profit: 1158741, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 26098, bank_charges: 0, total_opex: 665764, operating_profit: 492977 },
        { date: '2026-04-24', day_of_week: 'Friday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2551000, cogs: 1253793, gross_profit: 1297207, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 30612, bank_charges: 0, total_opex: 670279, operating_profit: 626928 },
        { date: '2026-04-25', day_of_week: 'Saturday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2350400, cogs: 1160929, gross_profit: 1189471, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 28205, bank_charges: 0, total_opex: 667871, operating_profit: 521600 },
        { date: '2026-04-26', day_of_week: 'Sunday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2002700, cogs: 953842, gross_profit: 1048858, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 24032, bank_charges: 0, total_opex: 663699, operating_profit: 385159 },
        { date: '2026-04-27', day_of_week: 'Monday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2285100, cogs: 1114424, gross_profit: 1170676, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 27421, bank_charges: 10000, total_opex: 677088, operating_profit: 493588 },
        { date: '2026-04-28', day_of_week: 'Tuesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 2092800, cogs: 994464, gross_profit: 1098336, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 25114, bank_charges: 0, total_opex: 664780, operating_profit: 433556 },
        { date: '2026-04-29', day_of_week: 'Wednesday', is_open: true, open_hours: '09:00-23:00', hours_open: 14, covers: 84, net_sales: 1718300, cogs: 807087, gross_profit: 911213, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 20620, bank_charges: 0, total_opex: 660286, operating_profit: 250927 },
        { date: '2026-04-30', day_of_week: 'Thursday', is_open: false, open_hours: '-', hours_open: 0, covers: 0, net_sales: 0, cogs: 0, gross_profit: 0, rent: 166667, waiters_salaries: 75000, chefs_salaries: 56667, other_staff_salaries: 153000, electricity_grid: 31667, generator_fuel: 83333, marketing_social: 40000, maintenance_sanitation: 23333, consumables: 10000, fixed_opex_total: 639667, card_fees: 0, bank_charges: 0, total_opex: 639667, operating_profit: -639667 },
      ];

      const { data: insertedSummaries, error: summariesError } = await supabase
        .from('daily_summaries')
        .insert(summariesData)
        .select();

      if (summariesError) throw summariesError;

      setSummariesResults({
        success: true,
        summaries: insertedSummaries?.length || 0,
        message: `Successfully imported ${insertedSummaries?.length} daily summary records!`
      });

    } catch (error: any) {
      setSummariesResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingSummaries(false);
    }
  };

  const importDailyIngredientUsage = async () => {
    setImportingUsage(true);
    setUsageResults(null);
    
    try {
      const usageData = [
        { date: '2026-02-01', ingredient: 'Flour_g', uom: 'g', total_qty: 8870 },
        { date: '2026-02-01', ingredient: 'TomatoSauce_g', uom: 'g', total_qty: 3024 },
        { date: '2026-02-01', ingredient: 'WhiteSauce_g', uom: 'g', total_qty: 560 },
        { date: '2026-02-01', ingredient: 'Mozzarella_g', uom: 'g', total_qty: 4872 },
        { date: '2026-02-01', ingredient: 'Chicken_g', uom: 'g', total_qty: 4838 },
        { date: '2026-02-01', ingredient: 'Beef_g', uom: 'g', total_qty: 2820 },
        { date: '2026-02-01', ingredient: 'Beer_ml', uom: 'ml', total_qty: 18420 },
        { date: '2026-02-02', ingredient: 'Flour_g', uom: 'g', total_qty: 8705 },
        { date: '2026-02-02', ingredient: 'TomatoSauce_g', uom: 'g', total_qty: 3096 },
        { date: '2026-02-02', ingredient: 'Chicken_g', uom: 'g', total_qty: 7144 },
        { date: '2026-02-03', ingredient: 'Flour_g', uom: 'g', total_qty: 6940 },
        { date: '2026-02-03', ingredient: 'Chicken_g', uom: 'g', total_qty: 6262 },
      ];

      const { data: insertedUsage, error: usageError } = await supabase
        .from('daily_ingredient_usage')
        .insert(usageData)
        .select();

      if (usageError) throw usageError;

      setUsageResults({
        success: true,
        records: insertedUsage?.length || 0,
        message: `Successfully imported ${insertedUsage?.length} daily ingredient usage records!`
      });

    } catch (error: any) {
      setUsageResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingUsage(false);
    }
  };

  const importInventoryAlerts = async () => {
    setImportingAlerts(true);
    setAlertsResults(null);
    
    try {
      const alertsData = [
        { date: '2026-02-01', ingredient: 'Bread_g', closing_on_hand: 1158.9, on_order_qty: 0, reorder_point: 7163.01, qty_expiring_soon: 0, earliest_expiry_date: '2026-04-30', suggested_action: 'REORDER' },
        { date: '2026-02-01', ingredient: 'Seafood_g', closing_on_hand: 2486.47, on_order_qty: 0, reorder_point: 2937.64, qty_expiring_soon: 0, earliest_expiry_date: '2026-04-30', suggested_action: 'REORDER' },
        { date: '2026-02-01', ingredient: 'TomatoSauce_g', closing_on_hand: 4830.41, on_order_qty: 0, reorder_point: 5236.27, qty_expiring_soon: 0, earliest_expiry_date: '2026-05-01', suggested_action: 'REORDER' },
        { date: '2026-02-02', ingredient: 'Bread_g', closing_on_hand: 708.9, on_order_qty: 1000, reorder_point: 7163.01, qty_expiring_soon: 0, earliest_expiry_date: '2026-04-30', suggested_action: 'REORDER' },
        { date: '2026-02-03', ingredient: 'Bread_g', closing_on_hand: 0, on_order_qty: 1500, reorder_point: 7163.01, qty_expiring_soon: 0, earliest_expiry_date: '2026-04-30', suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
        { date: '2026-02-03', ingredient: 'Beef_g', closing_on_hand: 3146.71, on_order_qty: 0, reorder_point: 4770.68, qty_expiring_soon: 0, earliest_expiry_date: '2026-04-30', suggested_action: 'REORDER' },
      ];

      const { data: insertedAlerts, error: alertsError } = await supabase
        .from('inventory_alerts')
        .insert(alertsData)
        .select();

      if (alertsError) throw alertsError;

      setAlertsResults({
        success: true,
        records: insertedAlerts?.length || 0,
        message: `Successfully imported ${insertedAlerts?.length} inventory alert records!`
      });

    } catch (error: any) {
      setAlertsResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingAlerts(false);
    }
  };

  const importPurchaseOrders = async () => {
    setImportingPurchaseOrders(true);
    setPurchaseOrdersResults(null);
    
    try {
      const purchaseOrdersData = [
        { po_id: 'PO-20260201-Bread_g', ordered_date: '2026-02-01', ingredient: 'Bread_g', qty: 1000, uom: 'g', eta: '2026-02-04', reason: 'Reorder point', status: 'ordered' },
        { po_id: 'PO-20260201-Seafood_g', ordered_date: '2026-02-01', ingredient: 'Seafood_g', qty: 2000, uom: 'g', eta: '2026-02-02', reason: 'Reorder point', status: 'received', received_date: '2026-02-02', received_qty: 2000 },
        { po_id: 'PO-20260201-TomatoSauce_g', ordered_date: '2026-02-01', ingredient: 'TomatoSauce_g', qty: 3500, uom: 'g', eta: '2026-02-02', reason: 'Reorder point', status: 'received', received_date: '2026-02-02', received_qty: 3500 },
        { po_id: 'PO-20260202-Lime_g', ordered_date: '2026-02-02', ingredient: 'Lime_g', qty: 1000, uom: 'g', eta: '2026-02-03', reason: 'Reorder point', status: 'ordered' },
        { po_id: 'PO-20260203-Beef_g', ordered_date: '2026-02-03', ingredient: 'Beef_g', qty: 9000, uom: 'g', eta: '2026-02-04', reason: 'Reorder point', status: 'received', received_date: '2026-02-04', received_qty: 9000 },
        { po_id: 'PO-20260203-Chicken_g', ordered_date: '2026-02-04', ingredient: 'Chicken_g', qty: 27500, uom: 'g', eta: '2026-02-05', reason: 'Reorder point', status: 'ordered' },
      ];

      const { data: insertedPOs, error: poError } = await supabase
        .from('purchase_orders')
        .insert(purchaseOrdersData)
        .select();

      if (poError) throw poError;

      setPurchaseOrdersResults({
        success: true,
        records: insertedPOs?.length || 0,
        message: `Successfully imported ${insertedPOs?.length} purchase order records!`
      });

    } catch (error: any) {
      setPurchaseOrdersResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingPurchaseOrders(false);
    }
  };

  const importPayroll = async () => {
    setImportingPayroll(true);
    setPayrollResults(null);
    
    try {
      const payrollData = [
        { role: 'Manager', headcount: 1, monthly_salary_per_person: 1200000, monthly_total: 1200000, is_active: true },
        { role: 'Chefs', headcount: 2, monthly_salary_per_person: 850000, monthly_total: 1700000, is_active: true },
        { role: 'Waiters', headcount: 5, monthly_salary_per_person: 450000, monthly_total: 2250000, is_active: true },
        { role: 'Security', headcount: 1, monthly_salary_per_person: 400000, monthly_total: 400000, is_active: true },
        { role: 'Kitchen Helpers', headcount: 2, monthly_salary_per_person: 350000, monthly_total: 700000, is_active: true },
        { role: 'Bartender/Barista', headcount: 1, monthly_salary_per_person: 500000, monthly_total: 500000, is_active: true },
        { role: 'Cashier', headcount: 1, monthly_salary_per_person: 450000, monthly_total: 450000, is_active: true },
        { role: 'Cleaner', headcount: 1, monthly_salary_per_person: 350000, monthly_total: 350000, is_active: true },
        { role: 'Other/Admin', headcount: 0, monthly_salary_per_person: 990000, monthly_total: 990000, is_active: true },
      ];

      const { data: insertedPayroll, error: payrollError } = await supabase
        .from('payroll')
        .insert(payrollData)
        .select();

      if (payrollError) throw payrollError;

      setPayrollResults({
        success: true,
        records: insertedPayroll?.length || 0,
        message: `Successfully imported ${insertedPayroll?.length} payroll records! Total monthly: ₭8,540,000`
      });

    } catch (error: any) {
      setPayrollResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingPayroll(false);
    }
  };
  const importInventoryDailyStatus = async () => {
    setImportingInventoryStatus(true);
    setInventoryStatusResults(null);
    
    try {
      const inventoryData = [
  { date: '2026-04-20', ingredient: 'Anchovy_g', uom: 'g', usage_today: 25, wastage_today: 0, closing_on_hand: 665.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Beef_g', uom: 'g', usage_today: 1830, wastage_today: 0, closing_on_hand: 10170, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Beer_ml', uom: 'ml', usage_today: 13430, wastage_today: 0, closing_on_hand: 573520.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Bread_g', uom: 'g', usage_today: 1080, wastage_today: 0, closing_on_hand: 920, on_order_qty: 500, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 3, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-20', ingredient: 'Butter_g', uom: 'g', usage_today: 180, wastage_today: 0, closing_on_hand: 2437.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Chicken_g', uom: 'g', usage_today: 5242, wastage_today: 0, closing_on_hand: 28758, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Chocolate_g', uom: 'g', usage_today: 325, wastage_today: 0, closing_on_hand: 12706.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'CookingOil_g', uom: 'g', usage_today: 975, wastage_today: 0, closing_on_hand: 32858.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Cream_ml', uom: 'ml', usage_today: 1020, wastage_today: 0, closing_on_hand: 6980, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Egg_count', uom: 'count', usage_today: 18, wastage_today: 0, closing_on_hand: 66, on_order_qty: 0, reorder_point: 78.85, reorder_flag: true, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-20', ingredient: 'Flour_g', uom: 'g', usage_today: 6545, wastage_today: 0, closing_on_hand: 209902.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Garlic_g', uom: 'g', usage_today: 111.2, wastage_today: 0, closing_on_hand: 888.8, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Lime_g', uom: 'g', usage_today: 240, wastage_today: 0, closing_on_hand: 1260, on_order_qty: 0, reorder_point: 691.51, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Milk_ml', uom: 'ml', usage_today: 4500, wastage_today: 0, closing_on_hand: 24500, on_order_qty: 0, reorder_point: 16142.47, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Mint_g', uom: 'g', usage_today: 15, wastage_today: 0, closing_on_hand: 485, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 3576, wastage_today: 0, closing_on_hand: 9924, on_order_qty: 15500, reorder_point: 16356.82, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Mushroom_g', uom: 'g', usage_today: 560, wastage_today: 0, closing_on_hand: 1440, on_order_qty: 0, reorder_point: 728.77, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'OliveOil_g', uom: 'g', usage_today: 368.4, wastage_today: 0, closing_on_hand: 11299.25, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Onion_g', uom: 'g', usage_today: 572, wastage_today: 1928, closing_on_hand: 0, on_order_qty: 0, reorder_point: 955.53, reorder_flag: true, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-20', ingredient: 'Parmesan_g', uom: 'g', usage_today: 80, wastage_today: 0, closing_on_hand: 621.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Pesto_g', uom: 'g', usage_today: 182, wastage_today: 0, closing_on_hand: 1318, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Pita_g', uom: 'g', usage_today: 240, wastage_today: 0, closing_on_hand: 3854.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Pork_g', uom: 'g', usage_today: 1040, wastage_today: 0, closing_on_hand: 11978.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Potato_g', uom: 'g', usage_today: 4750, wastage_today: 0, closing_on_hand: 61254.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Salmon_g', uom: 'g', usage_today: 360, wastage_today: 0, closing_on_hand: 11056.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'SauceOther_g', uom: 'g', usage_today: 2097, wastage_today: 0, closing_on_hand: 13403, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Seafood_g', uom: 'g', usage_today: 964, wastage_today: 1536, closing_on_hand: 2000, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-20', ingredient: 'Soda_ml', uom: 'ml', usage_today: 12090, wastage_today: 0, closing_on_hand: 434342.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Soju_ml', uom: 'ml', usage_today: 3240, wastage_today: 0, closing_on_hand: 130522.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1095, wastage_today: 0, closing_on_hand: 44979.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Sugar_g', uom: 'g', usage_today: 410, wastage_today: 0, closing_on_hand: 16909.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 2322, wastage_today: 0, closing_on_hand: 5678, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'VegMix_g', uom: 'g', usage_today: 3402, wastage_today: 13598, closing_on_hand: 0, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-20', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 320, wastage_today: 0, closing_on_hand: 1180, on_order_qty: 0, reorder_point: 797.81, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-20', ingredient: 'Wine_ml', uom: 'ml', usage_today: 1560, wastage_today: 0, closing_on_hand: 64381.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Anchovy_g', uom: 'g', usage_today: 50, wastage_today: 0, closing_on_hand: 615.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Beef_g', uom: 'g', usage_today: 3000, wastage_today: 0, closing_on_hand: 7170, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Beer_ml', uom: 'ml', usage_today: 15930, wastage_today: 0, closing_on_hand: 557590.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Bread_g', uom: 'g', usage_today: 900, wastage_today: 20, closing_on_hand: 0, on_order_qty: 1500, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 3, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-21', ingredient: 'Butter_g', uom: 'g', usage_today: 270, wastage_today: 0, closing_on_hand: 2167.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Chicken_g', uom: 'g', usage_today: 6304, wastage_today: 0, closing_on_hand: 22454, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Chocolate_g', uom: 'g', usage_today: 390, wastage_today: 0, closing_on_hand: 12316.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'CookingOil_g', uom: 'g', usage_today: 1155, wastage_today: 0, closing_on_hand: 31703.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Cream_ml', uom: 'ml', usage_today: 840, wastage_today: 2140, closing_on_hand: 4000, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: true, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-21', ingredient: 'Egg_count', uom: 'count', usage_today: 16, wastage_today: 0, closing_on_hand: 50, on_order_qty: 72, reorder_point: 78.85, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Flour_g', uom: 'g', usage_today: 8910, wastage_today: 0, closing_on_hand: 200992.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Garlic_g', uom: 'g', usage_today: 131.4, wastage_today: 757.4, closing_on_hand: 0, on_order_qty: 0, reorder_point: 218.99, reorder_flag: true, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-21', ingredient: 'Lime_g', uom: 'g', usage_today: 375, wastage_today: 0, closing_on_hand: 885, on_order_qty: 0, reorder_point: 691.51, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Milk_ml', uom: 'ml', usage_today: 4260, wastage_today: 6240, closing_on_hand: 14000, on_order_qty: 0, reorder_point: 16142.47, reorder_flag: true, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-21', ingredient: 'Mint_g', uom: 'g', usage_today: 25, wastage_today: 0, closing_on_hand: 460, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 4848, wastage_today: 0, closing_on_hand: 20576, on_order_qty: 0, reorder_point: 16356.82, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Mushroom_g', uom: 'g', usage_today: 420, wastage_today: 0, closing_on_hand: 1020, on_order_qty: 0, reorder_point: 728.77, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'OliveOil_g', uom: 'g', usage_today: 423.2, wastage_today: 0, closing_on_hand: 10876.05, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Onion_g', uom: 'g', usage_today: 510, wastage_today: 0, closing_on_hand: 1990, on_order_qty: 0, reorder_point: 955.53, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Parmesan_g', uom: 'g', usage_today: 100, wastage_today: 0, closing_on_hand: 521.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Pesto_g', uom: 'g', usage_today: 252, wastage_today: 0, closing_on_hand: 1066, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Pita_g', uom: 'g', usage_today: 360, wastage_today: 0, closing_on_hand: 3494.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Pork_g', uom: 'g', usage_today: 1580, wastage_today: 0, closing_on_hand: 10398.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Potato_g', uom: 'g', usage_today: 5700, wastage_today: 0, closing_on_hand: 55554.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Salmon_g', uom: 'g', usage_today: 90, wastage_today: 0, closing_on_hand: 10966.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'SauceOther_g', uom: 'g', usage_today: 3265, wastage_today: 0, closing_on_hand: 10138, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Seafood_g', uom: 'g', usage_today: 1598, wastage_today: 402, closing_on_hand: 2500, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-21', ingredient: 'Soda_ml', uom: 'ml', usage_today: 10800, wastage_today: 0, closing_on_hand: 423542.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Soju_ml', uom: 'ml', usage_today: 2880, wastage_today: 0, closing_on_hand: 127642.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1500, wastage_today: 0, closing_on_hand: 43479.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'Sugar_g', uom: 'g', usage_today: 500, wastage_today: 0, closing_on_hand: 16409.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 3006, wastage_today: 0, closing_on_hand: 2672, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-21', ingredient: 'VegMix_g', uom: 'g', usage_today: 3170, wastage_today: 0, closing_on_hand: 13830, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-21', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 560, wastage_today: 0, closing_on_hand: 620, on_order_qty: 0, reorder_point: 797.81, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-21', ingredient: 'Wine_ml', uom: 'ml', usage_today: 1740, wastage_today: 0, closing_on_hand: 62641.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Anchovy_g', uom: 'g', usage_today: 0, wastage_today: 0, closing_on_hand: 615.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Beef_g', uom: 'g', usage_today: 2570, wastage_today: 0, closing_on_hand: 4600, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-22', ingredient: 'Beer_ml', uom: 'ml', usage_today: 17610, wastage_today: 0, closing_on_hand: 539980.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Bread_g', uom: 'g', usage_today: 1350, wastage_today: 0, closing_on_hand: 2150, on_order_qty: 2000, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 3, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-22', ingredient: 'Butter_g', uom: 'g', usage_today: 150, wastage_today: 0, closing_on_hand: 2017.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Chicken_g', uom: 'g', usage_today: 6572, wastage_today: 0, closing_on_hand: 15882, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Chocolate_g', uom: 'g', usage_today: 230, wastage_today: 0, closing_on_hand: 12086.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'CookingOil_g', uom: 'g', usage_today: 1320, wastage_today: 0, closing_on_hand: 30383.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Cream_ml', uom: 'ml', usage_today: 720, wastage_today: 0, closing_on_hand: 3280, on_order_qty: 4000, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Egg_count', uom: 'count', usage_today: 13, wastage_today: 0, closing_on_hand: 109, on_order_qty: 0, reorder_point: 78.85, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Flour_g', uom: 'g', usage_today: 6550, wastage_today: 0, closing_on_hand: 194442.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Garlic_g', uom: 'g', usage_today: 109.8, wastage_today: 0, closing_on_hand: 890.2, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Lime_g', uom: 'g', usage_today: 400, wastage_today: 0, closing_on_hand: 485, on_order_qty: 0, reorder_point: 691.51, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-22', ingredient: 'Milk_ml', uom: 'ml', usage_today: 4020, wastage_today: 0, closing_on_hand: 9980, on_order_qty: 15000, reorder_point: 16142.47, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Mint_g', uom: 'g', usage_today: 25, wastage_today: 0, closing_on_hand: 435, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 3552, wastage_today: 0, closing_on_hand: 17024, on_order_qty: 0, reorder_point: 16356.82, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Mushroom_g', uom: 'g', usage_today: 420, wastage_today: 600, closing_on_hand: 0, on_order_qty: 0, reorder_point: 728.77, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-22', ingredient: 'OliveOil_g', uom: 'g', usage_today: 406.8, wastage_today: 0, closing_on_hand: 10469.25, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Onion_g', uom: 'g', usage_today: 557, wastage_today: 0, closing_on_hand: 1433, on_order_qty: 0, reorder_point: 955.53, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Parmesan_g', uom: 'g', usage_today: 80, wastage_today: 0, closing_on_hand: 441.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Pesto_g', uom: 'g', usage_today: 254, wastage_today: 812, closing_on_hand: 0, on_order_qty: 0, reorder_point: 480.96, reorder_flag: true, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-22', ingredient: 'Pita_g', uom: 'g', usage_today: 120, wastage_today: 0, closing_on_hand: 3374.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Pork_g', uom: 'g', usage_today: 1460, wastage_today: 0, closing_on_hand: 8938.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Potato_g', uom: 'g', usage_today: 7900, wastage_today: 0, closing_on_hand: 47654.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Salmon_g', uom: 'g', usage_today: 900, wastage_today: 0, closing_on_hand: 10066.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'SauceOther_g', uom: 'g', usage_today: 3086, wastage_today: 0, closing_on_hand: 7052, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Seafood_g', uom: 'g', usage_today: 1076, wastage_today: 0, closing_on_hand: 3424, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Soda_ml', uom: 'ml', usage_today: 13110, wastage_today: 0, closing_on_hand: 410432.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Soju_ml', uom: 'ml', usage_today: 4320, wastage_today: 0, closing_on_hand: 123322.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1350, wastage_today: 0, closing_on_hand: 42129.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'Sugar_g', uom: 'g', usage_today: 310, wastage_today: 0, closing_on_hand: 16099.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 2034, wastage_today: 0, closing_on_hand: 6138, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'VegMix_g', uom: 'g', usage_today: 3788, wastage_today: 0, closing_on_hand: 10042, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-22', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 560, wastage_today: 60, closing_on_hand: 1000, on_order_qty: 0, reorder_point: 797.81, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-22', ingredient: 'Wine_ml', uom: 'ml', usage_today: 1920, wastage_today: 0, closing_on_hand: 60721.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Anchovy_g', uom: 'g', usage_today: 50, wastage_today: 0, closing_on_hand: 565.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Beef_g', uom: 'g', usage_today: 2980, wastage_today: 0, closing_on_hand: 9120, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Beer_ml', uom: 'ml', usage_today: 16610, wastage_today: 0, closing_on_hand: 523370.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Bread_g', uom: 'g', usage_today: 720, wastage_today: 0, closing_on_hand: 2430, on_order_qty: 1000, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 3, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-23', ingredient: 'Butter_g', uom: 'g', usage_today: 300, wastage_today: 0, closing_on_hand: 1717.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Chicken_g', uom: 'g', usage_today: 7560, wastage_today: 8322, closing_on_hand: 0, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: true, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-23', ingredient: 'Chocolate_g', uom: 'g', usage_today: 355, wastage_today: 0, closing_on_hand: 11731.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'CookingOil_g', uom: 'g', usage_today: 1545, wastage_today: 0, closing_on_hand: 28838.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Cream_ml', uom: 'ml', usage_today: 1080, wastage_today: 0, closing_on_hand: 6200, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Egg_count', uom: 'count', usage_today: 20, wastage_today: 0, closing_on_hand: 89, on_order_qty: 0, reorder_point: 78.85, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Flour_g', uom: 'g', usage_today: 6395, wastage_today: 0, closing_on_hand: 188047.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Garlic_g', uom: 'g', usage_today: 84.8, wastage_today: 0, closing_on_hand: 805.4, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Lime_g', uom: 'g', usage_today: 375, wastage_today: 110, closing_on_hand: 1000, on_order_qty: 0, reorder_point: 691.51, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-23', ingredient: 'Milk_ml', uom: 'ml', usage_today: 5820, wastage_today: 0, closing_on_hand: 19160, on_order_qty: 0, reorder_point: 16142.47, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Mint_g', uom: 'g', usage_today: 35, wastage_today: 400, closing_on_hand: 0, on_order_qty: 0, reorder_point: 42.74, reorder_flag: true, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-23', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 3264, wastage_today: 0, closing_on_hand: 13760, on_order_qty: 0, reorder_point: 16356.82, reorder_flag: true, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-23', ingredient: 'Mushroom_g', uom: 'g', usage_today: 840, wastage_today: 0, closing_on_hand: 1160, on_order_qty: 0, reorder_point: 728.77, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'OliveOil_g', uom: 'g', usage_today: 317.6, wastage_today: 0, closing_on_hand: 10151.65, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Onion_g', uom: 'g', usage_today: 302, wastage_today: 0, closing_on_hand: 1131, on_order_qty: 0, reorder_point: 955.53, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Parmesan_g', uom: 'g', usage_today: 40, wastage_today: 0, closing_on_hand: 401.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Pesto_g', uom: 'g', usage_today: 163, wastage_today: 0, closing_on_hand: 1337, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Pita_g', uom: 'g', usage_today: 240, wastage_today: 0, closing_on_hand: 3134.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Pork_g', uom: 'g', usage_today: 940, wastage_today: 0, closing_on_hand: 7998.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Potato_g', uom: 'g', usage_today: 8350, wastage_today: 0, closing_on_hand: 39304.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Salmon_g', uom: 'g', usage_today: 720, wastage_today: 0, closing_on_hand: 9346.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'SauceOther_g', uom: 'g', usage_today: 3467, wastage_today: 3585, closing_on_hand: 0, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: true, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-23', ingredient: 'Seafood_g', uom: 'g', usage_today: 2644, wastage_today: 0, closing_on_hand: 780, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-23', ingredient: 'Soda_ml', uom: 'ml', usage_today: 20250, wastage_today: 0, closing_on_hand: 390182.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Soju_ml', uom: 'ml', usage_today: 4680, wastage_today: 0, closing_on_hand: 118642.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1230, wastage_today: 0, closing_on_hand: 40899.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'Sugar_g', uom: 'g', usage_today: 530, wastage_today: 0, closing_on_hand: 15569.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 1728, wastage_today: 0, closing_on_hand: 4410, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-23', ingredient: 'VegMix_g', uom: 'g', usage_today: 2672, wastage_today: 0, closing_on_hand: 7370, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-23', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 640, wastage_today: 0, closing_on_hand: 360, on_order_qty: 0, reorder_point: 797.81, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-23', ingredient: 'Wine_ml', uom: 'ml', usage_today: 990, wastage_today: 0, closing_on_hand: 59731.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Anchovy_g', uom: 'g', usage_today: 50, wastage_today: 0, closing_on_hand: 515.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Beef_g', uom: 'g', usage_today: 1820, wastage_today: 0, closing_on_hand: 7300, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Beer_ml', uom: 'ml', usage_today: 19760, wastage_today: 0, closing_on_hand: 503610.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Bread_g', uom: 'g', usage_today: 540, wastage_today: 890, closing_on_hand: 2000, on_order_qty: 0, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 3, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-24', ingredient: 'Butter_g', uom: 'g', usage_today: 370, wastage_today: 0, closing_on_hand: 1347.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Chicken_g', uom: 'g', usage_today: 6912, wastage_today: 0, closing_on_hand: 27088, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Chocolate_g', uom: 'g', usage_today: 465, wastage_today: 0, closing_on_hand: 11266.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'CookingOil_g', uom: 'g', usage_today: 1330, wastage_today: 0, closing_on_hand: 27508.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Cream_ml', uom: 'ml', usage_today: 1080, wastage_today: 0, closing_on_hand: 5120, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Egg_count', uom: 'count', usage_today: 25, wastage_today: 0, closing_on_hand: 64, on_order_qty: 0, reorder_point: 78.85, reorder_flag: true, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'Flour_g', uom: 'g', usage_today: 10575, wastage_today: 0, closing_on_hand: 177472.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Garlic_g', uom: 'g', usage_today: 147.4, wastage_today: 0, closing_on_hand: 658, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Lime_g', uom: 'g', usage_today: 325, wastage_today: 0, closing_on_hand: 675, on_order_qty: 0, reorder_point: 691.51, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'Milk_ml', uom: 'ml', usage_today: 5460, wastage_today: 0, closing_on_hand: 13700, on_order_qty: 0, reorder_point: 16142.47, reorder_flag: true, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'Mint_g', uom: 'g', usage_today: 15, wastage_today: 0, closing_on_hand: 485, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 5904, wastage_today: 0, closing_on_hand: 7856, on_order_qty: 15000, reorder_point: 16356.82, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Mushroom_g', uom: 'g', usage_today: 140, wastage_today: 0, closing_on_hand: 1020, on_order_qty: 0, reorder_point: 728.77, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'OliveOil_g', uom: 'g', usage_today: 483.6, wastage_today: 0, closing_on_hand: 9668.05, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Onion_g', uom: 'g', usage_today: 682, wastage_today: 0, closing_on_hand: 449, on_order_qty: 0, reorder_point: 955.53, reorder_flag: true, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'Parmesan_g', uom: 'g', usage_today: 20, wastage_today: 0, closing_on_hand: 381.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Pesto_g', uom: 'g', usage_today: 346, wastage_today: 0, closing_on_hand: 991, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Pita_g', uom: 'g', usage_today: 240, wastage_today: 0, closing_on_hand: 2894.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Pork_g', uom: 'g', usage_today: 1100, wastage_today: 0, closing_on_hand: 6898.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: true, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'Potato_g', uom: 'g', usage_today: 7300, wastage_today: 0, closing_on_hand: 32004.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: true, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'Salmon_g', uom: 'g', usage_today: 1350, wastage_today: 0, closing_on_hand: 7996.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'SauceOther_g', uom: 'g', usage_today: 2604, wastage_today: 0, closing_on_hand: 12896, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Seafood_g', uom: 'g', usage_today: 1370, wastage_today: 0, closing_on_hand: 3410, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Soda_ml', uom: 'ml', usage_today: 17490, wastage_today: 0, closing_on_hand: 372692.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Soju_ml', uom: 'ml', usage_today: 3600, wastage_today: 0, closing_on_hand: 115042.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1650, wastage_today: 0, closing_on_hand: 39249.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'Sugar_g', uom: 'g', usage_today: 680, wastage_today: 0, closing_on_hand: 14889.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-24', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 4248, wastage_today: 0, closing_on_hand: 3662, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'VegMix_g', uom: 'g', usage_today: 3914, wastage_today: 0, closing_on_hand: 3456, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-24', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 160, wastage_today: 200, closing_on_hand: 1000, on_order_qty: 0, reorder_point: 797.81, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-24', ingredient: 'Wine_ml', uom: 'ml', usage_today: 2310, wastage_today: 0, closing_on_hand: 57421.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Anchovy_g', uom: 'g', usage_today: 25, wastage_today: 0, closing_on_hand: 490.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Beef_g', uom: 'g', usage_today: 2930, wastage_today: 0, closing_on_hand: 4370, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-25', ingredient: 'Beer_ml', uom: 'ml', usage_today: 15430, wastage_today: 0, closing_on_hand: 488180.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Bread_g', uom: 'g', usage_today: 990, wastage_today: 10, closing_on_hand: 1000, on_order_qty: 500, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 3, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-25', ingredient: 'Butter_g', uom: 'g', usage_today: 330, wastage_today: 0, closing_on_hand: 1017.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: true, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-25', ingredient: 'Chicken_g', uom: 'g', usage_today: 7066, wastage_today: 0, closing_on_hand: 20022, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Chocolate_g', uom: 'g', usage_today: 370, wastage_today: 0, closing_on_hand: 10896.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'CookingOil_g', uom: 'g', usage_today: 1315, wastage_today: 0, closing_on_hand: 26193.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Cream_ml', uom: 'ml', usage_today: 720, wastage_today: 0, closing_on_hand: 4400, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Egg_count', uom: 'count', usage_today: 18, wastage_today: 0, closing_on_hand: 46, on_order_qty: 84, reorder_point: 78.85, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Flour_g', uom: 'g', usage_today: 7740, wastage_today: 0, closing_on_hand: 169732.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Garlic_g', uom: 'g', usage_today: 113, wastage_today: 0, closing_on_hand: 545, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Lime_g', uom: 'g', usage_today: 405, wastage_today: 0, closing_on_hand: 770, on_order_qty: 0, reorder_point: 691.51, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Milk_ml', uom: 'ml', usage_today: 4980, wastage_today: 0, closing_on_hand: 8720, on_order_qty: 15000, reorder_point: 16142.47, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Mint_g', uom: 'g', usage_today: 10, wastage_today: 0, closing_on_hand: 475, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 4200, wastage_today: 0, closing_on_hand: 18656, on_order_qty: 0, reorder_point: 16356.82, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Mushroom_g', uom: 'g', usage_today: 420, wastage_today: 0, closing_on_hand: 600, on_order_qty: 0, reorder_point: 728.77, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-25', ingredient: 'OliveOil_g', uom: 'g', usage_today: 405, wastage_today: 0, closing_on_hand: 9263.05, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Onion_g', uom: 'g', usage_today: 542, wastage_today: 0, closing_on_hand: 1907, on_order_qty: 0, reorder_point: 955.53, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Parmesan_g', uom: 'g', usage_today: 40, wastage_today: 0, closing_on_hand: 341.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 82, expiry_warn_days: 5, expiry_flag: true, suggested_action: 'USE_FAST/DISCOUNT' },
  { date: '2026-04-25', ingredient: 'Pesto_g', uom: 'g', usage_today: 214, wastage_today: 0, closing_on_hand: 777, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Pita_g', uom: 'g', usage_today: 720, wastage_today: 0, closing_on_hand: 2174.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Pork_g', uom: 'g', usage_today: 1080, wastage_today: 0, closing_on_hand: 5818.63, on_order_qty: 9500, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Potato_g', uom: 'g', usage_today: 7400, wastage_today: 0, closing_on_hand: 24604.11, on_order_qty: 55000, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Salmon_g', uom: 'g', usage_today: 720, wastage_today: 0, closing_on_hand: 7276.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'SauceOther_g', uom: 'g', usage_today: 3831, wastage_today: 0, closing_on_hand: 9065, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Seafood_g', uom: 'g', usage_today: 1504, wastage_today: 0, closing_on_hand: 1906, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-25', ingredient: 'Soda_ml', uom: 'ml', usage_today: 16140, wastage_today: 0, closing_on_hand: 356552.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Soju_ml', uom: 'ml', usage_today: 5760, wastage_today: 0, closing_on_hand: 109282.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1755, wastage_today: 0, closing_on_hand: 37494.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'Sugar_g', uom: 'g', usage_today: 600, wastage_today: 0, closing_on_hand: 14289.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 2790, wastage_today: 0, closing_on_hand: 5372, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'VegMix_g', uom: 'g', usage_today: 2990, wastage_today: 0, closing_on_hand: 13966, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-25', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 320, wastage_today: 0, closing_on_hand: 680, on_order_qty: 0, reorder_point: 797.81, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-25', ingredient: 'Wine_ml', uom: 'ml', usage_today: 1800, wastage_today: 0, closing_on_hand: 55621.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Anchovy_g', uom: 'g', usage_today: 0, wastage_today: 0, closing_on_hand: 490.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Beef_g', uom: 'g', usage_today: 1740, wastage_today: 0, closing_on_hand: 10630, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Beer_ml', uom: 'ml', usage_today: 19440, wastage_today: 0, closing_on_hand: 468740.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Bread_g', uom: 'g', usage_today: 630, wastage_today: 370, closing_on_hand: 0, on_order_qty: 1500, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 3, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-26', ingredient: 'Butter_g', uom: 'g', usage_today: 410, wastage_today: 0, closing_on_hand: 607.67, on_order_qty: 2000, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Chicken_g', uom: 'g', usage_today: 4804, wastage_today: 0, closing_on_hand: 15218, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Chocolate_g', uom: 'g', usage_today: 680, wastage_today: 0, closing_on_hand: 10216.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'CookingOil_g', uom: 'g', usage_today: 770, wastage_today: 0, closing_on_hand: 25423.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Cream_ml', uom: 'ml', usage_today: 1380, wastage_today: 0, closing_on_hand: 3020, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: true, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-26', ingredient: 'Egg_count', uom: 'count', usage_today: 29, wastage_today: 0, closing_on_hand: 101, on_order_qty: 0, reorder_point: 78.85, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Flour_g', uom: 'g', usage_today: 7700, wastage_today: 0, closing_on_hand: 162032.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Garlic_g', uom: 'g', usage_today: 111.6, wastage_today: 0, closing_on_hand: 433.4, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Lime_g', uom: 'g', usage_today: 410, wastage_today: 0, closing_on_hand: 360, on_order_qty: 0, reorder_point: 691.51, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-26', ingredient: 'Milk_ml', uom: 'ml', usage_today: 3420, wastage_today: 0, closing_on_hand: 20300, on_order_qty: 0, reorder_point: 16142.47, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Mint_g', uom: 'g', usage_today: 30, wastage_today: 0, closing_on_hand: 445, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 4224, wastage_today: 0, closing_on_hand: 14432, on_order_qty: 0, reorder_point: 16356.82, reorder_flag: true, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-26', ingredient: 'Mushroom_g', uom: 'g', usage_today: 140, wastage_today: 0, closing_on_hand: 1960, on_order_qty: 0, reorder_point: 728.77, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'OliveOil_g', uom: 'g', usage_today: 386.6, wastage_today: 0, closing_on_hand: 8876.45, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Onion_g', uom: 'g', usage_today: 522, wastage_today: 0, closing_on_hand: 1385, on_order_qty: 0, reorder_point: 955.53, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Parmesan_g', uom: 'g', usage_today: 100, wastage_today: 0, closing_on_hand: 241.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 82, expiry_warn_days: 5, expiry_flag: true, suggested_action: 'REORDER; USE_FAST/DISCOUNT' },
  { date: '2026-04-26', ingredient: 'Pesto_g', uom: 'g', usage_today: 325, wastage_today: 0, closing_on_hand: 452, on_order_qty: 0, reorder_point: 480.96, reorder_flag: true, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-26', ingredient: 'Pita_g', uom: 'g', usage_today: 120, wastage_today: 0, closing_on_hand: 2054.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Pork_g', uom: 'g', usage_today: 1300, wastage_today: 0, closing_on_hand: 4518.63, on_order_qty: 9500, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Potato_g', uom: 'g', usage_today: 4300, wastage_today: 0, closing_on_hand: 20304.11, on_order_qty: 55000, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Salmon_g', uom: 'g', usage_today: 1350, wastage_today: 0, closing_on_hand: 5926.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: true, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-26', ingredient: 'SauceOther_g', uom: 'g', usage_today: 1825, wastage_today: 0, closing_on_hand: 7240, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Seafood_g', uom: 'g', usage_today: 1026, wastage_today: 880, closing_on_hand: 3000, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-26', ingredient: 'Soda_ml', uom: 'ml', usage_today: 15870, wastage_today: 0, closing_on_hand: 340682.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Soju_ml', uom: 'ml', usage_today: 3240, wastage_today: 0, closing_on_hand: 106042.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1410, wastage_today: 0, closing_on_hand: 36084.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'Sugar_g', uom: 'g', usage_today: 860, wastage_today: 0, closing_on_hand: 13429.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 2988, wastage_today: 0, closing_on_hand: 2384, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-26', ingredient: 'VegMix_g', uom: 'g', usage_today: 2670, wastage_today: 0, closing_on_hand: 11296, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-26', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 160, wastage_today: 520, closing_on_hand: 1000, on_order_qty: 0, reorder_point: 797.81, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-26', ingredient: 'Wine_ml', uom: 'ml', usage_today: 930, wastage_today: 0, closing_on_hand: 54691.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Anchovy_g', uom: 'g', usage_today: 0, wastage_today: 0, closing_on_hand: 490.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Beef_g', uom: 'g', usage_today: 1800, wastage_today: 830, closing_on_hand: 8000, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-27', ingredient: 'Beer_ml', uom: 'ml', usage_today: 16100, wastage_today: 0, closing_on_hand: 452640.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Bread_g', uom: 'g', usage_today: 630, wastage_today: 0, closing_on_hand: 2370, on_order_qty: 2000, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 1000, expiry_warn_days: 3, expiry_flag: true, suggested_action: 'REORDER; USE_FAST/DISCOUNT' },
  { date: '2026-04-27', ingredient: 'Butter_g', uom: 'g', usage_today: 240, wastage_today: 0, closing_on_hand: 2367.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Chicken_g', uom: 'g', usage_today: 5902, wastage_today: 0, closing_on_hand: 9316, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: true, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-27', ingredient: 'Chocolate_g', uom: 'g', usage_today: 340, wastage_today: 0, closing_on_hand: 9876.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'CookingOil_g', uom: 'g', usage_today: 1055, wastage_today: 0, closing_on_hand: 24368.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Cream_ml', uom: 'ml', usage_today: 840, wastage_today: 0, closing_on_hand: 2180, on_order_qty: 4000, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Egg_count', uom: 'count', usage_today: 15, wastage_today: 0, closing_on_hand: 86, on_order_qty: 0, reorder_point: 78.85, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Flour_g', uom: 'g', usage_today: 8170, wastage_today: 0, closing_on_hand: 153862.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Garlic_g', uom: 'g', usage_today: 117.6, wastage_today: 315.8, closing_on_hand: 0, on_order_qty: 0, reorder_point: 218.99, reorder_flag: true, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-27', ingredient: 'Lime_g', uom: 'g', usage_today: 270, wastage_today: 0, closing_on_hand: 1090, on_order_qty: 0, reorder_point: 691.51, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Milk_ml', uom: 'ml', usage_today: 3960, wastage_today: 0, closing_on_hand: 16340, on_order_qty: 0, reorder_point: 16142.47, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Mint_g', uom: 'g', usage_today: 10, wastage_today: 0, closing_on_hand: 435, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 4464, wastage_today: 0, closing_on_hand: 9968, on_order_qty: 14500, reorder_point: 16356.82, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Mushroom_g', uom: 'g', usage_today: 700, wastage_today: 0, closing_on_hand: 1260, on_order_qty: 0, reorder_point: 728.77, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'OliveOil_g', uom: 'g', usage_today: 402.6, wastage_today: 0, closing_on_hand: 8473.85, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Onion_g', uom: 'g', usage_today: 485, wastage_today: 0, closing_on_hand: 900, on_order_qty: 0, reorder_point: 955.53, reorder_flag: true, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-27', ingredient: 'Parmesan_g', uom: 'g', usage_today: 20, wastage_today: 0, closing_on_hand: 221.92, on_order_qty: 500, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 82, expiry_warn_days: 5, expiry_flag: true, suggested_action: 'USE_FAST/DISCOUNT' },
  { date: '2026-04-27', ingredient: 'Pesto_g', uom: 'g', usage_today: 296, wastage_today: 0, closing_on_hand: 1156, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Pita_g', uom: 'g', usage_today: 240, wastage_today: 0, closing_on_hand: 1814.79, on_order_qty: 0, reorder_point: 2012.05, reorder_flag: true, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-27', ingredient: 'Pork_g', uom: 'g', usage_today: 540, wastage_today: 0, closing_on_hand: 13478.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Potato_g', uom: 'g', usage_today: 5600, wastage_today: 0, closing_on_hand: 69704.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Salmon_g', uom: 'g', usage_today: 1260, wastage_today: 0, closing_on_hand: 4666.03, on_order_qty: 8500, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'SauceOther_g', uom: 'g', usage_today: 2549, wastage_today: 0, closing_on_hand: 4691, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: true, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-27', ingredient: 'Seafood_g', uom: 'g', usage_today: 1724, wastage_today: 0, closing_on_hand: 1276, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-27', ingredient: 'Soda_ml', uom: 'ml', usage_today: 15090, wastage_today: 0, closing_on_hand: 325592.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Soju_ml', uom: 'ml', usage_today: 6120, wastage_today: 0, closing_on_hand: 99922.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1245, wastage_today: 0, closing_on_hand: 34839.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'Sugar_g', uom: 'g', usage_today: 470, wastage_today: 0, closing_on_hand: 12959.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 2628, wastage_today: 0, closing_on_hand: 5256, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'VegMix_g', uom: 'g', usage_today: 3108, wastage_today: 0, closing_on_hand: 8188, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-27', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 640, wastage_today: 0, closing_on_hand: 360, on_order_qty: 0, reorder_point: 797.81, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-27', ingredient: 'Wine_ml', uom: 'ml', usage_today: 3240, wastage_today: 0, closing_on_hand: 51451.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Anchovy_g', uom: 'g', usage_today: 25, wastage_today: 0, closing_on_hand: 465.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: false, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Beef_g', uom: 'g', usage_today: 2660, wastage_today: 0, closing_on_hand: 5340, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Beer_ml', uom: 'ml', usage_today: 17420, wastage_today: 0, closing_on_hand: 435220.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Bread_g', uom: 'g', usage_today: 630, wastage_today: 0, closing_on_hand: 2740, on_order_qty: 1000, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 1000, expiry_warn_days: 3, expiry_flag: true, suggested_action: 'REORDER; USE_FAST/DISCOUNT' },
  { date: '2026-04-28', ingredient: 'Butter_g', uom: 'g', usage_today: 350, wastage_today: 0, closing_on_hand: 2017.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Chicken_g', uom: 'g', usage_today: 5826, wastage_today: 3490, closing_on_hand: 24500, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-28', ingredient: 'Chocolate_g', uom: 'g', usage_today: 485, wastage_today: 0, closing_on_hand: 9391.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'CookingOil_g', uom: 'g', usage_today: 960, wastage_today: 0, closing_on_hand: 23408.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Cream_ml', uom: 'ml', usage_today: 840, wastage_today: 0, closing_on_hand: 5340, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Egg_count', uom: 'count', usage_today: 16, wastage_today: 0, closing_on_hand: 70, on_order_qty: 0, reorder_point: 78.85, reorder_flag: true, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-28', ingredient: 'Flour_g', uom: 'g', usage_today: 7765, wastage_today: 0, closing_on_hand: 146097.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Garlic_g', uom: 'g', usage_today: 110, wastage_today: 0, closing_on_hand: 890, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Lime_g', uom: 'g', usage_today: 385, wastage_today: 0, closing_on_hand: 705, on_order_qty: 0, reorder_point: 691.51, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Milk_ml', uom: 'ml', usage_today: 4140, wastage_today: 0, closing_on_hand: 12200, on_order_qty: 0, reorder_point: 16142.47, reorder_flag: true, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-28', ingredient: 'Mint_g', uom: 'g', usage_today: 25, wastage_today: 410, closing_on_hand: 0, on_order_qty: 0, reorder_point: 42.74, reorder_flag: true, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-28', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 4248, wastage_today: 0, closing_on_hand: 20220, on_order_qty: 0, reorder_point: 16356.82, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Mushroom_g', uom: 'g', usage_today: 280, wastage_today: 0, closing_on_hand: 980, on_order_qty: 0, reorder_point: 728.77, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'OliveOil_g', uom: 'g', usage_today: 358.2, wastage_today: 0, closing_on_hand: 8115.65, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Onion_g', uom: 'g', usage_today: 467, wastage_today: 0, closing_on_hand: 1933, on_order_qty: 0, reorder_point: 955.53, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Parmesan_g', uom: 'g', usage_today: 100, wastage_today: 0, closing_on_hand: 621.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 82, expiry_warn_days: 5, expiry_flag: true, suggested_action: 'USE_FAST/DISCOUNT' },
  { date: '2026-04-28', ingredient: 'Pesto_g', uom: 'g', usage_today: 208, wastage_today: 0, closing_on_hand: 948, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Pita_g', uom: 'g', usage_today: 480, wastage_today: 0, closing_on_hand: 1334.79, on_order_qty: 3000, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Pork_g', uom: 'g', usage_today: 1720, wastage_today: 0, closing_on_hand: 11758.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Potato_g', uom: 'g', usage_today: 4850, wastage_today: 0, closing_on_hand: 64854.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Salmon_g', uom: 'g', usage_today: 360, wastage_today: 0, closing_on_hand: 4306.03, on_order_qty: 8500, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'SauceOther_g', uom: 'g', usage_today: 2981, wastage_today: 0, closing_on_hand: 12210, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Seafood_g', uom: 'g', usage_today: 1160, wastage_today: 116, closing_on_hand: 3500, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-28', ingredient: 'Soda_ml', uom: 'ml', usage_today: 14040, wastage_today: 0, closing_on_hand: 311552.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Soju_ml', uom: 'ml', usage_today: 3960, wastage_today: 0, closing_on_hand: 95962.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1365, wastage_today: 0, closing_on_hand: 33474.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'Sugar_g', uom: 'g', usage_today: 680, wastage_today: 0, closing_on_hand: 12279.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-28', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 2826, wastage_today: 0, closing_on_hand: 2430, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-28', ingredient: 'VegMix_g', uom: 'g', usage_today: 2138, wastage_today: 0, closing_on_hand: 6050, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-28', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 320, wastage_today: 40, closing_on_hand: 1000, on_order_qty: 0, reorder_point: 797.81, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'SPOILAGE_WRITE_OFF' },
  { date: '2026-04-28', ingredient: 'Wine_ml', uom: 'ml', usage_today: 1800, wastage_today: 0, closing_on_hand: 49651.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Anchovy_g', uom: 'g', usage_today: 100, wastage_today: 0, closing_on_hand: 365.41, on_order_qty: 0, reorder_point: 380.14, reorder_flag: true, earliest_expiry_date: '2026-08-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-29', ingredient: 'Beef_g', uom: 'g', usage_today: 2650, wastage_today: 0, closing_on_hand: 2690, on_order_qty: 0, reorder_point: 4770.68, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 2690, expiry_warn_days: 1, expiry_flag: true, suggested_action: 'REORDER; USE_FAST/DISCOUNT' },
  { date: '2026-04-29', ingredient: 'Beer_ml', uom: 'ml', usage_today: 12590, wastage_today: 0, closing_on_hand: 422630.68, on_order_qty: 0, reorder_point: 323929.18, reorder_flag: false, earliest_expiry_date: '2027-03-10', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Bread_g', uom: 'g', usage_today: 720, wastage_today: 1020, closing_on_hand: 2000, on_order_qty: 0, reorder_point: 7163.01, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 1000, expiry_warn_days: 3, expiry_flag: true, suggested_action: 'REORDER; USE_FAST/DISCOUNT; SPOILAGE_WRITE_OFF' },
  { date: '2026-04-29', ingredient: 'Butter_g', uom: 'g', usage_today: 340, wastage_today: 0, closing_on_hand: 1677.67, on_order_qty: 0, reorder_point: 1195.07, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Chicken_g', uom: 'g', usage_today: 4748, wastage_today: 0, closing_on_hand: 19752, on_order_qty: 0, reorder_point: 13473.64, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Chocolate_g', uom: 'g', usage_today: 520, wastage_today: 0, closing_on_hand: 8871.58, on_order_qty: 0, reorder_point: 4332.19, reorder_flag: false, earliest_expiry_date: '2026-08-25', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'CookingOil_g', uom: 'g', usage_today: 1000, wastage_today: 0, closing_on_hand: 22408.84, on_order_qty: 0, reorder_point: 11997.95, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Cream_ml', uom: 'ml', usage_today: 1080, wastage_today: 0, closing_on_hand: 4260, on_order_qty: 0, reorder_point: 4007.67, reorder_flag: false, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Egg_count', uom: 'count', usage_today: 22, wastage_today: 0, closing_on_hand: 48, on_order_qty: 72, reorder_point: 78.85, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 5, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Flour_g', uom: 'g', usage_today: 7200, wastage_today: 0, closing_on_hand: 138897.33, on_order_qty: 0, reorder_point: 75954.11, reorder_flag: false, earliest_expiry_date: '2026-06-02', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Garlic_g', uom: 'g', usage_today: 101.8, wastage_today: 0, closing_on_hand: 788.2, on_order_qty: 0, reorder_point: 218.99, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Lime_g', uom: 'g', usage_today: 365, wastage_today: 0, closing_on_hand: 340, on_order_qty: 0, reorder_point: 691.51, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-29', ingredient: 'Milk_ml', uom: 'ml', usage_today: 4080, wastage_today: 0, closing_on_hand: 8120, on_order_qty: 17000, reorder_point: 16142.47, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Mint_g', uom: 'g', usage_today: 25, wastage_today: 0, closing_on_hand: 475, on_order_qty: 0, reorder_point: 42.74, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Mozzarella_g', uom: 'g', usage_today: 3888, wastage_today: 0, closing_on_hand: 16332, on_order_qty: 0, reorder_point: 16356.82, reorder_flag: true, earliest_expiry_date: null, qty_expiring_within_warn: 0, expiry_warn_days: 2, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-29', ingredient: 'Mushroom_g', uom: 'g', usage_today: 560, wastage_today: 0, closing_on_hand: 420, on_order_qty: 0, reorder_point: 728.77, reorder_flag: true, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: 'REORDER' },
  { date: '2026-04-29', ingredient: 'OliveOil_g', uom: 'g', usage_today: 344.2, wastage_today: 0, closing_on_hand: 7771.45, on_order_qty: 0, reorder_point: 3774.08, reorder_flag: false, earliest_expiry_date: '2026-06-29', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Onion_g', uom: 'g', usage_today: 481, wastage_today: 0, closing_on_hand: 1452, on_order_qty: 0, reorder_point: 955.53, reorder_flag: false, earliest_expiry_date: '2026-05-03', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Parmesan_g', uom: 'g', usage_today: 40, wastage_today: 0, closing_on_hand: 581.92, on_order_qty: 0, reorder_point: 248.77, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 82, expiry_warn_days: 5, expiry_flag: true, suggested_action: 'USE_FAST/DISCOUNT' },
  { date: '2026-04-29', ingredient: 'Pesto_g', uom: 'g', usage_today: 125, wastage_today: 0, closing_on_hand: 823, on_order_qty: 0, reorder_point: 480.96, reorder_flag: false, earliest_expiry_date: '2026-05-02', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Pita_g', uom: 'g', usage_today: 120, wastage_today: 0, closing_on_hand: 1214.79, on_order_qty: 3000, reorder_point: 2012.05, reorder_flag: false, earliest_expiry_date: '2026-05-10', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Pork_g', uom: 'g', usage_today: 940, wastage_today: 0, closing_on_hand: 10818.63, on_order_qty: 0, reorder_point: 6933.7, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Potato_g', uom: 'g', usage_today: 6250, wastage_today: 0, closing_on_hand: 58604.11, on_order_qty: 0, reorder_point: 37158.9, reorder_flag: false, earliest_expiry_date: '2026-05-20', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Salmon_g', uom: 'g', usage_today: 180, wastage_today: 0, closing_on_hand: 12626.03, on_order_qty: 0, reorder_point: 6139.73, reorder_flag: false, earliest_expiry_date: '2026-05-19', qty_expiring_within_warn: 0, expiry_warn_days: 7, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'SauceOther_g', uom: 'g', usage_today: 2705, wastage_today: 0, closing_on_hand: 9505, on_order_qty: 0, reorder_point: 6047.34, reorder_flag: false, earliest_expiry_date: '2026-05-05', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Seafood_g', uom: 'g', usage_today: 768, wastage_today: 0, closing_on_hand: 2732, on_order_qty: 0, reorder_point: 2937.64, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 2732, expiry_warn_days: 1, expiry_flag: true, suggested_action: 'REORDER; USE_FAST/DISCOUNT' },
  { date: '2026-04-29', ingredient: 'Soda_ml', uom: 'ml', usage_today: 15660, wastage_today: 0, closing_on_hand: 295892.6, on_order_qty: 0, reorder_point: 160257.53, reorder_flag: false, earliest_expiry_date: '2026-05-30', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Soju_ml', uom: 'ml', usage_today: 1800, wastage_today: 0, closing_on_hand: 94162.19, on_order_qty: 0, reorder_point: 70461.37, reorder_flag: false, earliest_expiry_date: '2027-03-09', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Spirits_ml', uom: 'ml', usage_today: 1140, wastage_today: 0, closing_on_hand: 32334.52, on_order_qty: 0, reorder_point: 24201.58, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'Sugar_g', uom: 'g', usage_today: 630, wastage_today: 0, closing_on_hand: 11649.04, on_order_qty: 0, reorder_point: 5663.01, reorder_flag: false, earliest_expiry_date: '2027-02-28', qty_expiring_within_warn: 0, expiry_warn_days: 14, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'TomatoSauce_g', uom: 'g', usage_today: 2376, wastage_today: 0, closing_on_hand: 5554, on_order_qty: 0, reorder_point: 5236.27, reorder_flag: false, earliest_expiry_date: '2026-05-01', qty_expiring_within_warn: 0, expiry_warn_days: 1, expiry_flag: false, suggested_action: null },
  { date: '2026-04-29', ingredient: 'VegMix_g', uom: 'g', usage_today: 3112, wastage_today: 0, closing_on_hand: 13938, on_order_qty: 0, reorder_point: 6644.66, reorder_flag: false, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 2938, expiry_warn_days: 1, expiry_flag: true, suggested_action: 'USE_FAST/DISCOUNT' },
  { date: '2026-04-29', ingredient: 'WhiteSauce_g', uom: 'g', usage_today: 480, wastage_today: 0, closing_on_hand: 520, on_order_qty: 0, reorder_point: 797.81, reorder_flag: true, earliest_expiry_date: '2026-04-30', qty_expiring_within_warn: 520, expiry_warn_days: 1, expiry_flag: true, suggested_action: 'REORDER; USE_FAST/DISCOUNT' },
  { date: '2026-04-29', ingredient: 'Wine_ml', uom: 'ml', usage_today: 420, wastage_today: 0, closing_on_hand: 49231.78, on_order_qty: 0, reorder_point: 34449.86, reorder_flag: false, earliest_expiry_date: '2027-03-07', qty_expiring_within_warn: 0, expiry_warn_days: 30, expiry_flag: false, suggested_action: null },

      ];

      const { data: insertedInventory, error: inventoryError } = await supabase
        .from('inventory_daily_status')
        .insert(inventoryData)
        .select();

      if (inventoryError) throw inventoryError;

      setInventoryStatusResults({
        success: true,
        records: insertedInventory?.length || 0,
        message: `Successfully imported ${insertedInventory?.length} inventory daily status records! (Apr 20-29, 2026)`
      });

    } catch (error: any) {
      setInventoryStatusResults({
        success: false,
        error: error.message
      });
    } finally {
      setImportingInventoryStatus(false);
    }
  };

  const syncInventoryFromStatus = async () => {
    setSyncingInventory(true);
    setSyncResults(null);
    
    try {
      // Get the latest inventory status (April 29, 2026)
      const { data: latestStatus, error: fetchError } = await supabase
        .from('inventory_daily_status')
        .select('ingredient, closing_on_hand')
        .eq('date', '2026-04-29');

      if (fetchError) throw fetchError;
      if (!latestStatus || latestStatus.length === 0) {
        throw new Error('No inventory status data found for April 29, 2026');
      }

      // Update each ingredient's current_stock
      let updatedCount = 0;
      for (const item of latestStatus) {
        const { error: updateError } = await supabase
          .from('ingredients')
          .update({ current_stock: item.closing_on_hand })
          .eq('name', item.ingredient);

        if (updateError) {
          console.error(`Failed to update ${item.ingredient}:`, updateError);
        } else {
          updatedCount++;
        }
      }

      setSyncResults({
        success: true,
        records: updatedCount,
        message: `Successfully synced ${updatedCount} ingredients from April 29, 2026 inventory status!`
      });

    } catch (error: any) {
      setSyncResults({
        success: false,
        error: error.message
      });
    } finally {
      setSyncingInventory(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-amber-900 mb-8">📊 Data Import</h1>
        
        {/* Menu Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Menu Data</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import all 50 menu items (food and drinks) into the database.
          </p>
          
          <Button
            onClick={importMenuData}
            disabled={importingMenu}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingMenu ? 'Importing...' : 'Import Menu Data'}
          </Button>

          {menuResults && (
            <div className={`mt-6 p-6 rounded-lg ${menuResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {menuResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{menuResults.message}</p>
                  <p className="text-green-700 mt-2">Menu Items: <strong>{menuResults.menuItems}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{menuResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Ingredients Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Ingredients Data</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import all 35 ingredients (raw materials) into the database.
          </p>
          
          <Button
            onClick={importIngredientsData}
            disabled={importingIngredients}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingIngredients ? 'Importing...' : 'Import Ingredients Data'}
          </Button>

          {ingredientsResults && (
            <div className={`mt-6 p-6 rounded-lg ${ingredientsResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {ingredientsResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{ingredientsResults.message}</p>
                  <p className="text-green-700 mt-2">Ingredients: <strong>{ingredientsResults.ingredients}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{ingredientsResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Recipes Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Recipe Ingredients</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import all recipe mappings (which ingredients are needed for each menu item).
          </p>
          
          <Button
            onClick={importRecipesData}
            disabled={importingRecipes}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingRecipes ? 'Importing...' : 'Import Recipe Ingredients'}
          </Button>

          {recipesResults && (
            <div className={`mt-6 p-6 rounded-lg ${recipesResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {recipesResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{recipesResults.message}</p>
                  <p className="text-green-700 mt-2">Recipe Links: <strong>{recipesResults.recipes}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{recipesResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Daily Sales Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Daily Item Sales</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import daily sales records by menu item (quantity sold, revenue, COGS, and profit).
          </p>
          
          <Button
            onClick={importDailySalesData}
            disabled={importingSales}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingSales ? 'Importing...' : 'Import Daily Sales Data'}
          </Button>

          {salesResults && (
            <div className={`mt-6 p-6 rounded-lg ${salesResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {salesResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{salesResults.message}</p>
                  <p className="text-green-700 mt-2">Sales Records: <strong>{salesResults.itemSales}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{salesResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Daily Summaries Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Daily Summaries</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import daily P&L summaries including sales, costs, expenses, and operating profit.
          </p>
          
          <Button
            onClick={importDailySummariesData}
            disabled={importingSummaries}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingSummaries ? 'Importing...' : 'Import Daily Summaries'}
          </Button>

          {summariesResults && (
            <div className={`mt-6 p-6 rounded-lg ${summariesResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {summariesResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{summariesResults.message}</p>
                  <p className="text-green-700 mt-2">Summary Records: <strong>{summariesResults.summaries}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{summariesResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Daily Ingredient Usage Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Daily Ingredient Usage</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import daily ingredient consumption records (sample: 12 records from Feb 1-3).
          </p>
          
          <Button
            onClick={importDailyIngredientUsage}
            disabled={importingUsage}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingUsage ? 'Importing...' : 'Import Ingredient Usage'}
          </Button>

          {usageResults && (
            <div className={`mt-6 p-6 rounded-lg ${usageResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {usageResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{usageResults.message}</p>
                  <p className="text-green-700 mt-2">Usage Records: <strong>{usageResults.records}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{usageResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Inventory Alerts Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Inventory Alerts</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import reorder alerts and expiry warnings (sample: 6 records from Feb 1-3).
          </p>
          
          <Button
            onClick={importInventoryAlerts}
            disabled={importingAlerts}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingAlerts ? 'Importing...' : 'Import Inventory Alerts'}
          </Button>

          {alertsResults && (
            <div className={`mt-6 p-6 rounded-lg ${alertsResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {alertsResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{alertsResults.message}</p>
                  <p className="text-green-700 mt-2">Alert Records: <strong>{alertsResults.records}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{alertsResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Purchase Orders Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Purchase Orders</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import ingredient reorder history (sample: 6 purchase orders).
          </p>
          
          <Button
            onClick={importPurchaseOrders}
            disabled={importingPurchaseOrders}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingPurchaseOrders ? 'Importing...' : 'Import Purchase Orders'}
          </Button>

          {purchaseOrdersResults && (
            <div className={`mt-6 p-6 rounded-lg ${purchaseOrdersResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {purchaseOrdersResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{purchaseOrdersResults.message}</p>
                  <p className="text-green-700 mt-2">Purchase Orders: <strong>{purchaseOrdersResults.records}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{purchaseOrdersResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Payroll Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Import Payroll Data</h2>
          <p className="text-lg text-amber-800 mb-6">
            This will import employee salary information (9 roles, total: ₭8,540,000/month).
          </p>
          
          <Button
            onClick={importPayroll}
            disabled={importingPayroll}
            className="text-xl px-10 py-6 bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg"
          >
            {importingPayroll ? 'Importing...' : 'Import Payroll Data'}
          </Button>

          {payrollResults && (
            <div className={`mt-6 p-6 rounded-lg ${payrollResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {payrollResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{payrollResults.message}</p>
                  <p className="text-green-700 mt-2">Payroll Records: <strong>{payrollResults.records}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{payrollResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Inventory Daily Status Import Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-green-800">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Import Inventory Daily Status</h2>
          <p className="text-lg text-green-800 mb-6">
            This will import 350 inventory tracking records (Apr 20-29, 2026: 35 ingredients × 10 days).
          </p>
          
          <Button
            onClick={importInventoryDailyStatus}
            disabled={importingInventoryStatus}
            className="text-xl px-10 py-6 bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg"
          >
            {importingInventoryStatus ? 'Importing...' : 'Import Inventory Status'}
          </Button>

          {inventoryStatusResults && (
            <div className={`mt-6 p-6 rounded-lg ${inventoryStatusResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {inventoryStatusResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{inventoryStatusResults.message}</p>
                  <p className="text-green-700 mt-2">Inventory Records: <strong>{inventoryStatusResults.records}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{inventoryStatusResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sync Inventory Current Stock Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-blue-800">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">🔄 Sync Current Inventory</h2>
          <p className="text-lg text-blue-800 mb-6">
            This will update the Inventory page with current stock levels from the latest imported data (Apr 29, 2026).
          </p>
          
          <Button
            onClick={syncInventoryFromStatus}
            disabled={syncingInventory}
            className="text-xl px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg"
          >
            {syncingInventory ? 'Syncing...' : 'Sync Inventory Stock Levels'}
          </Button>

          {syncResults && (
            <div className={`mt-6 p-6 rounded-lg ${syncResults.success ? 'bg-green-50 border-2 border-green-600' : 'bg-red-50 border-2 border-red-600'}`}>
              {syncResults.success ? (
                <>
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ Success!</h3>
                  <p className="text-lg text-green-800">{syncResults.message}</p>
                  <p className="text-green-700 mt-2">Updated Ingredients: <strong>{syncResults.records}</strong></p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-lg text-red-800">{syncResults.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold text-lg"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
