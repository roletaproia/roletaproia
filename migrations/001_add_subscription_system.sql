-- Migração: Sistema de Assinaturas e Referrals
-- Data: 2025-10-29
-- Descrição: Adiciona tabelas para sistema de trial, assinaturas pagas e referrals

-- 1. Adicionar coluna referralCode na tabela users
ALTER TABLE users ADD COLUMN referralCode VARCHAR(32) UNIQUE AFTER avatarUrl;

-- 2. Criar tabela de assinaturas
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Criar tabela de referrals
CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referrerId INT NOT NULL,
  referredId INT NOT NULL UNIQUE,
  bonusDaysGranted INT NOT NULL DEFAULT 7,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (referrerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referredId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_referrerId (referrerId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Criar tabela de pagamentos
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Criar tabela de IPs bloqueados
CREATE TABLE IF NOT EXISTS blockedIps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ipAddress VARCHAR(45) NOT NULL UNIQUE,
  userId INT NULL,
  reason TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_ipAddress (ipAddress)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Criar assinaturas de trial para usuários existentes
INSERT INTO subscriptions (userId, plan, status, trialEndsAt)
SELECT 
  id,
  'trial',
  'active',
  DATE_ADD(NOW(), INTERVAL 7 DAY)
FROM users
WHERE id NOT IN (SELECT userId FROM subscriptions);

-- 7. Gerar códigos de referral para usuários existentes
UPDATE users 
SET referralCode = CONCAT(
  SUBSTRING(MD5(CONCAT(id, email, RAND())), 1, 12)
)
WHERE referralCode IS NULL;

-- 8. Atualizar saldo inicial dos usuários para R$0.00
UPDATE bankrolls 
SET initialBalance = 0, currentBalance = 0
WHERE initialBalance = 10000;

-- Verificação final
SELECT 
  'Migração concluída!' as status,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM subscriptions) as total_subscriptions,
  (SELECT COUNT(*) FROM users WHERE referralCode IS NOT NULL) as users_with_referral_code;

