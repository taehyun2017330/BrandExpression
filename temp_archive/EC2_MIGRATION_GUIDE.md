# EC2 Database Migration Guide

## Overview
The EC2 database currently has a different structure than our local development:
- **EC2**: User → Projects → Content Requests → Content
- **New**: User → Brands → Projects → Content Requests (4 images each)

## Current EC2 Database State
- 38 users
- 80 projects (directly linked to users, no brand layer)
- 86 content requests with varying image counts:
  - 2 with 0 images
  - 41 with 4 images  
  - 40 with 8 images
  - 2 with 12 images
  - 1 with 16 images
- Missing tables: `brand`, `emailNotification`

## Migration Steps

### 1. Backup Current Database
```bash
ssh -i amond.pem ec2-user@ec2-52-78-91-203.ap-northeast-2.compute.amazonaws.com
mysqldump -u root -p'QkdwkWkd12@@' amond > amond_ec2_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Copy Migration Script to EC2
```bash
scp -i amond.pem ec2_migration_to_brand_structure.sql ec2-user@ec2-52-78-91-203.ap-northeast-2.compute.amazonaws.com:~/
```

### 3. Run Migration Script
```bash
mysql -u root -p'QkdwkWkd12@@' amond < ~/ec2_migration_to_brand_structure.sql
```

### 4. Deploy Updated Code
The code changes include:
- Removed email notification functionality
- Fixed to support 4 images per feed set
- Added brand layer support
- Fixed composite ID handling

```bash
# On EC2, pull latest backend code
cd /path/to/amond-backend
git pull origin main

# Update environment variables if needed
nano .env

# Restart backend service
pm2 restart amond-backend
```

### 5. Verify Migration

Check the migration results:
```sql
-- Check brand creation
SELECT COUNT(*) FROM brand;

-- Verify all projects have brands
SELECT COUNT(*) FROM project WHERE fk_brandId IS NULL;

-- Check content distribution (should show only 4 images per request)
SELECT image_count, COUNT(*) as requests
FROM (
  SELECT COUNT(c.id) as image_count
  FROM contentRequest cr
  LEFT JOIN content c ON cr.id = c.fk_contentRequestId
  GROUP BY cr.id
) counts
GROUP BY image_count;
```

## What the Migration Does

1. **Creates brand table** - New intermediate layer between users and projects
2. **Migrates existing projects to brands** - Each unique project name becomes a brand
3. **Splits large content requests** - Requests with >4 images are split into multiple requests
4. **Removes empty content requests** - Cleans up requests with 0 images
5. **Adds missing tables** - Creates emailNotification table for consistency

## Rollback Plan

If issues occur, restore from backup:
```bash
mysql -u root -p'QkdwkWkd12@@' amond < amond_ec2_backup_[timestamp].sql
```

## Post-Migration Tasks

1. **Monitor logs** for any errors
2. **Test user flows**:
   - Create new brand
   - Create new project under brand
   - Generate content (should create 4 images)
   - Delete individual feed sets
3. **Update frontend** if deployed separately

## Important Notes

- User data is preserved (encrypted names remain encrypted)
- All existing projects are automatically assigned to brands
- Content order is maintained when splitting large requests
- Foreign key constraints ensure data integrity

## Expected Results After Migration

- Each user can have multiple brands
- Each brand can have multiple projects  
- Each content request has exactly 4 images
- Improved data organization and scalability