const payload = {
  _proxy: {
    service: "PE",
    endpoint: "/v1/payment/create"
  },
  payload: {
    currency: "USDT",
    amount: "200",
    third_party_id: "TX-123456"
  }
};

fetch('https://techilyfly.com/ethsltd/cregis-proxy.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Proxy-Secret': 'ETHSLTD_CREGIS_PROXY_SECURE_TOKEN_2026',
    'User-Agent': 'Mozilla/5.0'
  },
  body: JSON.stringify(payload)
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error(err));
