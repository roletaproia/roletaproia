import { getDb } from "../db";

export async function runMigrations() {
  console.log("🚀 [MIGRATIONS] Iniciando processo de migrations...");
  
  const db = await getDb();
  if (!db) {
    console.error("❌ [MIGRATIONS] Database not available for migrations");
    return;
  }

  console.log("✅ [MIGRATIONS] Database conectado com sucesso!");
  console.log("🔄 [MIGRATIONS] Verificando migrations necessárias..." );

  try {
    // Verificar e adicionar campos da I.A. avançada na tabela recommendations
    const columns = [
      { name: 'suggestedNumber', type: 'INT' },
      { name: 'suggestedDozen', type: 'INT' },
      { name: 'suggestedColumn', type: 'INT' },
      { name: 'suggestedParity', type: 'VARCHAR(10)' },
      { name: 'sector', type: 'VARCHAR(50)' },
      { name: 'neighbors', type: 'TEXT' },
      { name: 'analysis', type: 'TEXT' },
    ];

    for (const column of columns) {
      try {
        // Verificar se a coluna já existe
        const checkQuery = `
          SELECT COUNT(*) as count 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'recommendations' 
          AND COLUMN_NAME = '${column.name}'
        `;
        
        const result: any = await db.execute(checkQuery);
        const exists = result[0]?.[0]?.count > 0;

        if (!exists) {
          // Adicionar coluna se não existir
          const alterQuery = `ALTER TABLE recommendations ADD COLUMN ${column.name} ${column.type}`;
          await db.execute(alterQuery);
          console.log(`✅ [MIGRATIONS] Coluna ${column.name} adicionada com sucesso`);
        } else {
          console.log(`⏭️  [MIGRATIONS] Coluna ${column.name} já existe`);
        }
      } catch (error: any) {
        console.error(`❌ [MIGRATIONS] Erro ao processar coluna ${column.name}:`, error.message);
      }
    }

    console.log("✅ [MIGRATIONS] Migrations concluídas com sucesso!");
  } catch (error) {
    console.error("❌ [MIGRATIONS] Erro fatal ao executar migrations:", error);
  }
}
