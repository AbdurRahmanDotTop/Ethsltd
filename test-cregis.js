const payload = {
  pid: "1446672836255744",
  timestamp: Date.now().toString(),
  nonce: "123456",
  sign: "wrongsignature"
};

fetch('https://t-tkqzeuxf.cregis.io/v1/payment/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  body: JSON.stringify(payload)
})
.then(res => {
  console.log('Status:', res.status);
  return res.text();
})
.then(text => console.log('Body:', text))
.catch(err => console.error(err));
