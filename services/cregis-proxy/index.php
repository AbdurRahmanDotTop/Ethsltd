<?php
/**
 * Cregis Dynamic Multi-Service Proxy
 * Handles both Payment Engine (Deposits) and WaaS (Withdrawals/Addresses)
 */

// ==========================================
// CONFIGURATION - CREDENTIALS
// ==========================================
$PROXY_SECRET = "ETHSLTD_CREGIS_PROXY_SECURE_TOKEN_2026";
$CREGIS_BASE_URL = "https://t-tkqzeuxf.cregis.io";

// Payment Engine (PE) - For Auto Deposits
$CREGIS_PE_API_KEY = "7953f2a93d624526bba56bf3743477a7";
$CREGIS_PE_PROJECT_ID = "1446672836255744";

// Wallet-as-a-Service (WAAS) - For Payouts/Withdrawals
$CREGIS_WAAS_API_KEY = "fcd3beae37bf4ce5bb8c624b80f810d0";
$CREGIS_WAAS_PROJECT_ID = "1446671650562048";
// ==========================================

header('Content-Type: application/json');

// 1. Verify Authorization
$headers = getallheaders();
$authHeader = $headers['X-Proxy-Secret'] ?? $headers['x-proxy-secret'] ?? '';

if ($authHeader !== $PROXY_SECRET) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access to proxy"]);
    exit;
}

// 2. Read Input
$input = file_get_contents('php://input');
$request = json_decode($input, true);

if (!$request || !isset($request['_proxy']) || !isset($request['payload'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid proxy structure. Expected _proxy and payload objects."]);
    exit;
}

$service = $request['_proxy']['service'] ?? 'PE'; // 'PE' or 'WAAS' or 'DEBUG_IP'
$endpoint = $request['_proxy']['endpoint'] ?? '/api/v1/payment/create';
$payload = $request['payload'];

// Debug Outbound IP
if ($service === 'DEBUG_IP') {
    $ch = curl_init('https://api.ipify.org?format=json');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $ip = curl_exec($ch);
    curl_close($ch);
    echo $ip;
    exit;
}

// Determine keys based on service
$apiKey = ($service === 'WAAS') ? $CREGIS_WAAS_API_KEY : $CREGIS_PE_API_KEY;
$projectId = ($service === 'WAAS') ? $CREGIS_WAAS_PROJECT_ID : $CREGIS_PE_PROJECT_ID;

// 3. Construct Cregis Parameters
$timestamp = (string)(time() * 1000);
$nonce = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 6);

// Initialize params with project ID, timestamp, and nonce
$params = [
    'pid' => $projectId,
    'timestamp' => $timestamp,
    'nonce' => $nonce,
];

// Merge the user's payload (excluding pid, timestamp, nonce, sign if accidentally passed)
foreach ($payload as $k => $v) {
    if (!in_array($k, ['pid', 'timestamp', 'nonce', 'sign'])) {
        // Cregis expects stringified numbers usually, but we keep it as passed
        $params[$k] = (string)$v;
    }
}

// 4. Generate MD5 Signature
ksort($params);
$paramString = '';
foreach ($params as $key => $value) {
    if ($value !== null && $value !== '') {
        $paramString .= $key . $value;
    }
}

$stringToSign = $apiKey . $paramString;
$sign = strtolower(md5($stringToSign));
$params['sign'] = $sign;

// 5. Make the Request to Cregis
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $CREGIS_BASE_URL . $endpoint);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'User-Agent: CregisProxy/2.0'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// 6. Return response to Cloudflare
http_response_code($httpcode);
if ($response === false || trim($response) === '') {
    echo json_encode([
        "error" => "Cregis API Error (Status: $httpcode)",
        "details" => "Cregis returned an empty response. This usually means the Cregis WAF blocked the request because the IP (145.79.58.207) is not whitelisted properly.",
        "curl_error" => $curlError
    ]);
} else {
    echo $response;
}
?>
