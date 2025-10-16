#!/bin/bash

echo "=== PAYMENT FLOW MONITOR ==="
echo "Monitoring INICIS BILLAUTH payment process..."
echo "Press Ctrl+C to stop"
echo ""

# Monitor backend logs for payment-related activities
echo "Watching for:"
echo "- Hash generation requests"
echo "- BILLAUTH endpoint calls" 
echo "- Billing key registration"
echo "- Payment callbacks"
echo ""

# Start monitoring
tail -f /Users/taehyun/Downloads/Amond_separated/amond-backend/logs/*.log 2>/dev/null | grep -E "(billing|payment|BILLAUTH|inicis|hash|Pro|빌링키)" &

# Also monitor console output if backend is running in console
echo "Ready to monitor. Please proceed with your payment..."
echo ""

# Monitor database for new billing keys
while true; do
  sleep 5
  echo -n "."
done