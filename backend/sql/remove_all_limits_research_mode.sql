-- RESEARCH MODE: Remove all membership tier limits for unlimited testing
-- -1 or NULL means unlimited

UPDATE membership_tiers SET
  monthly_grid_sets = -1,           -- Unlimited project/grid sets per month
  content_edit_limit = -1,          -- Unlimited total content edits
  planning_sets_limit = -1,         -- Unlimited planning sets
  single_image_limit = 9999,        -- Very high limit for single images
  daily_edit_limit = NULL           -- NULL = unlimited daily edits
WHERE 1=1;

-- Verify changes
SELECT
  tier_name,
  tier_display_name,
  monthly_grid_sets as 'Grid Sets (Monthly)',
  single_image_limit as 'Single Images',
  daily_edit_limit as 'Daily Edits',
  content_edit_limit as 'Total Edits'
FROM membership_tiers;
