-- Brand Expression - Railway MySQL Initialization
-- Run this script in Railway MySQL database to create all tables

-- User table (must be created first due to foreign keys)
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `authType` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `socialId` varchar(100) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `emailDuplicate` varchar(200) DEFAULT NULL,
  `grade` varchar(20) DEFAULT 'basic' COMMENT 'Membership tier: basic, pro, business, premium',
  `status` varchar(5) DEFAULT NULL,
  `lastLoginAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `membershipStartDate` datetime DEFAULT NULL COMMENT 'When current membership tier started',
  `membershipEndDate` datetime DEFAULT NULL COMMENT 'When current membership tier expires (NULL for basic/free)',
  `membershipStatus` enum('active','expired','cancelled') DEFAULT 'active' COMMENT 'Current membership status',
  `sessionToken` varchar(255) DEFAULT NULL,
  `tokenUpdatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_membership` (`grade`,`membershipStatus`,`membershipEndDate`),
  KEY `idx_user_session_token` (`sessionToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Brand table
CREATE TABLE IF NOT EXISTS `brand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `fk_userId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `advantages` text COLLATE utf8mb4_unicode_ci COMMENT 'Company advantages',
  `coreProduct` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Core product/service name',
  `coreProductDetail` text COLLATE utf8mb4_unicode_ci,
  `targetAudience` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Target audience',
  `targetAudienceDetail` text COLLATE utf8mb4_unicode_ci,
  `mainColor` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Main theme color',
  `selectedContentTypes` json DEFAULT NULL COMMENT 'Selected content types for generation',
  `brandAnalysis` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`fk_userId`),
  CONSTRAINT `brand_ibfk_1` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project table
CREATE TABLE IF NOT EXISTS `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `sessionName` varchar(255) DEFAULT NULL,
  `category` varchar(20) DEFAULT NULL,
  `url` varchar(300) DEFAULT NULL,
  `imageList` varchar(1000) DEFAULT NULL,
  `reasonList` varchar(100) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `fk_userId` int DEFAULT NULL,
  `fk_brandId` int DEFAULT NULL,
  `lastAccessedAt` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `is_free_initial` tinyint(1) DEFAULT '0' COMMENT 'Is this the free initial 4-grid set',
  `moodboard` longtext COMMENT 'Base64 encoded moodboard image (2x2 collage) for brand visual inspiration',
  PRIMARY KEY (`id`),
  KEY `project_user_idx` (`fk_userId`),
  KEY `idx_brand` (`fk_brandId`),
  KEY `idx_project_moodboard` (`id`,`moodboard`(100)),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`fk_brandId`) REFERENCES `brand` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_user` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ContentRequest table
CREATE TABLE IF NOT EXISTS `contentRequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trendIssue` varchar(45) DEFAULT NULL,
  `snsEvent` varchar(45) DEFAULT NULL,
  `essentialKeyword` varchar(45) DEFAULT NULL,
  `competitor` varchar(250) DEFAULT NULL,
  `uploadCycle` varchar(5) DEFAULT NULL,
  `toneMannerList` varchar(60) DEFAULT NULL,
  `imageVideoRatio` tinyint DEFAULT NULL,
  `imageRatio` varchar(5) DEFAULT NULL,
  `directionList` varchar(500) DEFAULT NULL,
  `mainColor` varchar(100) DEFAULT NULL,
  `searchResult` varchar(800) DEFAULT NULL,
  `searchToken` smallint DEFAULT NULL,
  `subjectToken` smallint DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `fk_projectId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contentRequest_project_idx` (`fk_projectId`),
  CONSTRAINT `contentRequest_project` FOREIGN KEY (`fk_projectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content table
CREATE TABLE IF NOT EXISTS `content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postDate` datetime DEFAULT NULL,
  `subject` varchar(60) DEFAULT NULL,
  `imageUrl` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aiPrompt` varchar(300) DEFAULT NULL,
  `caption` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `videoScript` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageToken` smallint DEFAULT NULL,
  `textToken` smallint DEFAULT NULL,
  `imageLog` text,
  `fk_contentRequestId` int NOT NULL,
  `direction` varchar(50) DEFAULT '정보형',
  `snsEvent` tinyint(1) DEFAULT '0' COMMENT 'SNS event flag',
  `imageSize` varchar(10) DEFAULT '1:1' COMMENT 'Image size ratio',
  `additionalText` text COMMENT 'Individual image additional instructions',
  `is_single_image` tinyint(1) DEFAULT '0' COMMENT 'Is this a single generated image',
  PRIMARY KEY (`id`),
  KEY `content_ contentRequest_idx` (`fk_contentRequestId`),
  CONSTRAINT `content_ contentRequest` FOREIGN KEY (`fk_contentRequestId`) REFERENCES `contentRequest` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI Prompt table
CREATE TABLE IF NOT EXISTS `aiPrompt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `prompt` varchar(3000) DEFAULT NULL,
  `required` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Notification table
CREATE TABLE IF NOT EXISTS `emailNotification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_userId` int NOT NULL,
  `fk_contentRequestId` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','sent','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `sentAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status_contentRequestId` (`status`,`fk_contentRequestId`),
  KEY `fk_userId` (`fk_userId`),
  KEY `fk_contentRequestId` (`fk_contentRequestId`),
  KEY `idx_pending_notifications` (`fk_contentRequestId`,`status`),
  CONSTRAINT `emailNotification_ibfk_1` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `emailNotification_ibfk_2` FOREIGN KEY (`fk_contentRequestId`) REFERENCES `contentRequest` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Regenerate Log table
CREATE TABLE IF NOT EXISTS `regenerateLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `caption` tinyint DEFAULT '0',
  `image` tinyint DEFAULT '0',
  `all` tinyint DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `fk_userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `regenerateLog_user_idx` (`fk_userId`),
  CONSTRAINT `regenerateLog_user` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usage Tracking table
CREATE TABLE IF NOT EXISTS `usage_tracking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_userId` int NOT NULL,
  `usage_type` enum('project_creation','single_image_creation','content_edit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fk_projectId` int DEFAULT NULL,
  `fk_contentId` int DEFAULT NULL,
  `fk_brandId` int DEFAULT NULL,
  `usage_date` date NOT NULL DEFAULT (curdate()),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_projectId` (`fk_projectId`),
  KEY `fk_contentId` (`fk_contentId`),
  KEY `fk_brandId` (`fk_brandId`),
  KEY `idx_user_date` (`fk_userId`,`usage_date`),
  KEY `idx_user_type_date` (`fk_userId`,`usage_type`,`usage_date`),
  CONSTRAINT `usage_tracking_ibfk_1` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`),
  CONSTRAINT `usage_tracking_ibfk_2` FOREIGN KEY (`fk_projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `usage_tracking_ibfk_3` FOREIGN KEY (`fk_contentId`) REFERENCES `content` (`id`),
  CONSTRAINT `usage_tracking_ibfk_4` FOREIGN KEY (`fk_brandId`) REFERENCES `brand` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Membership Tiers reference table
CREATE TABLE IF NOT EXISTS `membership_tiers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tier_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tier_display_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `monthly_price` int NOT NULL COMMENT 'Price in KRW',
  `monthly_grid_sets` int NOT NULL COMMENT 'Max photo grid sets per month',
  `content_edit_limit` int NOT NULL COMMENT 'Max edits per content',
  `planning_sets_limit` int NOT NULL COMMENT 'Max planning sets',
  `manager_support` tinyint(1) DEFAULT '0',
  `team_management` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `single_image_limit` int DEFAULT '0' COMMENT 'Total single images allowed',
  `daily_edit_limit` int DEFAULT NULL COMMENT 'Daily edit limit (NULL = unlimited)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `tier_name` (`tier_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Billing Keys table (payment system)
CREATE TABLE IF NOT EXISTS `billing_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_userId` int NOT NULL,
  `orderNumber` varchar(100) NOT NULL,
  `billingKey` varchar(255) NOT NULL COMMENT 'INICIS TID used as billing key',
  `cardNumber` varchar(20) NOT NULL COMMENT 'Masked card number',
  `cardName` varchar(50) NOT NULL COMMENT 'Card company name',
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`fk_userId`),
  KEY `idx_billingKey` (`billingKey`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_billing_keys_user` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment Logs table
CREATE TABLE IF NOT EXISTS `payment_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_userId` int NOT NULL,
  `orderNumber` varchar(100) NOT NULL,
  `billingKey` varchar(255) DEFAULT NULL,
  `price` int NOT NULL,
  `goodName` varchar(200) NOT NULL,
  `buyerName` varchar(100) NOT NULL,
  `buyerTel` varchar(20) NOT NULL,
  `buyerEmail` varchar(100) NOT NULL,
  `paymentStatus` enum('success','failed','cancelled','refunded') NOT NULL,
  `inicisResponse` json DEFAULT NULL COMMENT 'Full INICIS response',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`fk_userId`),
  KEY `idx_orderNumber` (`orderNumber`),
  KEY `idx_paymentStatus` (`paymentStatus`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_payment_logs_user` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment Subscriptions table
CREATE TABLE IF NOT EXISTS `payment_subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_userId` int NOT NULL,
  `planType` varchar(20) NOT NULL COMMENT 'basic, pro, business, premium',
  `status` enum('active','suspended','cancelled','expired') DEFAULT 'active',
  `startDate` date NOT NULL,
  `nextBillingDate` date NOT NULL,
  `price` int NOT NULL COMMENT 'Monthly price in KRW',
  `billingCycle` enum('monthly','yearly') DEFAULT 'monthly',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`fk_userId`),
  KEY `idx_status` (`status`),
  KEY `idx_nextBillingDate` (`nextBillingDate`),
  CONSTRAINT `fk_subscriptions_user` FOREIGN KEY (`fk_userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cleanup Log table
CREATE TABLE IF NOT EXISTS `cleanup_log` (
  `action` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `count` int DEFAULT NULL,
  `executed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
