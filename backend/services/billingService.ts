import axios from "axios";
import crypto from "crypto";
import { queryAsync } from "../module/commonFunction";
import dotenv from "dotenv";
dotenv.config();

// INICIS 설정
const INICIS_CONFIG = {
  test: {
    mid: process.env.INICIS_TEST_MID || "INIBillTst",
    signKey: process.env.INICIS_TEST_SIGN_KEY || "SU5JTElURV9UUklQTEVERVNfS0VZU1RS",
    apiKey: process.env.INICIS_TEST_API_KEY || "rKnPljRn5m6J9Mzz",
    apiIv: process.env.INICIS_TEST_API_IV || "W2KLNKra6Wxc1P==",
    // Using v2 API for billing
    billingUrl: "https://iniapi.inicis.com/v2/pg/billing"
  },
  production: {
    mid: process.env.INICIS_PROD_MID || "",
    signKey: process.env.INICIS_PROD_SIGN_KEY || "",
    apiKey: process.env.INICIS_PROD_API_KEY || "",
    apiIv: process.env.INICIS_PROD_API_IV || "",
    billingUrl: "https://api.inicis.com/v2/pg/billing"
  }
};

const isProduction = process.env.NODE_ENV === "production";
const config = isProduction ? INICIS_CONFIG.production : INICIS_CONFIG.test;

// 테스트 모드 설정
const TEST_MODE = process.env.BILLING_TEST_MODE === "true";
const BILLING_INTERVAL_MINUTES = TEST_MODE ? 1 : 0; // 테스트: 1분, 프로덕션: 0 (실제 날짜 계산)

/**
 * SHA256 해시 생성 함수
 */
function generateSHA256Hash(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * SHA512 해시 생성 함수 (v2 API용)
 */
function generateSHA512Hash(data: string): string {
  return crypto.createHash("sha512").update(data).digest("hex");
}

/**
 * YYYYMMDDHHMMSS 형식의 timestamp 생성
 */
function getFormattedTimestamp(): string {
  const now = new Date();
  const pad = (n: number, length: number): string => {
    let str = '' + n;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  };
  
  const yyyy = now.getFullYear().toString();
  const MM = pad(now.getMonth() + 1, 2);
  const dd = pad(now.getDate(), 2);
  const hh = pad(now.getHours(), 2);
  const mm = pad(now.getMinutes(), 2);
  const ss = pad(now.getSeconds(), 2);
  
  return yyyy + MM + dd + hh + mm + ss;
}

/**
 * 활성 구독자들의 정기결제 처리
 */
export async function processMonthlyBilling() {
  console.log("[Billing] Starting monthly billing process...");
  
  try {
    // 결제가 필요한 활성 구독자 조회
    const activeSubs = await queryAsync(`
      SELECT 
        ps.*,
        bk.billingKey,
        bk.cardNumber,
        bk.cardName,
        u.email,
        u.name
      FROM payment_subscriptions ps
      JOIN billing_keys bk ON ps.fk_userId = bk.fk_userId AND bk.status = 'active'
      JOIN user u ON ps.fk_userId = u.id
      WHERE ps.status = 'active'
        AND ps.nextBillingDate <= NOW()
        AND ps.planType != 'basic'
      ORDER BY ps.nextBillingDate ASC
      LIMIT 10
    `);

    console.log(`[Billing] Found ${activeSubs.length} subscriptions due for billing`);

    for (const subscription of activeSubs) {
      await processSingleBilling(subscription);
      // 요청 사이에 지연 추가 (rate limiting 방지)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("[Billing] Monthly billing process completed");
  } catch (error) {
    console.error("[Billing] Error in processMonthlyBilling:", error);
  }
}

/**
 * 개별 구독 결제 처리
 */
async function processSingleBilling(subscription: any) {
  const timestamp = getFormattedTimestamp();
  const moid = `${config.mid}_${timestamp}`;
  const type = "billing"; // billing 고정
  const paymethod = "card"; // card 고정
  const clientIp = "127.0.0.1";
  
  try {
    console.log(`[Billing] Processing payment for user ${subscription.fk_userId}, plan: ${subscription.planType}`);

    // Plan별 가격 설정
    const planPrices: { [key: string]: number } = {
      'pro': 9900,
      'business': 29000,
      'premium': 79000
    };

    const price = planPrices[subscription.planType] || subscription.price;
    const goodName = `Amond ${subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)} 멤버십`;

    // v2 API용 data 객체 생성 (INICIS 템플릿 참조)
    const data = {
      url: "www.mond.io.kr",
      moid: moid,
      goodName: goodName,
      buyerName: subscription.name || subscription.email?.split('@')[0] || "구매자",
      buyerEmail: subscription.email || "test@inicis.com",
      buyerTel: "01000000000",
      price: price.toString(),
      billKey: subscription.billingKey // Bill API로 발급받은 빌링키 사용
    };

    // Hash Encryption (INICIS 템플릿과 동일)
    let plainTxt = config.apiKey + config.mid + type + timestamp + JSON.stringify(data);
    plainTxt = plainTxt.replace(/\\/g, ''); 
    const hashData = generateSHA512Hash(plainTxt);

    // v2 API 요청 데이터
    const requestData = {
      mid: config.mid,
      type: type,
      paymethod: paymethod,
      timestamp: timestamp,
      clientIp: clientIp,
      data: data,
      hashData: hashData
    };

    console.log(`[Billing] Sending v2 API request for order ${moid}`);

    // INICIS v2 빌링 API 호출 (JSON)
    const response = await axios.post(config.billingUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      timeout: 30000
    });

    const result = response.data;
    
    // 결제 로그 저장
    await queryAsync(`
      INSERT INTO payment_logs (
        fk_userId,
        orderNumber,
        billingKey,
        price,
        goodName,
        buyerName,
        buyerTel,
        buyerEmail,
        paymentStatus,
        inicisResponse,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      subscription.fk_userId,
      moid,
      subscription.billingKey,
      price,
      goodName,
      subscription.name || subscription.email?.split('@')[0] || "구매자",
      "01000000000",
      subscription.email || "test@inicis.com",
      (result.resultCode === "00") ? "success" : "failed",
      JSON.stringify(result)
    ]);

    if (result.resultCode === "00") {
      console.log(`[Billing] SUCCESS - User ${subscription.fk_userId} charged ${price} KRW`);
      console.log(`[Billing] TID: ${result.tid}`);
      
      // 결제 성공 시 다음 결제일 업데이트
      const nextBillingDate = new Date();
      
      // 테스트 모드 또는 프로덕션 모드에 따라 다음 결제일 설정
      if (TEST_MODE) {
        nextBillingDate.setMinutes(nextBillingDate.getMinutes() + BILLING_INTERVAL_MINUTES);
        console.log(`[TEST MODE] Next billing in ${BILLING_INTERVAL_MINUTES} minute(s)`);
      } else {
        // 프로덕션: 정확히 1달 후
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      }
      
      await queryAsync(`
        UPDATE payment_subscriptions 
        SET nextBillingDate = ?,
            updatedAt = NOW()
        WHERE id = ?
      `, [nextBillingDate, subscription.id]);

      // 멤버십 종료일 연장
      await queryAsync(`
        UPDATE user 
        SET membershipEndDate = ?
        WHERE id = ?
      `, [nextBillingDate, subscription.fk_userId]);

      console.log(`[Billing] Updated next billing date for user ${subscription.fk_userId}`);
    } else {
      // 결제 실패 처리
      console.error(`[Billing] FAILED - User ${subscription.fk_userId}: ${result.resultMsg}`);
      
      // 3회 실패 시 구독 일시정지
      const failCount = await queryAsync(`
        SELECT COUNT(*) as count 
        FROM payment_logs 
        WHERE fk_userId = ? 
          AND paymentStatus = 'failed' 
          AND createdAt > DATE_SUB(NOW(), INTERVAL 7 DAY)
      `, [subscription.fk_userId]);

      if (failCount[0].count >= 3) {
        await queryAsync(`
          UPDATE payment_subscriptions 
          SET status = 'suspended',
              updatedAt = NOW()
          WHERE id = ?
        `, [subscription.id]);
        
        await queryAsync(`
          UPDATE user 
          SET membershipStatus = 'expired' 
          WHERE id = ?
        `, [subscription.fk_userId]);
        
        console.log(`[Billing] Subscription suspended for user ${subscription.fk_userId} after 3 failures`);
      }
    }
  } catch (error) {
    console.error(`[Billing] Error processing payment for user ${subscription.fk_userId}:`, error);
    
    // Plan별 가격 설정 (에러 처리를 위해 다시 정의)
    const planPrices: { [key: string]: number } = {
      'pro': 9900,
      'business': 29000,
      'premium': 79000
    };
    const price = planPrices[subscription.planType] || subscription.price;
    
    // 에러 로그 저장
    await queryAsync(`
      INSERT INTO payment_logs (
        fk_userId,
        orderNumber,
        billingKey,
        price,
        goodName,
        buyerName,
        buyerTel,
        buyerEmail,
        paymentStatus,
        inicisResponse,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'failed', ?, NOW())
    `, [
      subscription.fk_userId,
      moid,
      subscription.billingKey,
      price,
      `Amond ${subscription.planType} 멤버십`,
      subscription.name || subscription.email?.split('@')[0] || "구매자",
      "01000000000",
      subscription.email || "test@inicis.com",
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) })
    ]);
  }
}

/**
 * 만료된 멤버십 처리
 */
export async function processExpiredMemberships() {
  console.log("[Billing] Checking for expired memberships...");
  
  try {
    // 만료된 멤버십을 basic으로 다운그레이드
    const result = await queryAsync(`
      UPDATE user 
      SET grade = 'basic', 
          membershipStatus = 'expired'
      WHERE grade IN ('pro', 'business', 'premium')
        AND membershipEndDate < NOW()
        AND membershipStatus IN ('active', 'cancelled')
    `);

    if (result.affectedRows > 0) {
      console.log(`[Billing] Downgraded ${result.affectedRows} expired memberships to basic`);
    }
    
    // 취소된 구독 중 만료일이 지난 것들을 expired로 변경
    const expiredSubs = await queryAsync(`
      UPDATE payment_subscriptions 
      SET status = 'expired',
          updatedAt = NOW()
      WHERE status = 'cancelled' 
        AND nextBillingDate < NOW()
    `);
    
    if (expiredSubs.affectedRows > 0) {
      console.log(`[Billing] Marked ${expiredSubs.affectedRows} cancelled subscriptions as expired`);
    }
    
    // 정지된 구독 중 7일이 지난 것들을 expired로 변경
    const suspendedExpired = await queryAsync(`
      UPDATE payment_subscriptions 
      SET status = 'expired',
          updatedAt = NOW()
      WHERE status = 'suspended' 
        AND updatedAt < DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    
    if (suspendedExpired.affectedRows > 0) {
      console.log(`[Billing] Marked ${suspendedExpired.affectedRows} suspended subscriptions as expired`);
    }
  } catch (error) {
    console.error("[Billing] Error processing expired memberships:", error);
  }
}