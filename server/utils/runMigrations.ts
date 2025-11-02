import { migrate } from "drizzle-orm/mysql2/migrator";
import { getDb } from "../db";

export async function runMigrations() {
  console.log("🚀 [MIGRATIONS] Iniciando processo de migrations...");
  
  try {
    const db = await getDb();
    if (!db) {
      console.error("❌ [MIGRATIONS] Database not available for migrations");
      throw new Error("Database not available");
    }

    console.log("✅ [MIGRATIONS] Database conectado com sucesso!");
    console.log("🔄 [MIGRATIONS] Executando migrations do Drizzle ORM...");

    // Executar migrations usando a função migrate() do Drizzle ORM
    await migrate(db, {
      migrationsFolder: "./server/migrations",
    });

    console.log("✅ [MIGRATIONS] Migrations executadas com sucesso!");
  } catch (error: any) {
    console.error("❌ [MIGRATIONS] Erro ao executar migrations:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Não fazer throw - deixar o servidor iniciar mesmo se migrations falharem
    // Isso evita que o servidor fique offline se houver um problema temporário
    console.warn("⚠️ [MIGRATIONS] Servidor continuará inicializando apesar do erro nas migrations");
  }
}
