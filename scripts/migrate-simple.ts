import mysql from 'mysql2/promise';

async function migrate() {
  console.log('🔄 Aplicando migração...\n');

  const connection = await mysql.createConnection(process.env.DATABASE_URL!);

  try {
    // 1. Adicionar coluna referralCode
    console.log('1️⃣ Adicionando coluna referralCode...');
    try {
      await connection.execute(`
        ALTER TABLE users ADD COLUMN referralCode VARCHAR(32) NULL AFTER avatarUrl
      `);
      console.log('✅ Coluna referralCode adicionada!');
    } catch (e: any) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  Coluna já existe (pulando)');
      } else throw e;
    }

    // 1b. Criar índice UNIQUE
    console.log('1️⃣b Criando índice UNIQUE...');
    try {
      await connection.execute(`
        CREATE UNIQUE INDEX idx_referralCode ON users(referralCode)
      `);
      console.log('✅ Índice UNIQUE criado!\n');
    } catch (e: any) {
      if (e.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Índice já existe (pulando)\n');
      } else throw e;
    }

    // 2. Criar tabela subscriptions
    console.log('2️⃣ Criando tabela subscriptions...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        plan ENUM('trial', 'monthly', 'quarterly', 'annual') DEFAULT 'trial' NOT NULL,
        status ENUM('active', 'expired', 'cancelled') DEFAULT 'active' NOT NULL,
        trialEndsAt TIMESTAMP NULL,
        subscriptionEndsAt TIMESTAMP NULL,
        extraDays INT NOT NULL DEFAULT 0,
        registrationIp VARCHAR(45) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela subscriptions criada!\n');

    // 3. Criar tabela referrals
    console.log('3️⃣ Criando tabela referrals...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS referrals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        referrerId INT NOT NULL,
        referredId INT NOT NULL UNIQUE,
        bonusDaysGranted INT NOT NULL DEFAULT 7,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (referrerId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (referredId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_referrerId (referrerId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela referrals criada!\n');

    // 4. Criar tabela payments
    console.log('4️⃣ Criando tabela payments...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        plan ENUM('monthly', 'quarterly', 'annual') NOT NULL,
        amount INT NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending' NOT NULL,
        paymentMethod VARCHAR(64) NULL,
        transactionId VARCHAR(255) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela payments criada!\n');

    // 5. Criar tabela blockedIps
    console.log('5️⃣ Criando tabela blockedIps...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS blockedIps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ipAddress VARCHAR(45) NOT NULL UNIQUE,
        userId INT NULL,
        reason TEXT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_ipAddress (ipAddress)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela blockedIps criada!\n');

    // 6. Criar subscriptions para usuários existentes
    console.log('6️⃣ Criando subscriptions para usuários existentes...');
    const [result] = await connection.execute(`
      INSERT IGNORE INTO subscriptions (userId, plan, status, trialEndsAt)
      SELECT 
        id,
        'trial',
        'active',
        DATE_ADD(NOW(), INTERVAL 7 DAY)
      FROM users
      WHERE id NOT IN (SELECT userId FROM subscriptions)
    `);
    console.log(`✅ ${(result as any).affectedRows} subscriptions criadas!\n`);

    // 7. Gerar códigos de referral
    console.log('7️⃣ Gerando códigos de referral...');
    const [updateResult] = await connection.execute(`
      UPDATE users 
      SET referralCode = SUBSTRING(MD5(CONCAT(id, email, RAND())), 1, 12)
      WHERE referralCode IS NULL
    `);
    console.log(`✅ ${(updateResult as any).affectedRows} códigos gerados!\n`);

    // Verificação
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [subs] = await connection.execute('SELECT COUNT(*) as count FROM subscriptions');
    const [codes] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE referralCode IS NOT NULL');

    console.log('\n📊 Resultado Final:');
    console.log(`✅ Total de usuários: ${(users as any)[0].count}`);
    console.log(`✅ Total de subscriptions: ${(subs as any)[0].count}`);
    console.log(`✅ Usuários com código de referral: ${(codes as any)[0].count}`);

    await connection.end();
    console.log('\n🎉 Migração concluída com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro:', error);
    await connection.end();
    process.exit(1);
  }
}

migrate();

