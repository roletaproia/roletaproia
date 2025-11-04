-- Migration: Remover constraint unique do campo ipAddress
-- Permite até 3 contas por IP ao invés de apenas 1

-- Remover constraint unique do campo ipAddress
ALTER TABLE `blockedIps` DROP INDEX `ipAddress`;
