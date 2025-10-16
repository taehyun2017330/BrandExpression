const express = require("express"); 
const app = express();
const crypto = require('crypto'); 
const bodyParser = require("body-parser");
const axios = require('axios');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// SHA256 hash
function generateSHA256Hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Main payment page - MUST be before static files
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'real-monthly.html'));
});

// Check storage utility
app.get("/check", (req, res) => {
    res.sendFile(path.join(__dirname, 'check-storage.html'));
});

// Real payment return handler
app.post("/real-return", async (req, res) => {
    console.log("\n[Real Payment Return] Received:", req.body);
    
    if (req.body.resultCode === "0000") {
        // Real payment successful - need to get TID from auth token
        let tid = req.body.tid || '';
        let paymentInfo = {};
        
        if (req.body.authToken && req.body.authUrl) {
            try {
                // Clean up authToken
                const authToken = req.body.authToken.replace(/[\r\n]/g, '').trim();
                const timestamp = Date.now().toString();
                const signature = generateSHA256Hash(`authToken=${authToken}&timestamp=${timestamp}`);
                
                // Create form data
                const params = new URLSearchParams();
                params.append('mid', req.body.mid);
                params.append('authToken', authToken);
                params.append('timestamp', timestamp);
                params.append('signature', signature);
                params.append('charset', 'UTF-8');
                params.append('format', 'JSON');
                
                const authResponse = await axios.post(req.body.authUrl, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                
                console.log("[Auth Response]:", authResponse.data);
                
                if (authResponse.data) {
                    tid = authResponse.data.tid || tid;
                    paymentInfo = {
                        cardName: authResponse.data.P_FN_NM || authResponse.data.CARD_Code || '',
                        cardNum: authResponse.data.CARD_Num || '',
                        applDate: authResponse.data.applDate || '',
                        applTime: authResponse.data.applTime || ''
                    };
                }
            } catch (authError) {
                console.error("[Auth Error]:", authError.response?.data || authError.message);
            }
        }
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Complete</title>
            </head>
            <body>
                <script>
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'real_payment_complete',
                            params: {
                                success: true,
                                tid: '${tid}',
                                orderNumber: '${req.body.orderNumber}',
                                message: 'Payment successful - 100원 charged',
                                paymentInfo: ${JSON.stringify(paymentInfo)}
                            }
                        }, '*');
                        window.close();
                    } else {
                        alert('Payment successful!\\n100원 has been charged.\\nOrder: ${req.body.orderNumber}\\nTID: ${tid}');
                        window.location.href = '/';
                    }
                </script>
            </body>
            </html>
        `);
    } else {
        // Error
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Failed</title>
            </head>
            <body>
                <script>
                    alert('Payment failed: ${req.body.resultMsg}');
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'real_payment_complete',
                            params: {
                                success: false,
                                message: '${req.body.resultMsg}'
                            }
                        }, '*');
                        window.close();
                    } else {
                        window.location.href = '/';
                    }
                </script>
            </body>
            </html>
        `);
    }
});

// GET version for return
app.get("/real-return", (req, res) => {
    req.body = req.query;
    return app._router.handle(req, res);
});

// API for automatic charging using saved card
app.post("/api/auto-charge", async (req, res) => {
    const { savedTid, amount, paymentNumber, cardInfo } = req.body;
    
    console.log("\n[Auto Charge] Processing automatic payment:", {
        paymentNumber,
        amount,
        savedTid
    });
    
    // In production, this would call INICIS billing API with the saved billing key
    // For test mode, we simulate the automatic charge
    
    // Simulate processing delay
    setTimeout(() => {
        // Generate a simulated TID for this automatic payment
        const autoTid = `AUTO_PAY${paymentNumber}_${Date.now()}`;
        
        console.log("[Auto Charge] Payment successful:", {
            paymentNumber,
            amount,
            autoTid,
            message: "Automatic payment processed using saved card"
        });
        
        res.json({
            success: true,
            tid: autoTid,
            amount: amount,
            message: `Payment ${paymentNumber} automatically charged to saved card`,
            note: "In production, this would use INICIS billing API to charge the saved card"
        });
    }, 2000); // 2 second delay to simulate processing
});

// Close page
app.get("/close.html", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Close</title>
            <script type="text/javascript" src="https://stdpay.inicis.com/stdjs/INIStdPay_close.js" charset="UTF-8"></script>
        </head>
        <body></body>
        </html>
    `);
});

// Popup page
app.get("/popup.html", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>INICIS Payment</title>
        </head>
        <body>
        </body>
        </html>
    `);
});

// Static files - MUST be after all routes
app.use(express.static(__dirname));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    ========================================
    🚀 INICIS Monthly Payment Test Server
    ========================================
    
    Main Page: http://localhost:${PORT}
    Check Storage: http://localhost:${PORT}/check
    
    ========================================
    `);
});