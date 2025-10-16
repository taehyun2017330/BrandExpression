import { queryAsync } from './commonFunction';

interface UsageLimits {
  projectsRemaining: number;
  singleImagesRemaining: number;
  editsRemainingToday: number | null;
  canCreateProject: boolean;
  canCreateSingleImage: boolean;
  canEditContent: boolean;
}

interface MembershipLimits {
  monthly_grid_sets: number;
  single_image_limit: number;
  content_edit_limit: number;
  daily_edit_limit: number | null;
}

// Get user's current usage and limits (RESEARCH MODE: Returns unlimited)
export async function getUserUsageLimits(userId: number): Promise<UsageLimits> {
  // RESEARCH MODE: No membership tiers, return unlimited access
  return {
    projectsRemaining: 999999,
    singleImagesRemaining: 999999,
    editsRemainingToday: null,
    canCreateProject: true,
    canCreateSingleImage: true,
    canEditContent: true,
  };
}

// Track a usage event
export async function trackUsage(
  userId: number, 
  usageType: 'project_creation' | 'single_image_creation' | 'content_edit',
  projectId?: number,
  contentId?: number,
  brandId?: number
): Promise<void> {
  try {
    await queryAsync(`
      INSERT INTO usage_tracking (fk_userId, usage_type, fk_projectId, fk_contentId, fk_brandId, usage_date)
      VALUES (?, ?, ?, ?, ?, CURRENT_DATE)
    `, [userId, usageType, projectId || null, contentId || null, brandId || null]);
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }
}

// Check if user can perform action
export async function canUserPerformAction(
  userId: number,
  action: 'create_project' | 'create_single_image' | 'edit_content'
): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
  // RESEARCH MODE: Always allow all actions for research purposes
  console.log(`[RESEARCH MODE] Allowing ${action} for user ${userId} (limits disabled)`);

  try {
    // Still track usage for analytics, but don't enforce limits
    const limits = await getUserUsageLimits(userId);

    // Log current usage but always return allowed
    console.log(`[RESEARCH MODE] User ${userId} usage stats:`, {
      action,
      projectsCreated: limits.projectsRemaining !== null ? `remaining: ${limits.projectsRemaining}` : 'unlimited',
      singleImagesCreated: limits.singleImagesRemaining !== null ? `remaining: ${limits.singleImagesRemaining}` : 'unlimited',
      editsToday: limits.editsRemainingToday !== null ? `remaining: ${limits.editsRemainingToday}` : 'unlimited'
    });

    // Always allow action regardless of limits
    return {
      allowed: true,
      reason: undefined,
      remaining: 999 // Show large number to indicate unlimited
    };
  } catch (error) {
    console.error('[RESEARCH MODE] Error checking user permission (allowing anyway):', error);
    // Even on error, allow the action
    return { allowed: true, reason: undefined, remaining: 999 };
  }
}

// Get detailed usage statistics (RESEARCH MODE: Returns unlimited stats)
export async function getUserUsageStats(userId: number) {
  // RESEARCH MODE: No usage tracking needed
  return {
    id: userId,
    projects_created: 0,
    single_images_created: 0,
    edits_today: 0,
    total_edits: 0
  };
}