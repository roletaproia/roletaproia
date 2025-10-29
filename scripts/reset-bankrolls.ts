import mysql from 'mysql2/promise';

async function resetBankrolls() {
  console.log('🔄 Zerando saldos de banca...\n');

  const connection = await mysql.createConnection(process.env.DATABASE_URL!);

  try {
    // Atualizar todos os saldos para R$ 0,00
    const [result] = await connection.execute(`
      UPDATE bankrolls 
      SET initialBalance = 0, currentBalance = 0
      WHERE initialBalance > 0 OR currentBalance > 0
    `);

    console.log(`✅ ${(result as any).affectedRows} bancas atualizadas!\n`);

    // Verificar resultado
    const [bankrolls] = await connection.execute(`
      SELECT userId, initialBalance, currentBalance 
      FROM bankrolls
    `);

    console.log('📊 Saldos atualizados:');
    console.table(bankrolls);

    await connection.end();
    console.log('\n🎉 Saldos zerados com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro:', error);
    await connection.end();
    process.exit(1);
  }
}

resetBankrolls();

