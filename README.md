QA Task – ČT24


Testy webové aplikace ČT24 pomocí Playwright.

Struktura projektu
tests/ – E2E testy
pages/ – Page Objects
components/ – Opakující se komponenty
utils/ – Helper funkce
data/ – Testovací data
fixtures/ – Sdílené setupy pro testy
playwright.config.ts – Konfigurace Playwright
.env – Environment proměnné

Požadavky
Node.js 18+

Playwright (instaluje se přes npm)

Instalace

bash
git clone <URL_REPOZITÁŘE>
cd <NÁZEV_PROJEKTU>
npm install
npx playwright install


Spuštění testů

Akce	                        Příkaz
Spustit všechny testy       	npx playwright test
Spustit konkrétní test      	npx playwright test tests/nazev_testu.spec.ts
Spustit testy s GUI         	npx playwright test --headed
Zobrazit report             	npx playwright show-report


Environment proměnné

Vytvoř .env soubor:
Kód
BASE_URL=https://ct24.ceskatelevize.cz
USERNAME=testuser
PASSWORD=testpass