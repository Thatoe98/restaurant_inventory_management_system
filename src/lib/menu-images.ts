// Helper function to get image path for menu items
export function getMenuItemImage(itemName: string): string {
  // Map item names to image filenames
  const imageMap: Record<string, string> = {
    "Margherita (Tomato Sauce, Cheese & Basil)": "Margherita (Tomato Sauce, Cheese & Basil).jpg",
    "Mixed Veggie (Bell Pepper, Spinach, Onion, Tomato, Corn, Black Olive, Pesto)": "Mixed Veggie (Bell Pepper, Spinach, Onion, Tomato, Corn, Black Olive, Pesto).jpg",
    "White Mushroom (White Sauce, Mixed Mushroom, Rocket Salad)": "White Mushroom (White Sauce, Mixed Mushroom, Rocket Salad).jpg",
    "Yan'kin House (Chicken, Pesto, Black Olive, Rocket Salad)": "Yan_kin House (Chicken, Pesto, Black Olive, Rocket Salad).jpg",
    "Mont Blanc (Pork Ham, Bacon, Parmesan, Rocket Salad)": "Mont Blanc (Pork Ham, Bacon, Parmesan, Rocket Salad).jpeg",
    "Anchovies (Italian Anchovie, Capers, Black Olive)": "Anchovies (Italian Anchovie, Capers, Black Olive).jpg",
    "Seafood (Mixed Seafood, Pesto, Garlic, Black Olive)": "Seafood (Mixed Seafood, Pesto, Garlic, Black Olive).jpg",
    "Hokkaido (Salmon, Prawn, Onion, Garlic, Pesto)": "Hokkaido (Salmon, Prawn, Onion, Garlic, Pesto).webp",
    "Buffalo Bill (Beef Tenderloin, Bell Pepper, Onion, Garlic, Rocket Salad)": "Buffalo Bill (Beef Tenderloin, Bell Pepper, Onion, Garlic, Rocket Salad).jpg",
    "Baby Face (White Sauce, Minced Beef, Black Olives, Rocket Salad)": "Baby Face (White Sauce, Minced Beef, Black Olives, Rocket Salad).webp",
    "Olivia (Onion, Garlic & Black Olive)": "Olivia (Onion, Garlic & Black Olive).jpg",
    "Mini Veggie (Mixed Veggie, Black Olive & Pesto)": "Mini Veggie (Mixed Veggie, Black Olive & Pesto).jpg",
    "Havana (Chicken, Corn, Coriander & Mixed Chillies)": "Havana (Chicken, Corn, Coriander & Mixed Chillies).jpg",
    "Rio (Beef, Onion, Garlic, Black Pepper & Mixed Chillies)": "Rio (Beef, Onion, Garlic, Black Pepper & Mixed Chillies).jpg",
    "Mauritius (Mixed Seafood, Pesto, Garlic & Black Olive)": "Mauritius (Mixed Seafood, Pesto, Garlic & Black Olive).jpg",
    "Greek Bruschetta (Ricotta, Tomato, Onion, Black Olive & Pesto)": "Greek Bruschetta (Ricotta, Tomato, Onion, Black Olive & Pesto).jpg",
    "Yangon Eggplant Bruschetta (Eggplant, Tomato, Onion, Garlic, Coriander & Sesame Oil)": "Yangon Eggplant Bruschetta (Eggplant, Tomato, Onion, Garlic, Coriander & Sesame Oil).jpg",
    "Cucumber & Sesame Oil": "Cucumber & Sesame Oil.jpg",
    "Potato Fries": "Potato Fries.jpg",
    "Boneless Fried Chicken": "Boneless Fried Chicken.jpg",
    "Chicken Wings": "Chicken Wings.jpg",
    "Dried Beef Jerky (Myanmar Style)": "Dried Beef Jerky (Myanmar Style).jpg",
    "Smoked Pork Belly": "Smoked Pork Belly.jpg",
    "Beirut (Hummus, Chicken Kofta, Pita & Condiments)": "Beirut (Hummus, Chicken Kofta, Pita & Condiments).jpg",
    "Beef Tenderloin & Gravy": "Beef Tenderloin & Gravy.jpg",
    "Salmon Salt & Pepper": "Salmon Salt & Pepper.jpg",
    "Fish and Chips (Fried Seabass, Fries, Pink Tartar Sauce)": "Fish and Chips (Fried Seabass, Fries, Pink Tartar Sauce).jpg",
    "Chicken Schnitzel II (Creamy Spinach, Fries, Pink Tartar Sauce)": "Chicken Schnitzel II (Creamy Spinach, Fries, Pink Tartar Sauce).jpg",
    "French Stew & Steamed Potato (Slow Cooked Beef Tongue, Red Wine Sauce)": "French Stew & Steamed Potato (Slow Cooked Beef Tongue, Red Wine Sauce).jpg",
    "Fry'kin Platter (Wings, Samosa, Spring Rolls, Bayarkyaw, Corn Tempura)": "Fry_kin Platter (Wings, Samosa, Spring Rolls, Bayarkyaw, Corn Tempura).jpg",
    "Brownie & Vanilla Ice Cream": "Brownie & Vanilla Ice Cream.jpg",
    "Chocolate Mousse": "Chocolate Mousse.jpg",
    "Plain Milk": "Plain Milk.jpg",
    "Coca-Cola": "Coca-Cola.jpg",
    "Heineken (Draught 50cl)": "Heineken (Draught 50cl).jpg",
    "Tiger (Draught 50cl)": "Tiger (Draught 50cl).jpg",
    "Heineken (Bottle)": "Heineken (Bottle).png",
    "Tiger Crystal (Bottle)": "Tiger Crystal (Bottle).jpg",
    "Hoegaarden (Bottle)": "Hoegaarden (Bottle).jpg",
    "Chum-Churum Original Soju (0.36L)": "Chum-Churum Original Soju (0.36L).webp",
    "House Red Wine (Glass)": "House Red Wine (Glass).jpg",
    "Catena Cabernet Sauvignon (Bottle)": "Catena Cabernet Sauvignon (Bottle).jpg",
    "Jägermeister (Shot)": "Jägermeister (Shot).jpg",
    "Jack Daniel's (Glass)": "Jack Daniel_s (Glass).jpeg",
    "Glenfiddich 12 (Glass)": "Glenfiddich 12 (Glass).jpg",
    "Glenfiddich 15 (Glass)": "Glenfiddich 15 (Glass).webp",
    "Gin & Tonic": "Gin & Tonic.jpg",
    "Whisky Sour": "Whisky Sour.jpg",
    "Mojito": "Mojito.webp",
    "Long Island Iced Tea": "Long Island Iced Tea.jpg",
  };

  const filename = imageMap[itemName];
  if (filename) {
    return `/menu-images/${filename}`;
  }
  
  // Fallback to template image
  return '/menu-images/templete.jpg';
}
