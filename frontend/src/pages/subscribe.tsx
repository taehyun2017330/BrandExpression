import { Box, Typography, Paper, Divider, Modal, TextField, Checkbox, FormControlLabel, Chip } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { apiCall } from "@/module/utils/api";
import InicisPayment from "@/component/pageComponent/subscribe/InicisPayment";
import UnifiedButton from "@/component/ui/UnifiedButton";
import ContactMakerModal from "@/component/ui/ContactMakerModal";
import LoginContext from "@/module/ContextAPI/LoginContext";
import { withBasePath } from "@/utils/paths";

type MuiButtonColor = 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'info' | 'warning';

const plans = [
  {
    name: "베이직",
    description: "처음 아몬드를 접하고 경험하는 분들에게 추천해요",
    price: "무료",
    highlight: "무료 체험",
    highlights: [
      { label: "월 콘텐츠 발행 횟수 (그리드)", value: "1세트" },
      { label: "콘텐츠별 수정 횟수", value: "2회" },
      { label: "기획도 생성", value: "1세트" },
      { label: "전담 매니저 SNS 컨설팅", value: "X" },
    ],
    button: { label: "무료체험", color: "default", type: "black", disabled: false },
  },
  {
    name: "프로",
    description: "더 많은 콘텐츠를 제작하고 싶은 분들에게 추천해요",
    price: "9,900원",
    priceDetail: "30일 이용권",
    highlight: "구매하기",
    highlights: [
      { label: "30일간 이용 가능", value: "✓" },
      { label: "월 콘텐츠 발행 횟수 (그리드)", value: "4세트" },
      { label: "콘텐츠별 수정 횟수", value: "3회" },
      { label: "기획도 생성", value: "4세트" },
      { label: "전담 매니저 SNS 컨설팅", value: "X" },
    ],
    button: { label: "구매하기", color: "warning", type: "orange", disabled: false },
    recommend: true,
  },
  {
    name: "비즈니스",
    description: "처음 아몬드를 접하고 경험하는 분들에게 추천해요",
    price: "29,000원/월",
    highlight: "To Be Continued!",
    highlights: [
      { label: "월 콘텐츠 발행 횟수 (그리드)", value: "10세트" },
      { label: "콘텐츠별 수정 횟수", value: "10회" },
      { label: "기획도 생성", value: "10세트" },
      { label: "전담 매니저 SNS 컨설팅", value: "O" },
    ],
    button: { label: "To Be Continued!", color: "inherit", type: "grey", disabled: true },
  },
  {
    name: "프리미엄",
    description: "처음 아몬드를 접하고 경험하는 분들에게 추천해요",
    price: "79,000원/월",
    highlight: "To Be Continued!",
    highlights: [
      { label: "월 콘텐츠 발행 횟수 (그리드)", value: "무제한" },
      { label: "콘텐츠별 수정 횟수", value: "무제한" },
      { label: "기획도 생성", value: "무제한" },
      { label: "전담 매니저 SNS 컨설팅", value: "O" },
    ],
    button: { label: "To Be Continued!", color: "inherit", type: "grey", disabled: true },
  },
];

function PlanButton({ plan, onOrangeClick, currentPlan, membershipStatus, onManageClick }: { 
  plan: typeof plans[number]; 
  onOrangeClick?: () => void;
  currentPlan?: string;
  membershipStatus?: string;
  onManageClick?: () => void;
}) {
  const router = useRouter();
  const handleFreeTrial = async () => {
    // Always go to /project page
    router.push("/project");
  };
  
  // 프로 플랜이고 현재 프로 이용 중인 경우 (활성 상태)
  if (plan.name === "프로" && currentPlan === "pro" && membershipStatus === "active") {
    return (
      <UnifiedButton
        fullWidth
        variant="colored"
        sx={{ mb: 2, bgcolor: "#4CAF50", borderColor: "#4CAF50", '&:hover': { bgcolor: '#45a049', borderColor: '#45a049' } }}
        onClick={onManageClick}
      >
        이용 중 (프로필에서 확인)
      </UnifiedButton>
    );
  }
  
  // 프로 플랜이고 이용권이 만료된 경우 - 다시 구매 가능
  if (plan.name === "프로" && currentPlan === "pro" && membershipStatus === "cancelled") {
    return (
      <UnifiedButton
        fullWidth
        variant="colored"
        sx={{ mb: 2 }}
        onClick={onOrangeClick}
      >
        다시 구매하기
      </UnifiedButton>
    );
  }
  
  if (plan.button.type === "orange") {
    return (
      <UnifiedButton
        fullWidth
        variant="colored"
        sx={{ mb: 2 }}
        disabled={plan.button.disabled}
        onClick={onOrangeClick}
      >
        {plan.button.label}
      </UnifiedButton>
    );
  }
  if (plan.button.type === "black") {
    return (
      <UnifiedButton
        fullWidth
        variant="colored"
        sx={{ mb: 2, bgcolor: "#222", borderColor: "#222", '&:hover': { bgcolor: '#111', borderColor: '#111' } }}
        disabled={plan.button.disabled}
        onClick={handleFreeTrial}
      >
        {plan.button.label}
      </UnifiedButton>
    );
  }
  return (
    <UnifiedButton
      fullWidth
      variant="white"
      sx={{ mb: 2 }}
      disabled
    >
      {plan.button.label}
    </UnifiedButton>
  );
}

function ProTrialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [billingOption, setBillingOption] = useState<'monthly'>('monthly');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inicisModalOpen, setInicisModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <img src={withBasePath("/assets/arrow-up.png")} alt="업그레이드 화살표" style={{ width: 40, height: 'auto' }} />
        </Box>
        <Typography fontWeight={700} fontSize={28} mb={1}>
          프로 30일 이용권 구매
        </Typography>
        <Typography color="grey.600" fontSize={16} mb={3}>
          30일간 더 많은 콘텐츠를 편하게 제작하고, AI로 마케팅을 자동화 하세요.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField 
            label="이름" 
            size="small" 
            sx={{ flex: 1 }} 
            value={name} 
            onChange={e => setName(e.target.value)}
          />
          <TextField 
            label="회사 이름(선택)" 
            size="small" 
            sx={{ flex: 1 }} 
            value={company} 
            onChange={e => setCompany(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField 
            label="이메일" 
            type="email"
            size="small" 
            sx={{ flex: 1 }} 
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
          <TextField 
            label="휴대폰 번호" 
            size="small" 
            sx={{ flex: 1 }} 
            value={phone} 
            placeholder="010-1234-5678"
            onChange={e => setPhone(e.target.value)}
          />
        </Box>
        <Typography fontWeight={700} mb={1}>
          결제 수단
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <UnifiedButton 
            variant={paymentMethod === 'card' ? "colored" : "white"} 
            sx={{ flex: 1 }}
            onClick={() => setPaymentMethod('card')}
          >
            신용 카드
          </UnifiedButton>
          <UnifiedButton 
            variant={paymentMethod === 'bank' ? "colored" : "white"} 
            sx={{ flex: 1 }}
            onClick={() => setPaymentMethod('bank')}
          >
            무통장 입금
          </UnifiedButton>
        </Box>
        
        {paymentMethod === 'bank' ? (
          <>
            <Typography fontWeight={700} mb={1}>
              청구 정보
            </Typography>
            <Box sx={{ 
              border: "2px solid #FFA726", 
              borderRadius: 2, 
              p: 2, 
              mb: 3,
              bgcolor: '#FFF3E0'
            }}>
              <Typography fontWeight={600} fontSize={15} mb={1}>
                입금 계좌 정보
              </Typography>
              <Typography fontSize={14} color="grey.700" mb={0.5}>
                은행: 신한은행
              </Typography>
              <Typography fontSize={14} color="grey.700" mb={0.5}>
                계좌번호: 110-123-456789
              </Typography>
              <Typography fontSize={14} color="grey.700" mb={0.5}>
                예금주: 아몬드주식회사
              </Typography>
              <Typography fontSize={14} color="grey.700" fontWeight={600}>
                입금금액: ₩ 9,900원
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography fontWeight={700} mb={1}>
              결제 정보
            </Typography>
            <Box sx={{ 
              border: "2px solid #FFA726", 
              borderRadius: 2, 
              p: 2, 
              mb: 3,
              bgcolor: '#FFF3E0'
            }}>
              <Typography fontWeight={600} fontSize={15} mb={1}>
                프로 30일 이용권
              </Typography>
              <Typography fontSize={14} color="grey.700" mb={0.5}>
                결제일로부터 30일간 이용 가능
              </Typography>
              <Typography fontSize={14} color="grey.700" fontWeight={600}>
                결제금액: ₩ 9,900원 (일회성 결제)
              </Typography>
            </Box>
          </>
        )}
        
        <Box sx={{ mb: 3 }}>
          <FormControlLabel 
            control={
              <Checkbox 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                sx={{
                  color: '#FFA726',
                  '&.Mui-checked': {
                    color: '#FFA726',
                  },
                }}
              />
            } 
            label="구매조건 확인 및 결제진행에 동의" 
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
          <Box>
            <Typography fontWeight={700} fontSize={22}>
              ₩ 9,900원
            </Typography>
            <Typography fontSize={14} color="grey.600">
              30일 이용권
            </Typography>
            <UnifiedButton 
              variant="white" 
              sx={{ mt: 1, fontSize: 14 }} 
              onClick={() => setContactModalOpen(true)}
            >
              문의 사항이 있으신가요?
            </UnifiedButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <UnifiedButton 
              variant="white" 
              onClick={onClose}
            >
              취소
            </UnifiedButton>
            <UnifiedButton 
              variant="colored" 
              disabled={!agreedToTerms}
              onClick={() => {
                if (!agreedToTerms) {
                  alert('구매조건 확인 및 결제진행에 동의해주세요.');
                  return;
                }
                if (paymentMethod === 'card') {
                  if (!name || !email || !phone) {
                    alert('이름, 이메일, 휴대폰 번호를 모두 입력해주세요.');
                    return;
                  }
                  setInicisModalOpen(true);
                }
              }}
            >
              {paymentMethod === 'bank' ? '무통장 입금 신청' : '프로 30일 이용권 구매'}
            </UnifiedButton>
          </Box>
        </Box>
        
        <InicisPayment
          open={inicisModalOpen}
          onClose={() => setInicisModalOpen(false)}
          planName="프로"
          planPrice={9900}
          buyerName={name}
          buyerEmail={email}
          buyerTel={phone}
        />
        <ContactMakerModal 
          open={contactModalOpen} 
          onClose={() => setContactModalOpen(false)} 
        />
      </Box>
    </Modal>
  );
}

export default function SubscribePage() {
  const router = useRouter();
  const { userInfo: loginUserInfo } = useContext(LoginContext);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("basic");
  const [membershipStatus, setMembershipStatus] = useState<string>("active");

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await apiCall({
          url: "/auth/user",
          method: "GET",
        });
        console.log("User info:", response.data);
        setUserInfo(response.data);
        setCurrentPlan(response.data.grade || "basic");
        setMembershipStatus(response.data.membershipStatus || "active");
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleManageSubscription = () => {
    router.push("/profile");
  };

  return (
    <Box sx={{ bgcolor: "#FFF3E0", minHeight: "100vh", pb: 4.5 }}>
      <ProTrialModal open={proModalOpen} onClose={() => setProModalOpen(false)} />
      <Box sx={{ maxWidth: 1200, mx: "auto", pt: 6, px: { xs: 2, md: 4 } }}>
        {/* 현재 프로 이용 상태 표시 */}
        {currentPlan === 'pro' && membershipStatus === 'active' && userInfo?.membershipEndDate && (
          <Box sx={{ 
            mb: 3,
            mx: { xs: 0, md: '5%', lg: '8%' }
          }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: '#fff', 
              borderRadius: 3,
              border: '2px solid #FFA726',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
            <Box>
              <Typography fontSize={15} fontWeight={700} mb={0.75}>
                🎉 현재 프로 이용권을 사용 중입니다!
              </Typography>
              <Typography color="grey.600">
                {new Date(userInfo.membershipEndDate).toLocaleDateString('ko-KR')}까지 이용 가능합니다.
              </Typography>
            </Box>
            <UnifiedButton variant="colored" onClick={handleManageSubscription}>
              프로필에서 확인
            </UnifiedButton>
            </Box>
          </Box>
        )}
        
        {/* 만료된 이용권 상태 표시 */}
        {currentPlan === 'pro' && membershipStatus === 'cancelled' && (
          <Box sx={{ 
            mb: 3,
            mx: { xs: 0, md: '5%', lg: '8%' }
          }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: '#fff', 
              borderRadius: 3,
              border: '2px solid #FF9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
            <Box>
              <Typography fontSize={15} fontWeight={700} mb={0.75} color="#FF9800">
                이용권이 만료되었습니다
              </Typography>
              <Typography color="grey.600">
                프로 이용권을 다시 구매하시면 더 많은 기능을 이용하실 수 있습니다.
              </Typography>
            </Box>
            <UnifiedButton variant="colored" onClick={handleManageSubscription}>
              프로필 보기
            </UnifiedButton>
            </Box>
          </Box>
        )}
        <Box sx={{ 
          mx: { xs: 0, md: '5%', lg: '8%' }
        }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: { xs: 'wrap', md: 'nowrap' }, overflowX: { xs: 'auto', md: 'visible' } }}>
            {plans.map((plan) => (
              <Box key={plan.name} sx={{ minWidth: 250, display: 'flex', flex: { xs: '0 0 auto', md: '1 1 0' } }}>
              <Paper
                elevation={plan.recommend ? 8 : 2}
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  minHeight: 420,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  border: plan.recommend && !plan.button.disabled ? "2px solid #FFA726" : undefined,
                  position: "relative",
                  bgcolor: "#fff",
                  width: 1,
                }}
              >
                {plan.recommend && currentPlan !== 'pro' && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      bgcolor: "#FFF3E0",
                      color: "#FF9800",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  >
                    가장 추천해요
                  </Box>
                )}
                {currentPlan === 'pro' && plan.name === '프로' && membershipStatus === 'active' && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      bgcolor: "#4CAF50",
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  >
                    이용 중
                  </Box>
                )}
                {currentPlan === 'pro' && plan.name === '프로' && membershipStatus === 'cancelled' && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      bgcolor: "#FF9800",
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  >
                    이용 만료
                  </Box>
                )}
                <Typography fontWeight={700} fontSize={21} mb={1} align="left">
                  {plan.name}
                </Typography>
                <Typography color="grey.600" fontSize={11} mb={2} align="left">
                  {plan.description}
                </Typography>
                <Typography fontWeight={700} fontSize={18} mb={0.5} align="left">
                  {plan.price}
                </Typography>
                {plan.priceDetail && (
                  <Typography fontSize={14} color="grey.600" mb={2} align="left">
                    {plan.priceDetail}
                  </Typography>
                )}
                <PlanButton 
                  plan={plan} 
                  onOrangeClick={() => {
                    // Check if user is logged in before opening payment modal
                    if (!loginUserInfo?.id) {
                      alert("구독하시려면 먼저 로그인해주세요.");
                      router.push("/login");
                      return;
                    }
                    setProModalOpen(true);
                  }} 
                  currentPlan={currentPlan}
                  membershipStatus={membershipStatus}
                  onManageClick={handleManageSubscription}
                />
                <Divider sx={{ my: 2, width: "100%" }} />
                <Typography fontWeight={700} fontSize={12} mb={1} align="left">
                  하이라이트
                </Typography>
                <Box component="ul" sx={{ pl: 0, m: 0, width: "100%" }}>
                  {plan.highlights.map((hl, i) => (
                    <Box
                      key={i}
                      component="li"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        mb: 1,
                        fontWeight: 500,
                        listStyle: "none",
                        px: 0,
                      }}
                    >
                      <span>{hl.label}</span>
                      <span style={{ minWidth: 32, textAlign: "right", display: "inline-block" }}>{hl.value}</span>
                    </Box>
                  ))}
                </Box>
              </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}