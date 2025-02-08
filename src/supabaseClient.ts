import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tjcgzpmrnuhbhxnngsbm.supabase.co"; // Remplace par ton URL Supabase
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqY2d6cG1ybnVoYmh4bm5nc2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMDc3NzAsImV4cCI6MjA1NDU4Mzc3MH0.J7FNd7E9tntxN99QYFbcf6Whxxj__3hmS3WqCKlQL34"; // Remplace par ta clé publique

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
