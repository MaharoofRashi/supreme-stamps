import { test, expect } from '@playwright/test';

/**
 * Order Tracking E2E Tests
 * 
 * These tests verify the order tracking functionality.
 * Run after e2e-order.spec.ts to ensure an order exists in the database.
 */

test.describe('Order Tracking', () => {
    // We'll create a fresh order for these tests
    const testOrderId = 'SS-TEST01'; // This will be replaced with actual order
    const testPhone = '501234567';

    test('should successfully track order with correct phone number', async ({ page }) => {
        // First, create an order to track
        await page.goto('/');
        await page.getByPlaceholder('e.g. Supreme Stamps LLC').fill('Track Test Company');

        const licenseInput = page.getByPlaceholder('e.g. 123456');
        if (await licenseInput.isVisible()) {
            await licenseInput.fill('TT-123');
        }

        // Upload file
        await page.setInputFiles('input[type="file"]', 'tests/fixtures/license.png');

        // Wait for button to be enabled
        const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
        await expect(addToCartBtn).toBeEnabled({ timeout: 15000 });
        await page.waitForTimeout(500); // Small delay for upload processing
        await addToCartBtn.click();

        // Go to cart and checkout
        await page.click('a[href="/cart"]');
        await page.getByRole('button', { name: /Checkout/i }).click();

        // Fill checkout
        await page.fill('#name', 'Track Tester');
        await page.fill('input[placeholder="Enter phone number"]', testPhone);
        await page.getByText('🚚 Delivery').click();
        await page.fill('#address', 'Test Address, Dubai');

        // Place order
        await page.getByRole('button', { name: 'Place Order' }).click();
        await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible({ timeout: 15000 });

        // Get the order ID
        const orderIdText = await page.locator('.font-mono').filter({ hasText: /SS-/ }).textContent();
        const orderId = orderIdText?.trim() || '';

        console.log('Created order for tracking test:', orderId);

        // Now test tracking
        await page.goto('/track');
        await expect(page.getByRole('heading', { name: /Track Your Order/i })).toBeVisible();

        // Fill tracking form with correct details
        await page.getByPlaceholder(/Order ID/i).fill(orderId);
        await page.getByPlaceholder(/phone number/i).fill(testPhone);

        // Submit
        await page.getByRole('button', { name: /Track Order/i }).click();

        // Verify order is displayed
        await expect(page.getByText(orderId)).toBeVisible({ timeout: 10000 });

        // Verify status is shown
        const statusElement = page.locator('text=/PENDING|PROCESSING|DELIVERED|Order Placed/i').first();
        await expect(statusElement).toBeVisible();
    });

    test('should fail to track order with wrong phone number', async ({ page }) => {
        // Use the order from the previous test (we need to create one first)
        await page.goto('/');
        await page.getByPlaceholder('e.g. Supreme Stamps LLC').fill('Wrong Phone Test');

        const licenseInput = page.getByPlaceholder('e.g. 123456');
        if (await licenseInput.isVisible()) {
            await licenseInput.fill('WP-123');
        }

        await page.setInputFiles('input[type="file"]', 'tests/fixtures/license.png');
        const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
        await expect(addToCartBtn).toBeEnabled({ timeout: 15000 });
        await page.waitForTimeout(500);
        await addToCartBtn.click();

        await page.click('a[href="/cart"]');
        await page.getByRole('button', { name: /Checkout/i }).click();

        await page.fill('#name', 'Wrong Phone Tester');
        await page.fill('input[placeholder="Enter phone number"]', '501111111');
        await page.getByText('🚚 Delivery').click();
        await page.fill('#address', 'Test Address, Dubai');

        await page.getByRole('button', { name: 'Place Order' }).click();
        await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible({ timeout: 15000 });

        const orderIdText = await page.locator('.font-mono').filter({ hasText: /SS-/ }).textContent();
        const orderId = orderIdText?.trim() || '';

        // Now try to track with WRONG phone
        await page.goto('/track');
        await page.getByPlaceholder(/Order ID/i).fill(orderId);
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
