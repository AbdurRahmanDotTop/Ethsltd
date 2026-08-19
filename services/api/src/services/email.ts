import nodemailer from 'nodemailer';
import { Bindings } from '../db';
import { db } from '../db';
import { platformSettings, emailDeliveryLogs } from 'database';
import { eq } from 'drizzle-orm';
import { renderVerificationEmail, renderAdminNotificationEmail, renderUserTransactionEmail, renderAdminTransactionEmail } from './email-templates';

// In-memory cache for settings
let settingsCache: Record<string, string> = {};
let lastCacheUpdate = 0;

async function getSetting(dbInstance: any, key: string, defaultValue: string = ''): Promise<string> {
  const now = Date.now();
  if (now - lastCacheUpdate > 60000 || !(key in settingsCache)) {
    // Refresh cache
    const settings = await dbInstance.select().from(platformSettings).all();
    settingsCache = {};
    for (const s of settings) {
      settingsCache[s.key] = s.value;
    }
    lastCacheUpdate = now;
  }
  return settingsCache[key] ?? defaultValue;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private dbInstance: any;

  constructor(private env: Bindings, dbInstance: any) {
    this.dbInstance = dbInstance;
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT) || 465,
        secure: Number(env.SMTP_PORT) === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      console.warn("SMTP credentials not configured in environment variables.");
    }
  }

  private async sendMailWithLog(options: { to: string; subject: string; html: string; eventType: string }) {
    if (!this.transporter) {
      console.log(`[Mock Email] To: ${options.to} | Subject: ${options.subject}`);
      return;
    }

    const logId = crypto.randomUUID();
    try {
      await this.transporter.sendMail({
        from: `"ETHSLTD" <${this.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      await this.dbInstance.insert(emailDeliveryLogs).values({
        id: logId,
        recipient: options.to,
        subject: options.subject,
        eventType: options.eventType,
        status: 'SUCCESS',
        createdAt: new Date(),
      });
    } catch (error: any) {
      console.error(`Failed to send email [${options.eventType}] to ${options.to}:`, error);
      try {
        await this.dbInstance.insert(emailDeliveryLogs).values({
          id: logId,
          recipient: options.to,
          subject: options.subject,
          eventType: options.eventType,
          status: 'FAILED',
          errorMessage: error.message || String(error),
          createdAt: new Date(),
        });
      } catch(dbErr) {
        console.error("Failed to write email error log:", dbErr);
      }
    }
  }

  // EVENT: New User Registration
  async sendAdminNewUserAlert(user: any) {
    const notifyEnabled = await getSetting(this.dbInstance, 'NOTIFY_ADMIN_NEW_USER', 'true');
    if (notifyEnabled !== 'true') return;

    const adminEmail = await getSetting(this.dbInstance, 'ADMIN_EMAIL', 'admin@ethsltd.com');
    const html = renderAdminNotificationEmail('New User Registration', {
      'Name': user.displayName || 'N/A',
      'Email': user.email,
      'User ID': user.id,
      'Timestamp': new Date().toISOString()
    });

    await this.sendMailWithLog({
      to: adminEmail,
      subject: 'System Alert: New User Registration',
      html,
      eventType: 'ADMIN_NEW_USER',
    });
  }

  // EVENT: Email Verification
  async sendVerificationEmail(email: string, token: string, baseUrl: string) {
    const notifyEnabled = await getSetting(this.dbInstance, 'NOTIFY_USER_VERIFY_EMAIL', 'true');
    if (notifyEnabled !== 'true') return;

    const verifyLink = `${baseUrl}/verify-email?token=${token}`;
    const html = renderVerificationEmail(verifyLink);

    await this.sendMailWithLog({
      to: email,
      subject: 'Verify your ETHSLTD Email Address',
      html,
      eventType: 'USER_VERIFY_EMAIL',
    });
  }

  // EVENT: Password Reset
  async sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    const html = renderUserTransactionEmail('Password Reset Request', `You requested to reset your password. Click the link below. If you did not request this, please secure your account immediately.`, [
      { key: 'Action Required', value: `<a href="${resetLink}">Reset Password</a>` }
    ]);

    await this.sendMailWithLog({
      to: email,
      subject: 'ETHSLTD Password Reset',
      html,
      eventType: 'USER_PASSWORD_RESET',
    });
  }

  // EVENT: Real Deposit (Admin)
  async sendAdminDepositAlert(depositInfo: any) {
    if (depositInfo.mode === 'DEMO') return;
    const notifyEnabled = await getSetting(this.dbInstance, 'NOTIFY_ADMIN_DEPOSIT', 'true');
    if (notifyEnabled !== 'true') return;

    const adminEmail = await getSetting(this.dbInstance, 'ADMIN_EMAIL', 'admin@ethsltd.com');
    const html = renderAdminTransactionEmail('New Deposit Initiated', depositInfo);

    await this.sendMailWithLog({
      to: adminEmail,
      subject: `Deposit Alert: ${depositInfo.amount} ${depositInfo.asset}`,
      html,
      eventType: 'ADMIN_DEPOSIT',
    });
  }

  // EVENT: Real Withdrawal (Admin)
  async sendAdminWithdrawalAlert(withdrawalInfo: any) {
    if (withdrawalInfo.mode === 'DEMO') return;
    const notifyEnabled = await getSetting(this.dbInstance, 'NOTIFY_ADMIN_WITHDRAWAL', 'true');
    if (notifyEnabled !== 'true') return;

    const adminEmail = await getSetting(this.dbInstance, 'ADMIN_EMAIL', 'admin@ethsltd.com');
    const html = renderAdminTransactionEmail('New Withdrawal Requested', withdrawalInfo);

    await this.sendMailWithLog({
      to: adminEmail,
      subject: `Withdrawal Alert: ${withdrawalInfo.amount} ${withdrawalInfo.asset}`,
      html,
      eventType: 'ADMIN_WITHDRAWAL',
    });
  }
}
