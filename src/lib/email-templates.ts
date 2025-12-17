/**
 * Email Templates for Supreme Stamps
 * 
 * Professional HTML email templates with inline CSS for maximum compatibility
 */

interface OrderEmailData {
    orderId: string;
    customerName: string;
    items: Array<{
        shape: string;
        color: string;
        companyName?: string;
        price: number;
        hasLogo: boolean;
    }>;
    totalPrice: number;
    deliveryMethod: string;
    address?: string;
    createdAt: Date;
}

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; }
  .header h1 { color: #d4af37; margin: 0; font-size: 28px; font-weight: bold; }
  .header p { color: #ffffff; margin: 10px 0 0 0; font-size: 14px; }
  .content { padding: 40px 30px; }
  .order-id { background-color: #f8f9fa; border-left: 4px solid #d4af37; padding: 15px 20px; margin: 20px 0; }
  .order-id strong { font-family: 'Courier New', monospace; font-size: 18px; color: #1a1a1a; }
  .section { margin: 30px 0; }
  .section-title { font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; }
  .item { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }
  .item-row { display: flex; justify-content: space-between; margin: 5px 0; }
  .total { background-color: #1a1a1a; color: #ffffff; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px; }
  .total span { color: #d4af37; }
  .button { display: inline-block; background-color: #d4af37; color: #1a1a1a; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
  .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  .footer a { color: #d4af37; text-decoration: none; }
`;

export function generateOrderConfirmationEmail(data: OrderEmailData): string {
    const itemsHtml = data.items.map((item, index) => `
    <div class="item">
      <div class="item-row">
        <strong>Item ${index + 1}: ${item.shape} Stamp</strong>
        <span>AED ${item.price}.00</span>
      </div>
      ${item.companyName ? `<div class="item-row"><span>Company: ${item.companyName}</span></div>` : ''}
      <div class="item-row">
        <span>Color: ${item.color}</span>
        ${item.hasLogo ? '<span style="color: #d4af37;">✓ Custom Logo</span>' : ''}
      </div>
    </div>
  `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${data.orderId}</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Supreme Stamps</h1>
          <p>UAE's Premiere Stamp Maker</p>
        </div>
        
        <div class="content">
          <h2 style="color: #1a1a1a; margin-top: 0;">Order Confirmed!</h2>
          <p>Hi ${data.customerName},</p>
          <p>Thank you for your order! We've received your payment and are preparing your custom stamp(s).</p>
          
          <div class="order-id">
            <div>Order ID: <strong>${data.orderId}</strong></div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              ${new Date(data.createdAt).toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Order Details</div>
            ${itemsHtml}
          </div>

          <div class="total">
            Total Paid: <span>AED ${data.totalPrice}.00</span>
          </div>

          <div class="section">
            <div class="section-title">Delivery Information</div>
            <p><strong>Method:</strong> ${data.deliveryMethod === 'DELIVERY' ? '🚚 Delivery' : '🏢 Pickup'}</p>
            ${data.deliveryMethod === 'DELIVERY' && data.address ? `
              <p><strong>Address:</strong><br>${data.address}</p>
              <p style="color: #28a745; font-weight: 600;">✓ Free Next-Day Delivery</p>
            ` : `
              <p><strong>Pickup Location:</strong><br>
              Supreme Digital Business Services LLC<br>
              Inside Max Metro Station, Al Jaffiliya, Dubai<br>
              📞 +971 56 489 9004</p>
              <p style="color: #28a745; font-weight: 600;">✓ Ready in 30 minutes</p>
            `}
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track" class="button">
              Track Your Order
            </a>
          </div>

          <div class="section">
            <p style="font-size: 14px; color: #666;">
              <strong>What's Next?</strong><br>
              ${data.deliveryMethod === 'DELIVERY'
            ? 'Your order will be delivered within 24 hours. We\'ll contact you if we need any additional information.'
            : 'Your order will be ready for pickup in 30 minutes. We\'ll send you a notification when it\'s ready.'}
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Need Help?</strong></p>
          <p>
            📧 Email: <a href="mailto:orders@supremestamps.com">orders@supremestamps.com</a><br>
            📱 WhatsApp: <a href="https://wa.me/971564899004">+971 56 489 9004</a>
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} Supreme Stamps. All rights reserved.<br>
            Made with ❤️ in Dubai
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePaymentReceiptEmail(data: OrderEmailData & { paymentId: string }): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt - ${data.orderId}</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Supreme Stamps</h1>
          <p>Payment Receipt</p>
        </div>
        
        <div class="content">
          <h2 style="color: #28a745; margin-top: 0;">✓ Payment Successful</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your payment has been processed successfully.</p>
          
          <div class="order-id">
            <div>Order ID: <strong>${data.orderId}</strong></div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              Payment ID: ${data.paymentId}
            </div>
          </div>

          <div class="total">
            Amount Paid: <span>AED ${data.totalPrice}.00</span>
          </div>

          <p style="text-align: center; color: #666; font-size: 14px;">
            This is your official payment receipt. Keep it for your records.
          </p>
        </div>

        <div class="footer">
          <p style="font-size: 12px; color: #999;">
            If you have any questions about this payment, please contact us at<br>
            <a href="mailto:orders@supremestamps.com">orders@supremestamps.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateOrderStatusUpdateEmail(
    data: OrderEmailData & { newStatus: string; statusMessage: string }
): string {
    const statusColors: Record<string, string> = {
        PROCESSING: '#007bff',
        DELIVERED: '#28a745',
        CANCELLED: '#dc3545',
    };

    const statusColor = statusColors[data.newStatus] || '#6c757d';

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update - ${data.orderId}</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Supreme Stamps</h1>
          <p>Order Status Update</p>
        </div>
        
        <div class="content">
          <h2 style="color: ${statusColor}; margin-top: 0;">Order Status Updated</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your order status has been updated.</p>
          
          <div class="order-id">
            <div>Order ID: <strong>${data.orderId}</strong></div>
          </div>

          <div style="background-color: ${statusColor}; color: #ffffff; padding: 20px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; border-radius: 8px;">
            ${data.newStatus}
          </div>

          <p style="font-size: 16px; color: #333; text-align: center;">
            ${data.statusMessage}
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track" class="button">
              Track Your Order
            </a>
          </div>
        </div>

        <div class="footer">
          <p>Questions? Contact us at <a href="mailto:orders@supremestamps.com">orders@supremestamps.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}
