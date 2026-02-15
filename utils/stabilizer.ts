import { Locator } from '@playwright/test';

export async function stableClick(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.waitFor({ state: 'visible' });

  try {
    await locator.click({ trial: true });
  } catch {
    await new Promise(r => setTimeout(r, 200));
  }

  await locator.click({ force: true });
}
