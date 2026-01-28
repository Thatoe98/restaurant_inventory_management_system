export type Database = {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string;
          name: string;
          unit: string;
          cost_per_unit: number;
          current_stock: number;
          min_stock_threshold: number;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          unit: string;
          cost_per_unit?: number;
          current_stock?: number;
          min_stock_threshold?: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          unit?: string;
          cost_per_unit?: number;
          current_stock?: number;
          min_stock_threshold?: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          menu_type: string;
          section: string;
          unit_price: number;
          unit_cost: number;
          unit_gp: number;
          cost_percentage: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          menu_type: string;
          section: string;
          unit_price: number;
          unit_cost: number;
          unit_gp: number;
          cost_percentage?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          menu_type?: string;
          section?: string;
          unit_price?: number;
          unit_cost?: number;
          unit_gp?: number;
          cost_percentage?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipe_ingredients: {
        Row: {
          id: string;
          menu_item_id: string;
          ingredient_name: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_item_id: string;
          ingredient_name: string;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_item_id?: string;
          ingredient_name?: string;
          quantity?: number;
          created_at?: string;
        };
      };
      daily_item_sales: {
        Row: {
          id: string;
          date: string;
          day_of_week: string;
          is_open: boolean;
          item_id: string;
          quantity_sold: number;
          sales_amount: number;
          cogs_amount: number;
          gross_profit: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          day_of_week: string;
          is_open?: boolean;
          item_id: string;
          quantity_sold?: number;
          sales_amount?: number;
          cogs_amount?: number;
          gross_profit?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          day_of_week?: string;
          is_open?: boolean;
          item_id?: string;
          quantity_sold?: number;
          sales_amount?: number;
          cogs_amount?: number;
          gross_profit?: number;
          created_at?: string;
        };
      };
      daily_summaries: {
        Row: {
          id: string;
          date: string;
          day_of_week: string;
          is_open: boolean;
          open_hours: string | null;
          hours_open: number | null;
          covers: number;
          net_sales: number;
          cogs: number;
          gross_profit: number;
          rent: number;
          waiters_salaries: number;
          chefs_salaries: number;
          other_staff_salaries: number;
          electricity_grid: number;
          generator_fuel: number;
          marketing_social: number;
          maintenance_sanitation: number;
          consumables: number;
          fixed_opex_total: number;
          card_fees: number;
          bank_charges: number;
          total_opex: number;
          operating_profit: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          day_of_week: string;
          is_open?: boolean;
          open_hours?: string | null;
          hours_open?: number | null;
          covers?: number;
          net_sales?: number;
          cogs?: number;
          gross_profit?: number;
          rent?: number;
          waiters_salaries?: number;
          chefs_salaries?: number;
          other_staff_salaries?: number;
          electricity_grid?: number;
          generator_fuel?: number;
          marketing_social?: number;
          maintenance_sanitation?: number;
          consumables?: number;
          fixed_opex_total?: number;
          card_fees?: number;
          bank_charges?: number;
          total_opex?: number;
          operating_profit?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          day_of_week?: string;
          is_open?: boolean;
          open_hours?: string | null;
          hours_open?: number | null;
          covers?: number;
          net_sales?: number;
          cogs?: number;
          gross_profit?: number;
          rent?: number;
          waiters_salaries?: number;
          chefs_salaries?: number;
          other_staff_salaries?: number;
          electricity_grid?: number;
          generator_fuel?: number;
          marketing_social?: number;
          maintenance_sanitation?: number;
          consumables?: number;
          fixed_opex_total?: number;
          card_fees?: number;
          bank_charges?: number;
          total_opex?: number;
          operating_profit?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
      cashbook_transactions: {
        Row: {
          id: string;
          txn_id: string | null;
          date: string;
          description: string;
          inflow: number;
          outflow: number;
          category: string;
          reference: string | null;
          running_balance: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          txn_id?: string | null;
          date: string;
          description: string;
          inflow?: number;
          outflow?: number;
          category: string;
          reference?: string | null;
          running_balance?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          txn_id?: string | null;
          date?: string;
          description?: string;
          inflow?: number;
          outflow?: number;
          category?: string;
          reference?: string | null;
          running_balance?: number | null;
          created_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          name: string;
          category: string;
          unit: string;
          is_high_value: boolean;
          min_stock_threshold: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          unit: string;
          is_high_value?: boolean;
          min_stock_threshold?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          unit?: string;
          is_high_value?: boolean;
          min_stock_threshold?: number;
          created_at?: string;
        };
      };
      batches: {
        Row: {
          id: string;
          item_id: string;
          quantity_remaining: number;
          expiry_date: string | null;
          cost_price: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          quantity_remaining: number;
          expiry_date?: string | null;
          cost_price?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          quantity_remaining?: number;
          expiry_date?: string | null;
          cost_price?: number | null;
          created_at?: string;
        };
      };
      transaction_logs: {
        Row: {
          id: string;
          item_id: string;
          action_type: 'INBOUND' | 'USAGE' | 'AUDIT_CORRECTION' | 'WASTE';
          quantity_change: number;
          performed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          action_type: 'INBOUND' | 'USAGE' | 'AUDIT_CORRECTION' | 'WASTE';
          quantity_change: number;
          performed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          action_type?: 'INBOUND' | 'USAGE' | 'AUDIT_CORRECTION' | 'WASTE';
          quantity_change?: number;
          performed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

// Computed types for UI
export type ItemWithStock = Database['public']['Tables']['items']['Row'] & {
  total_stock: number;
  nearest_expiry: string | null;
  has_low_stock: boolean;
  has_expiring_soon: boolean;
};

export type MenuItemWithSales = Database['public']['Tables']['menu_items']['Row'] & {
  total_sales: number;
  total_quantity: number;
  total_profit: number;
};

export type IngredientWithConsumption = Database['public']['Tables']['ingredients']['Row'] & {
  consumption: number;
  stock_level_days: number;
};

export type DashboardStats = {
  todaySales: number;
  todayProfit: number;
  todayCovers: number;
  monthSales: number;
  monthProfit: number;
  lowStockItems: number;
  topSellingItem: string;
};

export type BatchWithItem = Database['public']['Tables']['batches']['Row'] & {
  item: Database['public']['Tables']['items']['Row'];
};

export type TransactionLogWithItem = Database['public']['Tables']['transaction_logs']['Row'] & {
  item: Database['public']['Tables']['items']['Row'];
};
