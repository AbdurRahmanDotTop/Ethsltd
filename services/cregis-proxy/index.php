<?php
/**
 * Cregis Payment Engine Proxy
 * Deploy this on your Shared Web Hosting to use its static IP.
 */

// ==========================================
// CONFIGURATION - EDIT THESE VALUES
// ==========================================
$CREGIS_PE_API_KEY = "YOUR_CREGIS_PE_API_KEY_HERE";
$CREGIS_PE_PROJECT_ID = "YOUR_CREGIS_PE_PROJECT_ID_HERE";
$PROXY_SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING"; // Must match process.env.CREGIS_PROXY_SECRET in Cloudflare
$CREGIS_BASE_URL = "https://t-tkqzeuxf.cregis.io";
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

// 2. Read Input Payload
$input = file_get_contents('php://input');
$payload = json_decode($input, true);

if (!$payload || !isset($payload['amount']) || !isset($payload['currency']) || !isset($payload['third_party_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid payload"]);
    exit;
}

// 3. Construct Cregis Parameters
$timestamp = (string)(time() * 1000);
$nonce = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 6);

$params = [
    'pid' => $CREGIS_PE_PROJECT_ID,
    'timestamp' => $timestamp,
    'nonce' => $nonce,
    'amount' => (string)$payload['amount'],
    'currency' => $payload['currency'],
    'third_party_id' => $payload['third_party_id'],
];

if (isset($payload['callback_url'])) {
    $params['callback_url'] = $payload['callback_url'];
}

// 4. Generate MD5 Signature
ksort($params);
$paramString = '';
foreach ($params as $key => $value) {
    if ($value !== null && $value !== '') {
        $paramString .= $key . $value;
    }
}

$stringToSign = $CREGIS_PE_API_KEY . $paramString;
$sign = strtolower(md5($stringToSign));

$params['sign'] = $sign;

// 5. Make the Request to Cregis
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $CREGIS_BASE_URL . "/api/v1/payment/create");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'User-Agent: CregisProxy/1.0'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// 6. Return response to Cloudflare
http_response_code($httpcode);
if ($response === false) {
    echo json_encode(["error" => "cURL failed: " . $curlError]);
} else {
    echo $response;
}
?>
