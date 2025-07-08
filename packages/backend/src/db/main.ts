// src/main.ts (או הנתיב המקורי של הקובץ)

import { createClient } from "@supabase/supabase-js";
import { StoreRepository } from "./Repositories/storeRepository";
import { UserRepository } from "./Repositories/userRepository";
import { PriceRepository } from "./Repositories/priceRepository";
import { ItemRepository } from "./Repositories/itemRepository"; // ייבוא חדש
import { PromotionRepository } from "./Repositories/promotionRepository"; // ייבוא חדש
import { TagRepository } from "./Repositories/tagRepository"; // ייבוא חדש
import { saveSampleDataToDb } from "./saveSampleStoreToDb"; // שינוי שם הפונקציה

// הכניסי כאן את ה-URL וה-KEY שלך (ודאי שהם עדיין רלוונטיים)
const SUPABASE_URL = "https://xoherohwhkougweafxfo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvaGVyb2h3aGtvdWd3ZWFmeGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODUxODcsImV4cCI6MjA2NjE2MTE4N30.wgpUMQrwXJ5Px53n3M1UYr0wjewFWd6t-xtYGVY7Tf0";

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // יצירת מופעים לכל הרפוזיטורים
  const storeRepo = new StoreRepository(supabase);
  const userRepo = new UserRepository(supabase);
  const priceRepo = new PriceRepository(supabase);
  const itemRepo = new ItemRepository(supabase); // רפוזיטורי חדש
  const promotionRepo = new PromotionRepository(supabase); // רפוזיטורי חדש
  const tagRepo = new TagRepository(supabase); // רפוזיטורי חדש

  try {
    // קריאה לפונקציה המעודכנת עם כל הרפוזיטורים
    const result = await saveSampleDataToDb(
      storeRepo,
      userRepo,
      priceRepo,
      itemRepo,
      promotionRepo,
      tagRepo
    );
    console.log("Sample data saved successfully:", result);
  } catch (err) {
    console.error("Error saving sample data:", err);
  }
}

main();