import { describe, it, expect } from 'vitest';
import {
    generateOrderConfirmationEmail,
    generatePaymentReceiptEmail,
    generateOrderStatusUpdateEmail,
} from './email-templates';

describe('Email Templates', () => {
    const mockOrderData = {
        orderId: 'SS-TEST123',
        customerName: 'John Doe',
        items: [
            {
                shape: 'Round',
                color: 'Black',
                companyName: 'Test Company LLC',
                price: 149,
                hasLogo: false,
            },
            {
                shape: 'Rectangle',
                color: 'Blue',
                companyName: 'Another Company',
                price: 198,
                hasLogo: true,
            },
        ],
        totalPrice: 347,
        deliveryMethod: 'DELIVERY',
        address: '123 Test Street, Dubai',
        createdAt: new Date('2025-01-01T10:00:00Z'),
    };

    describe('generateOrderConfirmationEmail', () => {
        it('should generate valid HTML email', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            expect(html).toContain('<!DOCTYPE html>');
            expect(html).toContain('Order Confirmed!');
            expect(html).toContain('SS-TEST123');
            expect(html).toContain('John Doe');
        });

        it('should include all order items', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            expect(html).toContain('Round Stamp');
            expect(html).toContain('Rectangle Stamp');
            expect(html).toContain('Test Company LLC');
            expect(html).toContain('Another Company');
        });

        it('should show correct total price', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            expect(html).toContain('AED 347.00');
        });

        it('should show delivery address for DELIVERY method', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            expect(html).toContain('123 Test Street, Dubai');
            expect(html).toContain('🚚 Delivery');
        });

        it('should show pickup location for PICKUP method', () => {
            const pickupData = { ...mockOrderData, deliveryMethod: 'PICKUP', address: undefined };
            const html = generateOrderConfirmationEmail(pickupData);

            expect(html).toContain('🏢 Pickup');
            expect(html).toContain('Supreme Digital Business Services LLC');
            expect(html).toContain('Al Jaffiliya');
        });

        it('should indicate logo add-on', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            expect(html).toContain('✓ Custom Logo');
        });
    });

    describe('generatePaymentReceiptEmail', () => {
        it('should generate valid payment receipt', () => {
            const html = generatePaymentReceiptEmail({
                ...mockOrderData,
                paymentId: 'pi_test123',
            });

            expect(html).toContain('Payment Receipt');
            expect(html).toContain('✓ Payment Successful');
            expect(html).toContain('pi_test123');
            expect(html).toContain('AED 347.00');
        });

        it('should include order ID', () => {
            const html = generatePaymentReceiptEmail({
                ...mockOrderData,
                paymentId: 'pi_test123',
            });

            expect(html).toContain('SS-TEST123');
        });
    });

    describe('generateOrderStatusUpdateEmail', () => {
        it('should generate status update email', () => {
            const html = generateOrderStatusUpdateEmail({
                ...mockOrderData,
                newStatus: 'PROCESSING',
                statusMessage: 'Your order is being processed.',
            });

            expect(html).toContain('Order Status Update');
            expect(html).toContain('PROCESSING');
            expect(html).toContain('Your order is being processed.');
        });

        it('should use correct color for DELIVERED status', () => {
            const html = generateOrderStatusUpdateEmail({
                ...mockOrderData,
                newStatus: 'DELIVERED',
                statusMessage: 'Your order has been delivered!',
            });

            expect(html).toContain('DELIVERED');
            expect(html).toContain('#28a745'); // Green color for delivered
        });

        it('should use correct color for CANCELLED status', () => {
            const html = generateOrderStatusUpdateEmail({
                ...mockOrderData,
                newStatus: 'CANCELLED',
                statusMessage: 'Your order has been cancelled.',
            });

            expect(html).toContain('CANCELLED');
            expect(html).toContain('#dc3545'); // Red color for cancelled
        });
    });

    describe('Email Template Structure', () => {
        it('should have proper email structure', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            // Check for essential email elements
            expect(html).toContain('<head>');
            expect(html).toContain('<body>');
            expect(html).toContain('Supreme Stamps');
            expect(html).toContain('Track Your Order');
            expect(html).toContain('orders@supremestamps.com');
        });

        it('should include contact information', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            expect(html).toContain('orders@supremestamps.com');
            expect(html).toContain('+971 56 489 9004');
        });

        it('should have footer with copyright', () => {
            const html = generateOrderConfirmationEmail(mockOrderData);

            expect(html).toContain('Supreme Stamps. All rights reserved');
            expect(html).toContain('Made with ❤️ in Dubai');
        });
    });
});
