import cron from "node-cron";
import { processMonthlyBilling, processExpiredMemberships } from "../services/billingService";
import { processMockMonthlyBilling, processExpiredMemberships as processMockExpiredMemberships } from "../services/mockBillingService";
import { processDirectMonthlyBilling } from "../services/inicisDirectBillingService";
import { processAllRecurringPayments } from "../services/inicisRecurringBillingService";

/**
 * 정기결제 크론 작업 설정
 */
export function initBillingCron() {
  // TEST MODE: 매 1분마다 실행 (프로덕션에서는 "0 2 * * *"로 변경)
  // Original: "0 2 * * *" = 매일 오전 2시
  // Test: "* * * * *" = 매 1분마다
  const cronSchedule = process.env.BILLING_CRON_SCHEDULE || "* * * * *";
  
  cron.schedule(cronSchedule, async () => {
    console.log("[CRON] 정기결제 작업 시작 - " + new Date().toISOString());
    
    try {
      // 정기결제 처리 - 모드 선택
      const useMockBilling = process.env.USE_MOCK_BILLING === "true";
      const useDirectBilling = process.env.USE_DIRECT_BILLING === "true";
      const useRecurringBilling = process.env.USE_RECURRING_BILLING === "true";
      
      if (useMockBilling) {
        console.log("[CRON] Using MOCK billing for testing");
        await processMockMonthlyBilling();
      } else if (useDirectBilling) {
        console.log("[CRON] Using INICIS Direct billing");
        await processDirectMonthlyBilling();
      } else if (useRecurringBilling) {
        console.log("[CRON] Using INICIS Recurring billing (WebStandard billing key)");
        await processAllRecurringPayments();
      } else {
        await processMonthlyBilling();
      }
      
      // 만료된 멤버십 처리
      await processExpiredMemberships();
      
      console.log("[CRON] 정기결제 작업 완료 - " + new Date().toISOString());
    } catch (error) {
      console.error("[CRON] 정기결제 작업 실패:", error);
    }
  });

  // 매시간 만료된 멤버십 체크 (더 빠른 반응을 위해)
  cron.schedule("0 * * * *", async () => {
    console.log("[CRON] 멤버십 만료 체크 - " + new Date().toISOString());
    
    try {
      await processExpiredMemberships();
    } catch (error) {
      console.error("[CRON] 멤버십 만료 체크 실패:", error);
    }
  });

  console.log("[CRON] 빌링 크론 작업이 등록되었습니다.");
}

/**
 * 즉시 정기결제 실행 (테스트용)
 */
export async function runBillingNow() {
  console.log("[MANUAL] 수동 정기결제 실행 - " + new Date().toISOString());
  
  try {
    const useMockBilling = process.env.USE_MOCK_BILLING === "true";
    const useDirectBilling = process.env.USE_DIRECT_BILLING === "true";
    const useRecurringBilling = process.env.USE_RECURRING_BILLING === "true";
    
    if (useMockBilling) {
      await processMockMonthlyBilling();
      await processMockExpiredMemberships();
    } else if (useDirectBilling) {
      await processDirectMonthlyBilling();
      await processExpiredMemberships();
    } else if (useRecurringBilling) {
      await processAllRecurringPayments();
      await processExpiredMemberships();
    } else {
      await processMonthlyBilling();
      await processExpiredMemberships();
    }
    console.log("[MANUAL] 수동 정기결제 완료");
  } catch (error) {
    console.error("[MANUAL] 수동 정기결제 실패:", error);
  }
}