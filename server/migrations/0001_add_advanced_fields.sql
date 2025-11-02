-- Migration: Adicionar campos da I.A. avançada na tabela recommendations
-- Data: 2025-11-02
-- Versão: 0001

ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedNumber INT NULL COMMENT 'Número específico sugerido (0-36)';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedDozen INT NULL COMMENT 'Dúzia sugerida (1, 2 ou 3)';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedColumn INT NULL COMMENT 'Coluna sugerida (1, 2 ou 3)';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS suggestedParity VARCHAR(16) NULL COMMENT 'Par ou ímpar';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS sector VARCHAR(64) NULL COMMENT 'Setor da roda (vizinhos_zero, orfaos, terceiro)';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS neighbors TEXT NULL COMMENT 'JSON com números vizinhos';
ALTER TABLE recommendations ADD COLUMN IF NOT EXISTS analysis TEXT NULL COMMENT 'JSON com motivos da análise';
