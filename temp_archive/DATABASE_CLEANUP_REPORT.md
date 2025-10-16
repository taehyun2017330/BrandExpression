# Database Cleanup Report for EC2 Deployment

**Date**: 2025-07-31  
**Purpose**: Clean outdated SQL structure data to match new system requirements

## New Structure Requirements
- 1 Feed Set = 1 Content Request = Exactly 4 Images
- Multi-level hierarchy: User → Brands → Projects → Content Requests (Feed Sets) → Content Items

## Cleanup Actions Performed

### 1. Database Backup
- Created full backup: `amond_backup_[timestamp].sql`
- Backup completed successfully before any modifications

### 2. Removed Outdated Content Structure
- **36 content requests** with more than 4 images (legacy structure)
- **33 empty content requests** with 0 images
- Total content requests removed: 69

### 3. Cleaned Test/Dummy Data
- **2 test brands** removed: 'dddd', 'asf'
- Related projects and content automatically cascaded

### 4. Removed Orphaned Records
- **14 empty projects** (projects with no content requests)
- **23 empty brands** (brands with no projects)
- **2 inactive users** without brands (created >30 days ago)

### 5. System Maintenance
- No old regenerate logs found (< 60 days)
- No old email notifications found (< 30 days)

## Final Database State

| Metric | Count |
|--------|-------|
| Total Users | 23 |
| Users with Brands | 16 |
| Total Brands | 18 |
| Total Projects | 20 |
| Total Content Requests (Feed Sets) | 21 |
| Total Content Items (Images) | 84 |
| Average Images per Feed Set | 4.0 |

## Verification
✅ All content requests now have exactly 4 images  
✅ No test/dummy data remaining  
✅ No orphaned records  
✅ Database structure matches new requirements  

## EC2 Deployment Notes

1. **Database Migration**: Use the cleaned database for EC2 deployment
2. **Constants Updated**: `IMAGES_PER_FEEDSET = 4` in both backend and frontend
3. **API Endpoints**: New `/contentrequest/:id` endpoint for individual feed set deletion
4. **Composite IDs**: Fixed to handle `projectId_cr{contentRequestId}` format

## Sample Data Structure
Example of clean hierarchy after cleanup:
```
User #9
├── Brand: 화장품
│   └── 1 Project → 8 Feed Sets (32 images total)
└── Brand: minimute
    └── 2 Projects → 4 Feed Sets (16 images total)
```

## Next Steps for EC2
1. Export cleaned database: `mysqldump -u root -p amond > amond_clean.sql`
2. Import on EC2: `mysql -u root -p amond < amond_clean.sql`
3. Update environment variables
4. Deploy updated backend/frontend code with new structure

---
*This cleanup ensures data consistency and prevents confusion during EC2 deployment.*