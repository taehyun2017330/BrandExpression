#!/bin/bash

# Script to check production database schema on EC2 with authentication

echo "=== PRODUCTION DATABASE SCHEMA CHECK ==="
echo ""

# Database connection details
DB_HOST="localhost"
DB_USER="root"
DB_PASS="QkdwkWkd12@@"
DB_NAME="amond"

# 1. Check all tables
echo "1. EXISTING TABLES:"
mysql -h $DB_HOST -u $DB_USER -p"$DB_PASS" $DB_NAME -e "
SELECT TABLE_NAME, TABLE_ROWS 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
ORDER BY TABLE_NAME;"

echo ""
echo "2. USER TABLE STRUCTURE:"
mysql -h $DB_HOST -u $DB_USER -p"$DB_PASS" $DB_NAME -e "
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user'
ORDER BY ORDINAL_POSITION;"

echo ""
echo "3. CHECKING FOR IMPORTANT COLUMNS:"
for col in name sessionToken tokenUpdatedAt membershipStartDate membershipEndDate membershipStatus; do
    result=$(mysql -h $DB_HOST -u $DB_USER -p"$DB_PASS" $DB_NAME -N -e "
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'user' 
    AND COLUMN_NAME = '$col';")
    
    if [ "$result" -eq "0" ]; then
        echo "❌ Missing: $col"
    else
        echo "✅ Exists: $col"
    fi
done

echo ""
echo "4. CHECKING FOR REQUIRED TABLES:"
for table in brand project contentRequest content membership_tiers payment_subscriptions billing_keys payment_logs emailNotification; do
    result=$(mysql -h $DB_HOST -u $DB_USER -p"$DB_PASS" $DB_NAME -N -e "
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = '$table';")
    
    if [ "$result" -eq "0" ]; then
        echo "❌ Missing: $table"
    else
        echo "✅ Exists: $table"
    fi
done

echo ""
echo "5. USER DATA SUMMARY:"
mysql -h $DB_HOST -u $DB_USER -p"$DB_PASS" $DB_NAME -e "
SELECT COUNT(*) as total_users FROM user;"

mysql -h $DB_HOST -u $DB_USER -p"$DB_PASS" $DB_NAME -e "
SELECT authType, grade, COUNT(*) as count 
FROM user 
GROUP BY authType, grade 
ORDER BY count DESC;"

echo ""
echo "6. CONTENT DATA SUMMARY:"
mysql -h $DB_HOST -u $DB_USER -p"$DB_PASS" $DB_NAME -e "
SELECT 
    (SELECT COUNT(*) FROM project) as projects,
    (SELECT COUNT(*) FROM contentRequest) as content_requests,
    (SELECT COUNT(*) FROM content) as contents;"