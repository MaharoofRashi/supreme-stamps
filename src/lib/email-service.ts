import { mg, MAILGUN_CONFIG } from './mailgun';
import {
    generateOrderConfirmationEmail,
    generatePaymentReceiptEmail,
    generateOrderStatusUpdateEmail,
} from './email-templates';

interface OrderData {
    id: string;
    friendlyId: string | null;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    totalPrice: number;
    deliveryMethod: string;
    address: string | null;
    createdAt: Date;
    items: Array<{
        shape: string;
        color: string;
        companyName: string | null;
        price: number;
        hasLogo: boolean;
    }>;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(order: OrderData) {
    if (!order.customerEmail) {
        console.log('No email provided for order:', order.friendlyId);
        return { success: false, message: 'No email provided' };
    }

    try {
        const htmlContent = generateOrderConfirmationEmail({
            orderId: order.friendlyId || order.id,
            customerName: order.customerName,
            items: order.items,
            totalPrice: order.totalPrice,
            deliveryMethod: order.deliveryMethod,
            address: order.address || undefined,
            createdAt: order.createdAt,
        });

        const result = await mg.messages.create(MAILGUN_CONFIG.domain, {
            from: MAILGUN_CONFIG.from,
            to: [order.customerEmail],
            subject: `Order Confirmed - ${order.friendlyId || order.id}`,
            html: htmlContent,
            text: `Your order ${order.friendlyId || order.id} has been confirmed. Total: AED ${order.totalPrice}.00`,
        });

        console.log('Order confirmation email sent:', result.id);
        return { success: true, messageId: result.id };
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        return { success: false, error };
    }
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceipt(order: OrderData, paymentId: string) {
    if (!order.customerEmail) {
        console.log('No email provided for order:', order.friendlyId);
        return { success: false, message: 'No email provided' };
    }

    try {
        const htmlContent = generatePaymentReceiptEmail({
            orderId: order.friendlyId || order.id,
            customerName: order.customerName,
            items: order.items,
            totalPrice: order.totalPrice,
            deliveryMethod: order.deliveryMethod,
            address: order.address || undefined,
            createdAt: order.createdAt,
            paymentId,
        });

        const result = await mg.messages.create(MAILGUN_CONFIG.domain, {
            from: MAILGUN_CONFIG.from,
            to: [order.customerEmail],
            subject: `Payment Receipt - ${order.friendlyId || order.id}`,
            html: htmlContent,
            text: `Payment received for order ${order.friendlyId || order.id}. Amount: AED ${order.totalPrice}.00`,
        });

        console.log('Payment receipt email sent:', result.id);
        return { success: true, messageId: result.id };
    } catch (error) {
        console.error('Failed to send payment receipt email:', error);
        return { success: false, error };
    }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdate(
    order: OrderData,
    newStatus: string,
    statusMessage: string
) {
    if (!order.customerEmail) {
        console.log('No email provided for order:', order.friendlyId);
        return { success: false, message: 'No email provided' };
    }

    try {
        const htmlContent = generateOrderStatusUpdateEmail({
            orderId: order.friendlyId || order.id,
            customerName: order.customerName,
            items: order.items,
            totalPrice: order.totalPrice,
            deliveryMethod: order.deliveryMethod,
            address: order.address || undefined,
            createdAt: order.createdAt,
            newStatus,
            statusMessage,
        });

        const result = await mg.messages.create(MAILGUN_CONFIG.domain, {
            from: MAILGUN_CONFIG.from,
            to: [order.customerEmail],
            subject: `Order Update: ${newStatus} - ${order.friendlyId || order.id}`,
            html: htmlContent,
            text: `Your order ${order.friendlyId || order.id} status: ${newStatus}. ${statusMessage}`,
        });

        console.log('Order status update email sent:', result.id);
        return { success: true, messageId: result.id };
    } catch (error) {
        console.error('Failed to send order status update email:', error);
        return { success: false, error };
    }
}
