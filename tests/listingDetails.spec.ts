// tests/listingDetails.spec.ts - Updated with fixed error test
import { test, expect } from '@playwright/test';

test.describe('Listing Details', () => {
    test('When I click on a listing, I am redirected to a page with more details', async ({ page }) => {
        await page.goto('/');

        // Wait for listings to load
        const listings = page.locator('[data-testid="accommodation-listing"]');
        await expect(listings).toHaveCount(3);

        // Click on the first listing
        const firstListing = listings.first();
        await firstListing.click();

        // Check that we are redirected to a details page
        await expect(page).toHaveURL(/\/listings\/\d+/);
    });

    test('When I visit /listings/:id, I can see the listing details', async ({ page }) => {
        // Visit a specific listing details page (assuming ID 1 exists from seed data)
        await page.goto('/listings/1');

        // Check that the page loads correctly
        await expect(page).toHaveTitle(/Booking/);

        // Check that the listing details page is displayed
        const detailsContainer = page.locator('[data-testid="listing-details"]');
        await expect(detailsContainer).toBeVisible();
    });

    test('The listing details page includes the title, description, price, image', async ({ page }) => {
        // Visit a specific listing details page
        await page.goto('/listings/1');

        const detailsContainer = page.locator('[data-testid="listing-details"]');
        await expect(detailsContainer).toBeVisible();

        // Check that title is present and visible
        const title = page.locator('[data-testid="listing-detail-title"]');
        await expect(title).toBeVisible();
        await expect(title).not.toBeEmpty();

        // Check that description is present and visible
        const description = page.locator('[data-testid="listing-detail-description"]');
        await expect(description).toBeVisible();
        await expect(description).not.toBeEmpty();

        // Check that price is present and visible
        const price = page.locator('[data-testid="listing-detail-price"]');
        await expect(price).toBeVisible();
        await expect(price).not.toBeEmpty();

        // Check that image is present and visible
        const image = page.locator('[data-testid="listing-detail-image"]');
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('src');
        await expect(image).toHaveAttribute('alt');
    });

    test('Listing details page handles non-existent listing ID', async ({ page }) => {
        // Visit a non-existent listing
        await page.goto('/listings/999');

        // Should show 404 page
        await expect(page).toHaveURL('/listings/999');

        // Check for 404 heading specifically
        const heading404 = page.getByRole('heading', { name: '404' });
        await expect(heading404).toBeVisible();
    });
});