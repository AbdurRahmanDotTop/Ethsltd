async function test() {
  const uas = [
    'CregisProxy/2.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'curl/7.68.0',
    ''
  ];
  for (const ua of uas) {
    const payload = {
      pid: "1446672836255744",
      timestamp: "1723737600000",
      nonce: "abcdef",
      sign: "mocksignature1234567890abcdef"
    };
    const res = await fetch('https://t-tkqzeuxf.cregis.io/v1/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': ua
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log(`UA: "${ua}" => Status: ${res.status}, Body: ${text}`);
  }
}
test();
