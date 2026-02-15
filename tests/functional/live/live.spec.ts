import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/home.page';

test('@smoke @critical : Živé vysílání – video', async ({ page }) => {
  const home = new HomePage(page);

  await home.goto();

  // --- ŽIVÉ VYSÍLÁNÍ ---
  await home.openLiveStream();

  // --- Přepnout program ---
  const switchBtn = page.getByRole('button', { name: 'Přepnout program' });
  await switchBtn.click();
  await switchBtn.click();

  // --- Overlay nebo fallback ---
  const overlay = page.getByTestId('PlayerOverlay');
  const video = page.getByTestId('video-tag');
  const wrapper = page.locator('.live__player');

  if (await overlay.isVisible().catch(() => false)) {
    await overlay.click();
  } else if (await video.isVisible().catch(() => false)) {
    await video.click();
  } else {
    await wrapper.click();
  }

  // --- Zavřít živé vysílání ---
  const closeBtn = page.getByRole('button', { name: /Zavřít živé vysílání/i });
  await expect(closeBtn).toBeVisible({ timeout: 5000 });
  await closeBtn.click();

  // --- Návrat na homepage ---
  await expect(page).toHaveURL('/');
});
