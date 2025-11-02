-- Migration: Adicionar campos da I.A. avançada na tabela recommendations
-- Data: 2025-11-02

ALTER TABLE recommendations 
ADD COLUMN suggestedNumber INT NULL COMMENT 'Número específico sugerido (0-36)',
ADD COLUMN suggestedDozen INT NULL COMMENT 'Dúzia sugerida (1, 2 ou 3)',
ADD COLUMN suggestedColumn INT NULL COMMENT 'Coluna sugerida (1, 2 ou 3)',
ADD COLUMN suggestedParity VARCHAR(16) NULL COMMENT 'Par ou ímpar',
ADD COLUMN sector VARCHAR(64) NULL COMMENT 'Setor da roda (vizinhos_zero, orfaos, terceiro)',
ADD COLUMN neighbors TEXT NULL COMMENT 'JSON com números vizinhos',
ADD COLUMN analysis TEXT NULL COMMENT 'JSON com motivos da análise';
