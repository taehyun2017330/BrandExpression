-- Add moodboard column to project table for storing brand moodboard
-- The moodboard serves as visual inspiration for content image generation

ALTER TABLE project
ADD COLUMN moodboard LONGTEXT NULL COMMENT 'Base64 encoded moodboard image (2x2 collage) for brand visual inspiration';

-- Index for faster lookups when generating content
CREATE INDEX idx_project_moodboard ON project(id, moodboard(100));
