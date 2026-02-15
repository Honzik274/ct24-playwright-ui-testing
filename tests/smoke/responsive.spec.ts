import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { SectionPage } from '../../pages/section.page';

test('@smoke @critical : Responsivní design – hamburger menu', async ({ page }) => {
  const home = new HomePage(page);
  const section = new SectionPage(page);

  // --- Mobilní viewport ---
  await page.setViewportSize({ width: 600, height: 800 });

  // --- Otevření homepage ---
  await home.goto();

  // --- Hamburger menu (správný lokátor podle DOM) ---
  const burger = page.getByTestId('menu-button');
  await expect(burger).toBeVisible({ timeout: 5000 });

  // --- Otevřít rubriku Domácí (SectionPage si hamburger otevře sama) ---
  await section.openRubrika('Domácí');

  // --- Ověřit, že se načetly články ---
  const articles = page.locator('a[href*="/clanek"]');
  await expect(articles.first()).toBeVisible();
});
