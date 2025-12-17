import { test, expect } from '@playwright/test';

test('Full Order Flow: Config -> Cart -> Checkout', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "Official Company Stamps" })).toBeVisible();

    // 2. Configure Stamp
    await page.getByPlaceholder('e.g. Supreme Stamps LLC').fill('Test Corp');

    const licenseInput = page.getByPlaceholder('e.g. 123456');
    if (await licenseInput.isVisible()) {
        await licenseInput.fill('TC-999');
    }

    await page.setInputFiles('input[type="file"]', 'tests/fixtures/license.png');

    const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
    await expect(addToCartBtn).toBeEnabled({ timeout: 10000 });
    await addToCartBtn.click();

    // 3. Navigate to Cart
    await page.click('a[href="/cart"]');
    await expect(page.getByText('Test Corp')).toBeVisible();

    // 4. Checkout
    await page.getByRole('button', { name: /Checkout/i }).click();
    await expect(page).toHaveURL(/.*checkout/);

    // 5. Fill Checkout Form
    await page.fill('#name', 'E2E Tester');
    await page.fill('input[placeholder="Enter phone number"]', '501234567');
    await page.getByText('🚚 Delivery').click();
    await page.fill('#address', 'Test Street, Dubai');

    // 6. Submit
    await page.getByRole('button', { name: 'Place Order' }).click();

    // Wait a bit for the API call to complete
    await page.waitForTimeout(3000);

    // Take screenshot to see what's on the page
    await page.screenshot({ path: 'tests/debug-after-submit.png', fullPage: true });

    // 7. Check for success OR error
    const hasSuccess = await page.getByRole('heading', { name: 'Order Confirmed!' }).isVisible().catch(() => false);
    const hasError = await page.getByText(/error|failed/i).isVisible().catch(() => false);

    console.log('Has Success:', hasSuccess);
    console.log('Has Error:', hasError);
    console.log('Current URL:', page.url());

    // Get page content for debugging
    const bodyText = await page.locator('body').textContent();
    console.log('Page contains:', bodyText?.substring(0, 500));

    // Assert success
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible({ timeout: 5000 });
});
