import { getDb } from "../db";

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
      `ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedNumber INT`,
      `ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedDozen VARCHAR(10)`,
      `ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedColumn VARCHAR(10)`,
      `ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedParity VARCHAR(10)`,
      `ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS sector VARCHAR(50)`,
      `ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS neighbors TEXT`,
      `ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS analysis TEXT`,
    ];

    for (const migration of migrations) {
      try {
        await db.execute(migration);
        console.log(`✅ Migration executada: ${migration.substring(0, 60)}...`);
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
