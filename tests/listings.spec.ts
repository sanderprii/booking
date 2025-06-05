import { test, expect } from '@playwright/test';

test('I can browse available listings', async ({ page }) => {
  await page.goto('/');

  // Check that the page loaded correctly
  await expect(page).toHaveTitle(/Booking/);

  // Check that there are exactly three accommodations on the page
  const listings = page.locator('[data-testid="accommodation-listing"]');
  await expect(listings).toHaveCount(3);

  // Check that each listing has all required elements: title, description, price and image
  for (let i = 0; i < 3; i++) {
    const listing = listings.nth(i);

    // Check that listing is visible
    await expect(listing).toBeVisible();

    // Check that each listing has a title
    const title = listing.locator('[data-testid="listing-title"]');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    // Check that each listing has a description
    const description = listing.locator('[data-testid="listing-description"]');
    await expect(description).toBeVisible();
    await expect(description).not.toBeEmpty();

    // Check that each listing has a price
    const price = listing.locator('[data-testid="listing-price"]');
    await expect(price).toBeVisible();
    await expect(price).not.toBeEmpty();

    // Check that each listing has an image
    const image = listing.locator('[data-testid="listing-image"]');
    await expect(image).toBeVisible();

    // Optional: Check that image has loaded properly
    await expect(image).toHaveAttribute('src');
    await expect(image).toHaveAttribute('alt');
  }
});