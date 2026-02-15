# Analýza testování – ČT24 (Playwright)

Tento dokument popisuje můj postup při řešení úkolu, nalezené problémy, flaky chování webu ČT24 a způsob, jakým jsem jednotlivé problémy stabilizoval.  
Cílem bylo ukázat nejen funkční automatizaci, ale také schopnost analyzovat rizikové oblasti a navrhnout robustní řešení.

---

# 🧠 1) Můj postup

1. Prošel jsem zadání a identifikoval testované oblasti:
   - horní a dolní sekce „Nejčtenější“
   - živé vysílání
   - responzivní hamburger menu
   - cross‑browser chování

2. Vytvořil jsem Page Object Model:
   - `SectionPage`
   - `MostReadComponent`
   - `HomePage`

3. Postupně jsem psal testy a spouštěl je v Chromiu i Firefoxu.

4. Identifikoval jsem flaky místa — hlavně v horní sekci „Nejčtenější z rubriky“.

5. Iterativně jsem stabilizoval testy, dokud neprošly 3× za sebou v obou prohlížečích.

---

# 🔍 2) Nalezené problémy a jejich řešení

## 🔸 1) Horní sekce „Nejčtenější z rubriky“

### Problémy
- Widget je lazy‑loaded → načítá se až po scrollu.
- Firefox ho někdy nenačte vůbec.
- Reklamy způsobují layout shift.
- Kliknutí na článek vede přes tracking redirect.
- `waitForNavigation` ve Firefoxu způsoboval zavření tabů.
- `networkidle` na ČT24 nikdy nenastane (kvůli websocketům a reklamám).

### Řešení
- Explicitní čekání na heading widgetu.
- Scroll to top po návratu z článku → aktivuje lazy‑load.
- `waitForURL('**/clanek/**')` místo `waitForNavigation()`.
- Retry mechanismus pro klikání.
- Stabilní klikání (`stableClick`) kvůli overlay reklamám.
- `waitUntil: 'domcontentloaded'` místo `networkidle`.

---

## 🔸 2) Dolní sekce „Nejčtenější“

### Problémy
- Reklamy překrývají články.
- Obrázky se načítají pozdě → layout shift.

### Řešení
- Retry wrapper.
- Stabilní klikání.
- Čekání na obrázky u prvních 3 článků.

---

## 🔸 3) Firefox specifické problémy

### Problémy
- Firefox někdy zavře tab při navigaci na článek.
- Horní widget se nenačte bez scrollu.
- Odlišný timing oproti Chromiu.

### Řešení
- `waitForURL` místo `waitForNavigation`.
- Scroll fix po návratu do rubriky.
- Explicitní čekání na sekci po návratu.

---

## 🔸 4) Stabilizace návratu do rubriky

### Problémy
- `networkidle` nikdy nenastalo.
- Stránka se načítala donekonečna kvůli websocketům.

### Řešení
- `waitUntil: 'domcontentloaded'`.
- Krátké stabilizační timeouty.
- Opětovné čekání na widget po návratu.

---

# 🧪 3) Výsledek

- Testy jsou stabilní v Chromiu i Firefoxu.
- Horní sekce byla úspěšně stabilizována pomocí kombinace scrollu, explicitních čekání a `waitForURL`.
- POM je připravený pro další rozšíření.
- Testy prošly 3× za sebou bez flaky chování.

---

# 🏁 4) Závěr

Úkol splňuje požadavky výběrového řízení:
- pokrývá všechny požadované oblasti,
- obsahuje robustní automatizaci,
- identifikuje a řeší flaky chování,
- ukazuje schopnost analyzovat problémy a navrhnout stabilní řešení.
