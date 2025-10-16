-- Migration script for Amond production database
-- This script will add missing columns and tables to match the local development schema

-- 1. Add missing columns to user table
-- Check and add 'name' column
SELECT 'Adding name column to user table...' AS status;
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'user' 
                   AND COLUMN_NAME = 'name');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE user ADD COLUMN name VARCHAR(100) NULL AFTER authType',
              'SELECT "Column name already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add 'sessionToken' column
SELECT 'Adding sessionToken column to user table...' AS status;
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'user' 
                   AND COLUMN_NAME = 'sessionToken');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE user ADD COLUMN sessionToken VARCHAR(255) NULL',
              'SELECT "Column sessionToken already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add 'tokenUpdatedAt' column
SELECT 'Adding tokenUpdatedAt column to user table...' AS status;
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'user' 
                   AND COLUMN_NAME = 'tokenUpdatedAt');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE user ADD COLUMN tokenUpdatedAt DATETIME NULL',
              'SELECT "Column tokenUpdatedAt already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add 'membershipStartDate' column
SELECT 'Adding membershipStartDate column to user table...' AS status;
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'user' 
                   AND COLUMN_NAME = 'membershipStartDate');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE user ADD COLUMN membershipStartDate DATETIME NULL',
              'SELECT "Column membershipStartDate already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add 'membershipEndDate' column
SELECT 'Adding membershipEndDate column to user table...' AS status;
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'user' 
                   AND COLUMN_NAME = 'membershipEndDate');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE user ADD COLUMN membershipEndDate DATETIME NULL',
              'SELECT "Column membershipEndDate already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add 'membershipStatus' column
SELECT 'Adding membershipStatus column to user table...' AS status;
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'user' 
                   AND COLUMN_NAME = 'membershipStatus');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE user ADD COLUMN membershipStatus ENUM("active", "expired", "cancelled") DEFAULT NULL',
              'SELECT "Column membershipStatus already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Create missing tables
-- Create brand table if not exists
CREATE TABLE IF NOT EXISTS brand (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  url VARCHAR(512),
  description TEXT,
  fk_userId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (fk_userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create membership_tiers table if not exists
CREATE TABLE IF NOT EXISTS membership_tiers (
  id INT NOT NULL AUTO_INCREMENT,
  tier_name VARCHAR(20) NOT NULL,
  tier_display_name VARCHAR(50) NOT NULL,
  monthly_price INT NOT NULL,
  monthly_grid_sets INT NOT NULL,
  content_edit_limit INT NOT NULL,
  planning_sets_limit INT NOT NULL,
  manager_support TINYINT(1) DEFAULT 0,
  team_management TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_tier_name (tier_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default membership tiers if they don't exist
INSERT IGNORE INTO membership_tiers (tier_name, tier_display_name, monthly_price, monthly_grid_sets, content_edit_limit, planning_sets_limit, manager_support, team_management)
VALUES 
  ('basic', '베이직', 0, 1, 2, 1, 0, 0),
  ('pro', '프로', 9900, 4, 3, 4, 0, 0),
  ('business', '비즈니스', 29900, 12, 5, 12, 1, 0),
  ('premium', '프리미엄', 99900, 40, 10, 40, 1, 1);

-- Create payment_subscriptions table if not exists
CREATE TABLE IF NOT EXISTS payment_subscriptions (
  id INT NOT NULL AUTO_INCREMENT,
  fk_userId INT NOT NULL,
  planType VARCHAR(20) NOT NULL,
  status ENUM('active', 'suspended', 'cancelled', 'expired') DEFAULT 'active',
  startDate DATE NOT NULL,
  nextBillingDate DATE,
  price INT NOT NULL,
  billingCycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (fk_userId) REFERENCES user(id) ON DELETE CASCADE,
  KEY idx_user_status (fk_userId, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create billing_keys table if not exists
CREATE TABLE IF NOT EXISTS billing_keys (
  id INT NOT NULL AUTO_INCREMENT,
  fk_userId INT NOT NULL,
  orderNumber VARCHAR(100) NOT NULL,
  billingKey VARCHAR(255) NOT NULL,
  cardNumber VARCHAR(20),
  cardName VARCHAR(50),
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (fk_userId) REFERENCES user(id) ON DELETE CASCADE,
  KEY idx_user_status (fk_userId, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create payment_logs table if not exists
CREATE TABLE IF NOT EXISTS payment_logs (
  id INT NOT NULL AUTO_INCREMENT,
  fk_userId INT NOT NULL,
  orderNumber VARCHAR(100) NOT NULL,
  billingKey VARCHAR(255),
  price INT NOT NULL,
  goodName VARCHAR(200),
  buyerName VARCHAR(100),
  buyerTel VARCHAR(20),
  buyerEmail VARCHAR(100),
  paymentStatus ENUM('success', 'failed', 'cancelled', 'refunded') DEFAULT 'success',
  inicisResponse JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (fk_userId) REFERENCES user(id) ON DELETE CASCADE,
  KEY idx_user_date (fk_userId, createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create emailNotification table if not exists
CREATE TABLE IF NOT EXISTS emailNotification (
  id INT NOT NULL AUTO_INCREMENT,
  fk_userId INT NOT NULL,
  fk_contentRequestId INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  sentAt DATETIME NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (fk_userId) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (fk_contentRequestId) REFERENCES contentRequest(id) ON DELETE CASCADE,
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Update user grades to match new system
UPDATE user SET grade = 'basic' WHERE grade IN ('c', 'C', 'cㅂ');
UPDATE user SET grade = 'pro' WHERE grade IN ('b', 'B');
UPDATE user SET grade = 'business' WHERE grade IN ('a', 'A');

-- 4. Add direction column to content table if not exists
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'content' 
                   AND COLUMN_NAME = 'direction');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE content ADD COLUMN direction VARCHAR(50) DEFAULT "정보형"',
              'SELECT "Column direction already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Add isActive column to project table if not exists
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'project' 
                   AND COLUMN_NAME = 'isActive');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE project ADD COLUMN isActive TINYINT(1) DEFAULT 1',
              'SELECT "Column isActive already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 6. Add lastAccessedAt column to project table if not exists
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'project' 
                   AND COLUMN_NAME = 'lastAccessedAt');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE project ADD COLUMN lastAccessedAt DATETIME DEFAULT CURRENT_TIMESTAMP',
              'SELECT "Column lastAccessedAt already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 7. Add fk_brandId column to project table if not exists
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'project' 
                   AND COLUMN_NAME = 'fk_brandId');
SET @sql = IF(@col_exists = 0, 
              'ALTER TABLE project ADD COLUMN fk_brandId INT NULL',
              'SELECT "Column fk_brandId already exists" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 8. Show migration summary
SELECT 'Migration completed!' AS status;
SELECT 'Checking final state...' AS status;

-- Show user table columns
SELECT 'User table columns:' AS info;
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user'
ORDER BY ORDINAL_POSITION;

-- Show all tables
SELECT 'All tables in database:' AS info;
SELECT TABLE_NAME, TABLE_ROWS
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;