# Amond Data Structure

## Hierarchy
```
Brand (브랜드)
  └── Project (피드셋/Feedset) 
        └── ContentRequest (콘텐츠 생성 요청)
              └── Content (개별 콘텐츠 - 4 images per request)
```

## Database Tables

### 1. Brand (브랜드)
- **id**: Brand ID (e.g., 46)
- **name**: Brand name (e.g., "Nike")
- **category**: Category (e.g., "건강/헬스")
- **url**: Brand URL
- **fk_userId**: Owner user ID

### 2. Project (피드셋)
- **id**: Project ID (e.g., 54)
- **name**: Project name (usually same as brand name)
- **fk_brandId**: Links to brand.id
- **fk_userId**: Owner user ID
- **sessionName**: Display name with timestamp
- **imageList**: Reference images for the feedset

### 3. ContentRequest (콘텐츠 요청)
- **id**: Content request ID (e.g., 82)
- **fk_projectId**: Links to project.id
- **createdAt**: When content was generated
- **uploadCycle**: How often to post (e.g., "1,1,1")
- **trendIssue**, **competitor**, etc.: Generation settings

### 4. Content (콘텐츠)
- **id**: Individual content ID
- **fk_contentRequestId**: Links to contentrequest.id
- **subject**: Content topic
- **caption**: Instagram caption
- **imageUrl**: Generated image URL

## Current Issues

1. **Sidebar Display**: Shows content requests as separate items using composite IDs (e.g., `pGOjzRMDdaKE_cr82`)
   - `pGOjzRMDdaKE` = Hashed project ID
   - `cr82` = Content request ID

2. **"새 피드셋 만들기" Confusion**: 
   - Currently tries to navigate to existing project with autoGenerate
   - Should create a NEW project under the same brand
   - Each "feedset" should be a separate project

## Correct Flow

### Creating a New Brand
1. Create brand entry
2. Create first project (feedset) under that brand
3. Create first content request for that project
4. Generate 4 content items

### Creating a New Feedset (under existing brand)
1. Create new project with same brand ID
2. Create content request for new project
3. Generate content

### Regenerating Content (within existing feedset)
1. Create new content request for existing project
2. Generate new content