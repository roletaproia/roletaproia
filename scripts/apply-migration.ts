import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script para aplicar migrações SQL no banco de dados
 * Uso: tsx scripts/apply-migration.ts
 */

async function applyMigration() {
  console.log('🔄 Iniciando aplicação de migração...\n');

  // Verificar variável de ambiente
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Erro: DATABASE_URL não está definida!');
    process.exit(1);
  }

  console.log('📊 Conectando ao banco de dados...');
  
  try {
    // Criar conexão
    const connection = await mysql.createConnection(databaseUrl);
    const db = drizzle(connection);

    console.log('✅ Conexão estabelecida!\n');

    // Ler arquivo SQL
    const migrationPath = path.join(process.cwd(), 'migrations/001_add_subscription_system.sql');
    console.log(`📄 Lendo migração: ${migrationPath}`);
    
    const sqlContent = fs.readFileSync(migrationPath, 'utf-8');
    
    // Dividir em statements individuais (separados por ;)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Encontrados ${statements.length} comandos SQL\n`);

    // Executar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Pular comentários
      if (statement.startsWith('--')) continue;

      try {
        console.log(`⚙️  Executando comando ${i + 1}/${statements.length}...`);
        
        // Executar statement
        await connection.execute(statement);
        
        console.log(`✅ Comando ${i + 1} executado com sucesso!\n`);
      } catch (error: any) {
        // Se erro for "já existe", continuar
        if (error.code === 'ER_DUP_FIELDNAME' || 
            error.code === 'ER_TABLE_EXISTS_ERROR' ||
            error.message.includes('Duplicate column name') ||
            error.message.includes('already exists')) {
          console.log(`⚠️  Comando ${i + 1} já foi aplicado anteriormente (pulando)\n`);
          continue;
        }
        
        console.error(`❌ Erro ao executar comando ${i + 1}:`);
        console.error(error.message);
        console.error(`\nComando:\n${statement}\n`);
        throw error;
      }
    }

    // Fechar conexão
    await connection.end();

    console.log('\n🎉 Migração aplicada com sucesso!');
    console.log('\n📊 Verificando resultado...');

    // Reconectar para verificação
    const verifyConnection = await mysql.createConnection(databaseUrl);
    
    const [users] = await verifyConnection.execute('SELECT COUNT(*) as count FROM users');
    const [subscriptions] = await verifyConnection.execute('SELECT COUNT(*) as count FROM subscriptions');
    const [usersWithCode] = await verifyConnection.execute('SELECT COUNT(*) as count FROM users WHERE referralCode IS NOT NULL');
    
    console.log(`\n✅ Total de usuários: ${(users as any)[0].count}`);
    console.log(`✅ Total de assinaturas: ${(subscriptions as any)[0].count}`);
    console.log(`✅ Usuários com código de referral: ${(usersWithCode as any)[0].count}`);

    await verifyConnection.end();

    console.log('\n✨ Tudo pronto! O sistema está atualizado.');
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ Erro fatal ao aplicar migração:');
    console.error(error);
    process.exit(1);
  }
}

// Executar
applyMigration();

