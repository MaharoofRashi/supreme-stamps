import { test, expect } from '@playwright/test';

/**
 * Order Tracking E2E Tests
 * 
 * Note: These tests create orders via API since the checkout flow now redirects to Stripe
 * and we can't complete actual payments in E2E tests without credentials.
 */

test.describe('Order Tracking', () => {
    const testPhone = '+971501234567'; // Full format with country code
    let testOrderId: string;

    test.beforeAll(async ({ request }) => {
        // Create a test order via API for tracking tests
        const response = await request.post('http://localhost:3000/api/orders', {
            data: {
                customerName: 'E2E Track Tester',
                customerEmail: 'test@example.com',
                customerPhone: testPhone,
                deliveryMethod: 'DELIVERY',
                address: 'Test Address, Dubai',
                totalPrice: 149,
                items: [
                    {
                        shape: 'Round',
                        color: 'Black',
                        companyName: 'Track Test Company',
                        companyNameAr: null,
                        licenseNumber: 'TT-123',
                        emirate: 'Dubai',
                        hasLogo: false,
                        tradeLicenseUrl: 'https://example.com/license.png',
                        price: 149,
                    },
                ],
            },
        });

        const data = await response.json();
        testOrderId = data.orderId; // API returns 'orderId' not 'friendlyId'
        console.log('Created test order:', testOrderId);
    });

    test('should successfully track order with correct phone number', async ({ page }) => {
        await page.goto('/track');
        await expect(page.getByRole('heading', { name: /Track Your Order/i })).toBeVisible();

        // Fill tracking form with correct details
        await page.getByPlaceholder(/Order ID/i).fill(testOrderId);
        await page.getByPlaceholder(/phone number/i).fill('501234567'); // Enter without country code (UI adds it)

        // Submit
        await page.getByRole('button', { name: /Track Order/i }).click();

        // Verify order is displayed
        await expect(page.getByText(testOrderId)).toBeVisible({ timeout: 10000 });

        // Verify status is shown
        const statusElement = page.locator('text=/PENDING|PROCESSING|DELIVERED|Order Placed/i').first();
        await expect(statusElement).toBeVisible();
    });

    test('should fail to track order with wrong phone number', async ({ page }) => {
        await page.goto('/track');
        await page.getByPlaceholder(/Order ID/i).fill(testOrderId);
        await page.getByPlaceholder(/phone number/i).fill('509999999'); // Wrong phone

        await page.getByRole('button', { name: /Track Order/i }).click();

        // Should show error
        await expect(page.getByText(/Phone number does not match|not match/i)).toBeVisible({ timeout: 5000 });
    });

    test('should show error for non-existent order ID', async ({ page }) => {
        await page.goto('/track');

        await page.getByPlaceholder(/Order ID/i).fill('SS-NOTEXIST');
        await page.getByPlaceholder(/phone number/i).fill('501234567');

        await page.getByRole('button', { name: /Track Order/i }).click();

        // Should show "not found" error
        await expect(page.getByText(/not found|does not exist/i)).toBeVisible({ timeout: 5000 });
    });
});

