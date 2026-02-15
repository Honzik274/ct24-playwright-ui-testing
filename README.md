QA Automatizace – ČT24 (Playwright)
Automatizované UI testy pro web ČT24 vytvořené pomocí Playwright a Page Object Modelu.
Projekt pokrývá smoke i regression scénáře dle zadání.

📦 Instalace
bash
git clone https://github.com/Honzik274/ct24-playwright-ui-testing
cd ct24-playwright-ui-testing
npm install
npx playwright install


▶️ Spuštění testů

Všechny testy
bash
npx playwright test

Smoke testy
bash
npx playwright test --grep @smoke

Regression testy
bash
npx playwright test --grep @regression

GUI mód
bash
npx playwright test --headed

HTML report
bash
npx playwright show-report


📁 Struktura projektu
Kód
tests/
  functional/
    most-read/
    live/
  smoke/
pages/
components/
utils/
data/
fixtures/
playwright.config.ts


🧪 Testované oblasti

🔹 Nejčtenější články
horní i dolní varianta,
přepínání „za 24 hodin / za 7 dní“,
kontrola prvních 3 článků,
ověření funkčnosti odkazů.

🔹 Živé vysílání
otevření přehrávače,
interakce s videem/overlay,
zavření přehrávače.

🔹 Responsivní design
hamburger menu,
navigace v mobilním zobrazení.

🔹 Cross‑browser
Chromium
Firefox


🧱 Page Object Model
HomePage – navigace na homepage, vstup do živého vysílání
SectionPage – otevírání rubrik, přístup ke komponentám
MostReadComponent – ověření článků, přepínání, otevírání článků


✔️ Stav projektu
Testy pokrývají celé zadání
Stabilní v Chromiu i Firefoxu
POM připravený pro další rozšíření