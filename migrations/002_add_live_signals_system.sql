-- Migration: Add Live Signals System
-- Adiciona tabelas para sistema de sinais ao vivo da roleta

-- Tabela de Sinais da Roleta
CREATE TABLE IF NOT EXISTS signals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number INT NOT NULL,
  color ENUM('red', 'black', 'green') NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(64) NOT NULL DEFAULT '1win',
  sessionId VARCHAR(255),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_timestamp (timestamp),
  INDEX idx_sessionId (sessionId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Recomendações de Apostas
CREATE TABLE IF NOT EXISTS recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  signalId INT NOT NULL,
  betType VARCHAR(64) NOT NULL,
  confidence INT NOT NULL,
  suggestedAmount INT NOT NULL,
  strategy VARCHAR(64) NOT NULL,
  result ENUM('pending', 'win', 'loss') DEFAULT 'pending',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (signalId) REFERENCES signals(id) ON DELETE CASCADE,
  INDEX idx_signalId (signalId),
  INDEX idx_result (result)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Sessões de Captura
CREATE TABLE IF NOT EXISTS captureSessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sessionId VARCHAR(255) NOT NULL UNIQUE,
  startedBy INT NOT NULL,
  status ENUM('active', 'stopped', 'error') NOT NULL DEFAULT 'active',
  totalSignals INT NOT NULL DEFAULT 0,
  lastSignalAt TIMESTAMP NULL,
  startedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  stoppedAt TIMESTAMP NULL,
  FOREIGN KEY (startedBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessionId (sessionId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

