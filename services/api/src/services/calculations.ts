import { eq } from 'drizzle-orm';
import { currencyRates, payment_methods, platformSettings } from 'database';

export async function calculateDepositPreview(
  db: any,
  amount: number,
  currencyCode: string,
  paymentMethodId: string | null
) {
  let grossUsdt = amount;
  let conversionRateValue = 1;
  
  if (currencyCode !== 'USDT') {
    const rateRecord = await db.select().from(currencyRates).where(eq(currencyRates.code, currencyCode)).get();
    if (!rateRecord || rateRecord.status !== 'ACTIVE') {
      throw new Error(`Active Global Currency Rate not found for ${currencyCode}`);
    }
    conversionRateValue = parseFloat(rateRecord.ratePerUsdt);
    if (conversionRateValue <= 0) {
      throw new Error(`Invalid conversion rate for ${currencyCode}`);
    }
    grossUsdt = amount / conversionRateValue;
  }

  let depositFee = 0;
  if (paymentMethodId) {
    const pm = await db.select().from(payment_methods).where(eq(payment_methods.id, paymentMethodId)).get();
    if (pm) {
      if (pm.fee_type === 'FIXED') {
        depositFee = pm.fee_value;
      } else if (pm.fee_type === 'PERCENTAGE') {
        depositFee = (grossUsdt * pm.fee_value) / 100;
      } else if (pm.fee_type === 'PERCENTAGE_AND_FIXED') {
        depositFee = (grossUsdt * pm.fee_value) / 100;
      }
    }
  }

  let otherFees = 0;
  try {
    const generalFeeSetting = await db.select().from(platformSettings).where(eq(platformSettings.key, 'GLOBAL_DEPOSIT_FEE_USDT')).get();
    if (generalFeeSetting) {
      otherFees = parseFloat(generalFeeSetting.value);
    }
  } catch(e) {}

  const totalFees = depositFee + otherFees;
  const netUsdt = grossUsdt - totalFees;

  if (netUsdt <= 0) {
    throw new Error('Deposit amount after fees is too low.');
  }

  return {
    originalAmount: amount,
    originalCurrency: currencyCode,
    conversionRate: conversionRateValue,
    grossUsdt: Number(grossUsdt.toFixed(4)),
    depositFee: Number(depositFee.toFixed(4)),
    otherFees: Number(otherFees.toFixed(4)),
    totalFees: Number(totalFees.toFixed(4)),
    netUsdt: Number(netUsdt.toFixed(4)),
  };
}

export async function calculateWithdrawalPreview(
  db: any,
  usdtAmount: number,
  currencyCode: string,
  paymentMethodId: string | null
) {
  let withdrawalFee = 0;
  if (paymentMethodId) {
    const pm = await db.select().from(payment_methods).where(eq(payment_methods.id, paymentMethodId)).get();
    if (pm) {
      if (pm.fee_type === 'FIXED') {
        withdrawalFee = pm.fee_value;
      } else if (pm.fee_type === 'PERCENTAGE') {
        withdrawalFee = (usdtAmount * pm.fee_value) / 100;
      } else if (pm.fee_type === 'PERCENTAGE_AND_FIXED') {
        withdrawalFee = (usdtAmount * pm.fee_value) / 100;
      }
    }
  }

  let otherFees = 0;
  try {
    const generalFeeSetting = await db.select().from(platformSettings).where(eq(platformSettings.key, 'GLOBAL_WITHDRAWAL_FEE_USDT')).get();
    if (generalFeeSetting) {
      otherFees = parseFloat(generalFeeSetting.value);
    }
  } catch(e) {}

  const totalFees = withdrawalFee + otherFees;
  const netUsdtReceived = usdtAmount - totalFees;

  if (netUsdtReceived <= 0) {
    throw new Error('Withdrawal amount after fees is too low.');
  }

  let conversionRateValue = 1;
  let finalFiatAmount = netUsdtReceived;

  if (currencyCode !== 'USDT') {
    const rateRecord = await db.select().from(currencyRates).where(eq(currencyRates.code, currencyCode)).get();
    if (!rateRecord || rateRecord.status !== 'ACTIVE') {
      throw new Error(`Active Global Currency Rate not found for ${currencyCode}`);
    }
    conversionRateValue = parseFloat(rateRecord.ratePerUsdt);
    if (conversionRateValue <= 0) {
      throw new Error(`Invalid conversion rate for ${currencyCode}`);
    }
    finalFiatAmount = netUsdtReceived * conversionRateValue;
  }

  return {
    requestedUsdt: Number(usdtAmount.toFixed(4)),
    withdrawalFee: Number(withdrawalFee.toFixed(4)),
    otherFees: Number(otherFees.toFixed(4)),
    totalFees: Number(totalFees.toFixed(4)),
    netUsdtReceived: Number(netUsdtReceived.toFixed(4)),
    currencyCode: currencyCode,
    conversionRate: conversionRateValue,
    finalFiatAmount: Number(finalFiatAmount.toFixed(4))
  };
}
