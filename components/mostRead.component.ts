import { Page, expect, Locator } from '@playwright/test';

export class MostReadComponent {
  readonly page: Page;
  readonly section: Locator;
  readonly returnUrl: string;

  constructor(page: Page, sectionLocator: Locator, returnUrl: string) {
    this.page = page;
    this.section = sectionLocator;
    this.returnUrl = returnUrl; // URL rubriky předaná ze SectionPage
  }

  // 🔧 Pomocná funkce: stabilní kliknutí (řeší reklamy, overlay, poskakující layout)
  private async stableClick(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
    await locator.waitFor({ state: 'visible' });

    try {
      await locator.click({ trial: true });
    } catch {
      await this.page.waitForTimeout(200);
    }

    await locator.click({ force: true });
  }

  // 🔧 Pomocná funkce: retry wrapper
  private async retry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        await this.page.waitForTimeout(300);
      }
    }
    throw lastError;
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
    await this.stableClick(tab);
  }

  async openAllArticles(variant: 'top' | 'bottom' = 'bottom') {
    const articles = this.section.locator('a[href^="/clanek/"]');
    const count = await articles.count();
    const max = Math.min(3, count);

    for (let i = 0; i < max; i++) {
      const link = articles.nth(i);

      // 🔥 Stabilní otevření článku s retry
      await this.retry(async () => {
        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
          this.stableClick(link)
        ]);
      });

      // 🔥 Stabilní návrat na rubriku
      await this.page.goto(this.returnUrl, { waitUntil: 'domcontentloaded' });
      await this.page.waitForLoadState('networkidle');

      // Po návratu čekáme na sekci
      await this.section.waitFor({ state: 'visible' });
    }
  }
}
