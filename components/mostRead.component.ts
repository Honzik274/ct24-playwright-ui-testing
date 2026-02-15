import { Page, expect, Locator } from '@playwright/test';
import { retry } from '../utils/retry';
import { stableClick } from '../utils/stabilizer';

export class MostReadComponent {
  readonly page: Page;
  readonly section: Locator;
  readonly returnUrl: string;

  constructor(page: Page, sectionLocator: Locator, returnUrl: string) {
    this.page = page;
    this.section = sectionLocator;
    this.returnUrl = returnUrl;
  }

  async waitForVisible(timeout: number = 15000) {
    await expect(this.section).toBeVisible({ timeout });
  }

  async verifyHeader(expected?: string) {
    if (!expected) return;
    const header = this.section.locator('h2, h3', { hasText: expected }).first();
    await expect(header).toBeVisible({ timeout: 10000 });
  }

  async verifyArticles() {
    const articles = this.section.locator('a[href^="/clanek/"]');
    await expect(articles.first()).toBeVisible({ timeout: 10000 });

    const count = await articles.count();
    expect(count).toBeGreaterThan(0);

    const max = Math.min(3, count);
    for (let i = 0; i < max; i++) {
      await expect(articles.nth(i).locator('img')).toBeVisible();
    }
  }

  async verifyArticlesNoImages() {
    const articles = this.section.locator('a[href^="/clanek/"]');
    await expect(articles.first()).toBeVisible({ timeout: 10000 });

    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  }

  async switchView(viewName: string) {
    const tab = this.section.locator('.wc-ta__tab', { hasText: viewName }).first();
    await expect(tab).toBeVisible();
    await stableClick(tab);
  }

  async openAllArticles(variant: 'top' | 'bottom' = 'bottom') {
    const articles = this.section.locator('a[href^="/clanek/"]');
    const count = await articles.count();
    const max = Math.min(3, count);

    for (let i = 0; i < max; i++) {
      const link = articles.nth(i);

      // ⭐ Stabilní otevření článku s retry
      await retry(async () => {
        if (this.page.isClosed()) {
          throw new Error("Page closed during retry");
        }

        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
          stableClick(link)
        ]);
      });

      // ⭐ Stabilní návrat na rubriku
      await this.page.goto(this.returnUrl, { waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(500);

      // ⭐ Po návratu čekáme na sekci
      await this.section.waitFor({ state: 'visible' });
    }
  }
}
