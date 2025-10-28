-- Criar tabela chatBans se não existir
CREATE TABLE IF NOT EXISTS `chatBans` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `bannedBy` int NOT NULL,
  `reason` text NOT NULL,
  `expiresAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`bannedBy`) REFERENCES `users`(`id`)
);

-- Criar tabela chatRules se não existir
CREATE TABLE IF NOT EXISTS `chatRules` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `isActive` int NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela bannedWords se não existir
CREATE TABLE IF NOT EXISTS `bannedWords` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `word` varchar(255) NOT NULL UNIQUE,
  `severity` enum('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela chatWarnings se não existir
CREATE TABLE IF NOT EXISTS `chatWarnings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `issuedBy` int NOT NULL,
  `reason` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`issuedBy`) REFERENCES `users`(`id`)
);

-- Criar tabela deletedMessages se não existir
CREATE TABLE IF NOT EXISTS `deletedMessages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `originalMessageId` int NOT NULL,
  `userId` int NOT NULL,
  `message` text NOT NULL,
  `deletedBy` int NOT NULL,
  `reason` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`deletedBy`) REFERENCES `users`(`id`)
);

