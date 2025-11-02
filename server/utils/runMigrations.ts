import { getDb } from "../db";
import { sql } from "drizzle-orm";

export async function runMigrations() {
  const db = await getDb();
  if (!db) {
    console.error("❌ Database not available for migrations");
    return;
  }

  console.log("🔄 Verificando migrations necessárias...");

  try {
    // Adicionar campos da I.A. avançada na tabela recommendations
    const migrations = [
      sql`ALTER TABLE recommendations ADD COLUMN suggestedNumber INT`,
      sql`ALTER TABLE recommendations ADD COLUMN suggestedDozen INT`,
      sql`ALTER TABLE recommendations ADD COLUMN suggestedColumn INT`,
      sql`ALTER TABLE recommendations ADD COLUMN suggestedParity VARCHAR(10)`,
      sql`ALTER TABLE recommendations ADD COLUMN sector VARCHAR(50)`,
      sql`ALTER TABLE recommendations ADD COLUMN neighbors TEXT`,
      sql`ALTER TABLE recommendations ADD COLUMN analysis TEXT`,
    ];

    for (const migration of migrations) {
      try {
        await db.execute(migration);
        console.log(`✅ Migration executada com sucesso`);
      } catch (error: any) {
        // Ignorar erro se a coluna já existir
        if (error.message?.includes("Duplicate column name")) {
          console.log(`⏭️  Coluna já existe, pulando...`);
        } else {
          console.error(`❌ Erro na migration: ${error.message}`);
        }
      }
    }

    console.log("✅ Migrations concluídas!");
  } catch (error) {
    console.error("❌ Erro ao executar migrations:", error);
  }
}
