// /tmp/check-env.js
const fs = require('fs');
const env = process.env;
console.log('PAYSTACK_SECRET_KEY exists:', !!env.PAYSTACK_SECRET_KEY);
console.log('PAYSTACK_SECRET_KEY starts with:', env.PAYSTACK_SECRET_KEY ? env.PAYSTACK_SECRET_KEY.substring(0, 5) : 'N/A');
