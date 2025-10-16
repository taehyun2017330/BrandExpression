-- Brand Expression Research Prototype
-- Initial Database Schema
-- This script creates all necessary tables for the application

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS amond CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE amond;

-- User table
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  authType ENUM('이메일', '카카오', '구글') DEFAULT '이메일',
  grade ENUM('basic', 'pro', 'business', 'premium') DEFAULT 'basic',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Brand table
CREATE TABLE IF NOT EXISTS brand (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fk_userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  url TEXT,
  description TEXT,
  advantages TEXT,
  coreProduct VARCHAR(255),
  coreProductDetail TEXT,
  targetAudience VARCHAR(255),
  targetAudienceDetail TEXT,
  mainColor VARCHAR(50),
  selectedContentTypes JSON,
  brandAnalysis TEXT,
  visualStyle VARCHAR(255),
  colorPalette JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME NULL,
  FOREIGN KEY (fk_userId) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project table
CREATE TABLE IF NOT EXISTS project (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fk_brandId INT NOT NULL,
  fk_userId INT NOT NULL,
  name VARCHAR(255),
  imageList JSON,
  moodboard LONGTEXT COMMENT 'Base64 encoded moodboard image',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME NULL,
  FOREIGN KEY (fk_brandId) REFERENCES brand(id),
  FOREIGN KEY (fk_userId) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content Request table
CREATE TABLE IF NOT EXISTS contentRequest (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fk_projectId INT NOT NULL,
  fk_userId INT NOT NULL,
  mainColor VARCHAR(50),
  coreProduct VARCHAR(255),
  advantages TEXT,
  targetAudience VARCHAR(255),
  selectedContentTypes JSON,
  uploadCycle JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  deletedAt DATETIME NULL,
  FOREIGN KEY (fk_projectId) REFERENCES project(id),
  FOREIGN KEY (fk_userId) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fk_contentRequestId INT NOT NULL,
  fk_userId INT NOT NULL,
  aiPrompt TEXT,
  direction TEXT,
  snsEvent VARCHAR(255),
  imageUrl TEXT,
  caption TEXT,
  imageSize VARCHAR(20),
  postDate DATE,
  imageRatio VARCHAR(10),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME NULL,
  FOREIGN KEY (fk_contentRequestId) REFERENCES contentRequest(id),
  FOREIGN KEY (fk_userId) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Membership Tiers table (Research Mode: All unlimited)
CREATE TABLE IF NOT EXISTS membership_tiers (
  tier_name VARCHAR(50) PRIMARY KEY,
  monthly_grid_sets INT DEFAULT -1 COMMENT '-1 means unlimited',
  content_edit_limit INT DEFAULT -1 COMMENT '-1 means unlimited',
  planning_sets_limit INT DEFAULT -1 COMMENT '-1 means unlimited',
  single_image_limit INT DEFAULT 9999,
  daily_edit_limit INT DEFAULT NULL COMMENT 'NULL means unlimited',
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default tiers (all unlimited for research)
INSERT INTO membership_tiers (tier_name, monthly_grid_sets, content_edit_limit, planning_sets_limit, single_image_limit, daily_edit_limit, description)
VALUES
  ('basic', -1, -1, -1, 9999, NULL, 'Basic tier - Research Mode (Unlimited)'),
  ('pro', -1, -1, -1, 9999, NULL, 'Pro tier - Research Mode (Unlimited)'),
  ('business', -1, -1, -1, 9999, NULL, 'Business tier - Research Mode (Unlimited)'),
  ('premium', -1, -1, -1, 9999, NULL, 'Premium tier - Research Mode (Unlimited)')
ON DUPLICATE KEY UPDATE
  monthly_grid_sets = -1,
  content_edit_limit = -1,
  planning_sets_limit = -1,
  single_image_limit = 9999,
  daily_edit_limit = NULL;

-- Usage Tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fk_userId INT NOT NULL,
  action_type ENUM('create_project', 'create_single_image', 'edit_content') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_userId) REFERENCES user(id),
  INDEX idx_user_action (fk_userId, action_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Regenerate Log table
CREATE TABLE IF NOT EXISTS regenerateLog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fk_userId INT NOT NULL,
  regenerate INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_userId) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ImageLog table
CREATE TABLE IF NOT EXISTS imageLog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fk_userId INT NOT NULL,
  direction TEXT,
  imageUrl TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  deletedAt DATETIME NULL,
  FOREIGN KEY (fk_userId) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);
CREATE INDEX IF NOT EXISTS idx_brand_user ON brand(fk_userId);
CREATE INDEX IF NOT EXISTS idx_project_brand ON project(fk_brandId);
CREATE INDEX IF NOT EXISTS idx_project_user ON project(fk_userId);
CREATE INDEX IF NOT EXISTS idx_content_request ON contentRequest(fk_projectId, fk_userId);
CREATE INDEX IF NOT EXISTS idx_content_user ON content(fk_userId);
CREATE INDEX IF NOT EXISTS idx_content_date ON content(postDate);

-- Add moodboard column if it doesn't exist (migration safety)
ALTER TABLE project
ADD COLUMN IF NOT EXISTS moodboard LONGTEXT NULL COMMENT 'Base64 encoded moodboard image (2x2 collage) for brand visual inspiration';

-- Insert default test user (password: test1234)
-- Password hash generated with bcrypt for 'test1234'
INSERT INTO user (name, email, password, authType, grade)
VALUES ('Test User', 'test@example.com', '$2b$10$rMZ5vQHX7YnM9LJZhF6kVOKqH.PG0qXqQKJN3cQXmZ8YH5F6kVeKq', '이메일', 'premium')
ON DUPLICATE KEY UPDATE
  name = 'Test User',
  grade = 'premium';

COMMIT;
