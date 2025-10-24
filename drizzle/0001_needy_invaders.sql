CREATE TABLE `bankrolls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`initialBalance` int NOT NULL DEFAULT 10000,
	`currentBalance` int NOT NULL DEFAULT 10000,
	`totalWins` int NOT NULL DEFAULT 0,
	`totalLosses` int NOT NULL DEFAULT 0,
	`totalBets` int NOT NULL DEFAULT 0,
	`winRate` varchar(10) DEFAULT '0',
	`stopLoss` int,
	`stopWin` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bankrolls_id` PRIMARY KEY(`id`),
	CONSTRAINT `bankrolls_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `bets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`strategyId` int,
	`betAmount` int NOT NULL,
	`result` varchar(32) NOT NULL,
	`payout` int,
	`rouletteNumber` int,
	`betType` varchar(64),
	`isAutomatic` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`isSystemMessage` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(64) NOT NULL,
	`description` text,
	`baseBetAmount` int NOT NULL DEFAULT 10,
	`isActive` int NOT NULL DEFAULT 1,
	`config` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strategies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bankrolls` ADD CONSTRAINT `bankrolls_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bets` ADD CONSTRAINT `bets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bets` ADD CONSTRAINT `bets_strategyId_strategies_id_fk` FOREIGN KEY (`strategyId`) REFERENCES `strategies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatMessages` ADD CONSTRAINT `chatMessages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `strategies` ADD CONSTRAINT `strategies_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;