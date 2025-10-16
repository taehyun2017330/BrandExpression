#!/bin/bash

# Script to verify migration was successful

echo "=== MIGRATION VERIFICATION ==="
echo ""

DB_HOST="localhost"
DB_USER="root"
DB_NAME="amond"

echo "1. USER TABLE COLUMNS:"
mysql -h $DB_HOST -u $DB_USER $DB_NAME -e "
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user'
ORDER BY ORDINAL_POSITION;"

echo ""
echo "2. ALL TABLES:"
mysql -h $DB_HOST -u $DB_USER $DB_NAME -e "
SELECT TABLE_NAME, TABLE_ROWS
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;"

echo ""
echo "3. USER GRADE DISTRIBUTION:"
mysql -h $DB_HOST -u $DB_USER $DB_NAME -e "
SELECT grade, COUNT(*) as count
FROM user
GROUP BY grade
ORDER BY count DESC;"

echo ""
echo "4. MEMBERSHIP TIERS:"
mysql -h $DB_HOST -u $DB_USER $DB_NAME -e "
SELECT tier_name, tier_display_name, monthly_price
FROM membership_tiers
ORDER BY monthly_price;"

echo ""
echo "5. SAMPLE USERS WITH NEW FIELDS:"
mysql -h $DB_HOST -u $DB_USER $DB_NAME -e "
SELECT id, authType, grade, name, membershipStatus, membershipStartDate
FROM user
LIMIT 10;"