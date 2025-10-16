-- Minimal Migration Script for Amond Production Database
-- This script only updates necessary items

-- 1. Update old user grades to match new system
UPDATE user SET grade = 'business' WHERE grade = 'A' OR grade = 'a';
UPDATE user SET grade = 'pro' WHERE grade = 'B' OR grade = 'b';
UPDATE user SET grade = 'basic' WHERE grade = 'C' OR grade = 'c' OR grade = 'cㅂ';

-- 2. Decrypt and update the name for user ID 1 (if still encrypted)
-- Note: This needs to be done in the application code, not SQL
-- The name appears to be encrypted, we'll handle this in the backend

-- 3. Add missing column to content table if not exists (direction)
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

-- 4. Show migration results
SELECT 'Migration completed!' AS status;

-- Show updated user grades
SELECT 'Updated user grades:' AS info;
SELECT grade, COUNT(*) as count
FROM user
GROUP BY grade
ORDER BY count DESC;

-- Show sample users
SELECT 'Sample users after migration:' AS info;
SELECT id, authType, grade, name
FROM user
LIMIT 10;