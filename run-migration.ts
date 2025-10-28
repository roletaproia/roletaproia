import { getDb } from "./server/db";
import fs from "fs";
import path from "path";

async function runMigration() {
  console.log("🔄 Executando migração...");
  
  try {
    const db = await getDb();
    
    // Ler arquivo SQL
    const sqlPath = path.join(process.cwd(), "drizzle", "0005_create_missing_tables.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");
    
    // Dividir em statements individuais (remover comentários primeiro)
    const cleanSql = sql
      .split("\n")
      .filter(line => !line.trim().startsWith("--"))
      .join("\n");
    
    const statements = cleanSql
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`📝 Executando ${statements.length} statements...`);
    
    for (const statement of statements) {
      console.log(`  ⏳ Executando: ${statement.substring(0, 50)}...`);
      await db.execute(statement);
      console.log(`  ✅ Sucesso!`);
    }
    
    console.log("🎉 Migração concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    process.exit(1);
  }
}

runMigration();

