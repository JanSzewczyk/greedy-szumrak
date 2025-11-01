# Greedy Szumrak - Product Requirements Document (PRD)

**Wersja:** 1.0  
**Data:** 26 października 2025  
**Status:** Draft  
**Autor:** Product Team

---

## 📋 Spis Treści

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Vision](#2-problem-statement--vision)
3. [Target Users & Personas](#3-target-users--personas)
4. [Goals & Success Metrics](#4-goals--success-metrics)
5. [Product Scope](#5-product-scope)
6. [Moduł 1: Wydatki - Functional Requirements](#6-moduł-1-wydatki---functional-requirements)
7. [Moduł 2: Inwestycje - Functional Requirements](#7-moduł-2-inwestycje---functional-requirements)
8. [User Stories & Use Cases](#8-user-stories--use-cases)
9. [User Flows & Journey Maps](#9-user-flows--journey-maps)
10. [Feature Prioritization](#10-feature-prioritization)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Technical Architecture (High-Level)](#12-technical-architecture-high-level)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Future Roadmap](#14-future-roadmap)

---

## 1. Executive Summary

### 1.1 Produkt
**Greedy Szumrak** to aplikacja webowa do kompleksowego zarządzania finansami osobistymi, łącząca dwa kluczowe obszary:
- **Budżetowanie i kontrola wydatków** - proaktywne zarządzanie finansami poprzez budżety miesięczne, alerty i analitykę trendów z naciskiem na planowanie wydatków przed ich dokonaniem
- **Monitorowanie inwestycji** - agregacja pozycji z różnych kont maklerskich z analizą zysków/strat

### 1.2 Unikalność
W przeciwieństwie do konkurencji (YNAB, Mint, Personal Capital), Greedy Szumrak oferuje:
- 💰 **Budget-first approach** - budżety są punktem startowym, nie dodatkiem
- 🎯 **Prosty onboarding z gotowymi szablonami** - użytkownik ma działające budżety w < 2 minuty
- 📊 **Inteligentne alerty i predykcje** - system ostrzega PRZED przekroczeniem budżetu na podstawie tempa wydatków
- 🔮 **Prognozowanie end-of-month** - widoczność czy budżet wystarczy do końca miesiąca
- 💼 **Inwestycje multi-broker** - agregacja z różnych platform maklerskich
- 🇵🇱 **Polski rynek** - dostosowanie do polskich realiów (PLN, polskie brokery, średnie wynagrodzenia)

### 1.3 Stack Technologiczny
- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Server Components
- **Database:** Firebase Firestore (NoSQL)
- **Auth:** Firebase Authentication
- **Storage:** Firebase Storage (dla załączników)
- **Hosting:** Vercel

---

## 2. Problem Statement & Vision

### 2.1 Problem
**Dla kogo:**
Osoby indywidualne (25-45 lat), które:
- Mają trudność ze śledzeniem gdzie idą ich pieniądze
- Posiadają inwestycje na wielu kontach maklerskich
- Chcą mieć pełny obraz swojej sytuacji finansowej w jednym miejscu
- Nie chcą używać skomplikowanych narzędzi księgowych

**Jaki problem:**
- ❌ Brak jasnego planu finansowego na miesiąc - ludzie nie wiedzą ile mogą wydać
- ❌ Reaktywne podejście - dowiadują się o problemach po fakcie, gdy jest już za późno
- ❌ Trudność w przestrzeganiu budżetu - brak narzędzi do planowania "przed wydaniem"
- ❌ Rozproszone informacje o inwestycjach (XTB, mBank, Revolut, etc.)
- ❌ Brak wglądu w pozostałe środki w kategoriach ("ile jeszcze mogę wydać na restauracje?")
- ❌ Czasochłonne ręczne wyliczanie pozostałych budżetów

**Obecnie:**
Użytkownicy stosują:
- Excel/Google Sheets (czasochłonne, brak real-time updates)
- Budżety "w głowie" (nieprecyzyjne, łatwo zapomnieć)
- Aplikacje bankowe (tylko tracking, brak budżetowania)
- YNAB (zbyt skomplikowany dla casual users)
- Notatki na telefonie (brak struktury, analityki)

### 2.2 Vision Statement
> "Greedy Szumrak to narzędzie które daje Ci kontrolę nad finansami poprzez inteligentne budżetowanie - wiesz ile możesz wydać zanim to zrobisz, widzisz pełny obraz swoich finansów od budżetu domowego po portfolio akcji, i podejmujesz lepsze decyzje finansowe dzięki predykcyjnej analityce."

### 2.3 Mission
Umożliwić każdemu Polakowi świadome zarządzanie finansami poprzez intuicyjne narzędzie oparte na proaktywnym budżetowaniu, które łączy planowanie wydatków z monitoringiem inwestycji.

---

## 3. Target Users & Personas

### Persona 1: "Oszczędny Tomek"
**Profil:**
- Wiek: 28 lat
- Zawód: Junior Developer
- Dochód: 8,000 PLN netto/mies
- Lokalizacja: Warszawa

**Cele:**
- Oszczędzić 30% pensji miesięcznie
- Wiedzieć ile może wydać w każdej kategorii BEZ przekraczania budżetu
- Zbudować fundusz awaryjny
- Mieć jasny plan finansowy na miesiąc

**Pain Points:**
- Wydaje dużo na drobne rzeczy (kawiarnie, delivery) i nie wie ile jeszcze ma "wolnego"
- Nie wie czy stać go na spontaniczny wydatek (np. wyjście do kina)
- Ma budżet "w głowie" ale nie wie ile zostało w każdej kategorii
- Dowiaduje się o przekroczeniu budżetu post-factum

**Typowe pytania:**
- "Ile jeszcze mogę wydać na restauracje w tym miesiącu?"
- "Czy stać mnie na tę impulsową zakup?"
- "Czy wystarczy mi pieniędzy do końca miesiąca?"

**Jak Greedy Szumrak pomaga:**
- Dashboard pokazuje "remaining budget" w każdej kategorii na pierwszy rzut oka
- Przed dodaniem wydatku widzi czy mieści się w budżecie
- Alerty PRZED przekroczeniem (na 80% wykorzystania)
- Prognoza "at current pace, you'll spend X by month end"

---

### Persona 2: "Inwestorka Ania"
**Profil:**
- Wiek: 35 lat
- Zawód: Marketing Manager
- Dochód: 15,000 PLN netto/mies
- Lokalizacja: Kraków

**Cele:**
- Dywersyfikacja portfolio (akcje, ETF-y, obligacje)
- Monitoring performance na różnych kontach (XTB, mBank, Revolut)
- Planowanie przyszłych inwestycji

**Pain Points:**
- Ma 3 konta maklerskie - musi logować się do każdego osobno
- Nie wie jaki jest łączny P&L
- Trudno porównać performance różnych aktywów
- Brak widoku alokacji (ile % w akcje, ile % w obligacje)

**Jak Greedy Szumrak pomaga:**
- Agregacja wszystkich pozycji w jednym miejscu
- Dashboard z łącznym P&L
- Wizualizacja alokacji aktywów
- Tracking historii transakcji

---

### Persona 3: "Planujący Piotr"
**Profil:**
- Wieg: 42 lata
- Zawód: Senior Architect
- Dochód: 25,000 PLN netto/mies
- Lokalizacja: Poznań

**Cele:**
- Kontrola wydatków rodzinnych
- Długoterminowe planowanie finansowe (emerytura, edukacja dzieci)
- Optymalizacja portfolio inwestycyjnego

**Pain Points:**
- Złożony budżet rodzinny (wiele kategorii)
- Potrzebuje historycznych danych do analizy trendów
- Chce widzieć jak wydatki wpływają na oszczędności/inwestycje

**Jak Greedy Szumrak pomaga:**
- Zaawansowana analityka (6m, 12m trends)
- Porównanie wydatki vs średnia historyczna
- Export danych do Excel dla głębszej analizy
- Dashboard łączący wydatki i inwestycje

---

## 4. Goals & Success Metrics

### 4.1 Business Goals

**Primary Goals:**
1. **Adoption:** 1,000 aktywnych użytkowników w ciągu 6 miesięcy od launch
2. **Budget Setup:** 80% użytkowników konfiguruje budżety w pierwszym tygodniu
3. **Budget Adherence:** 70% użytkowników pozostaje w granicach budżetu po 3 miesiącach
4. **Engagement:** 70% użytkowników sprawdza pozostały budżet minimum 2x/tydzień
5. **Retention:** 60% użytkowników wraca po 30 dniach

**Secondary Goals:**
- 85% ukończonych onboardingów budżetowych (nie abandon)
- < 3% bounce rate na budget dashboard
- Średni czas sesji > 4 minut
- 50% użytkowników używa funkcji "check before spending"

### 4.2 User Goals

**Budżetowanie:**
- ✅ Mieć jasny plan ile mogę wydać w każdej kategorii
- ✅ Widzieć pozostały budżet w czasie rzeczywistym
- ✅ Wiedzieć czy stać mnie na zakup PRZED jego dokonaniem
- ✅ Dostać ostrzeżenie ZANIM przekroczę budżet
- ✅ Mieć pewność że starczy do końca miesiąca

**Wydatki:**
- ✅ Szybko dodawać wydatki (< 30 sek)
- ✅ Widzieć jak wydatek wpłynie na pozostały budżet
- ✅ Przestrzegać budżetu miesięcznego
- ✅ Mieć historię wydatków do audytu

**Inwestycje:**
- ✅ Widzieć łączny P&L w czasie rzeczywistym
- ✅ Rozumieć alokację aktywów
- ✅ Śledzić performance poszczególnych pozycji
- ✅ Podejmować data-driven decyzje inwestycyjne

### 4.3 Success Metrics (KPIs)

| Metryka | Target | Pomiar |
|---------|--------|--------|
| **Acquisition** | | |
| New sign-ups | 200/mies | Firebase Auth events |
| Onboarding completion rate | 85% | Firestore: onboardingCompleted |
| **Budget Setup** | | |
| Users with budgets set | 80% | Users with ≥3 budgets |
| Avg budgets per user | ≥ 5 | Firestore aggregation |
| Budget setup time | < 3 min | Time tracking |
| **Activation** | | |
| Time to first budget check | < 2 min | Event: budgetDashboardView |
| Budget checks in first week | ≥ 5 | Dashboard view events |
| Expenses added in first week | ≥ 5 | Firestore query |
| **Engagement** | | |
| DAU / MAU ratio | 0.35 (35%) | Analytics |
| Budget dashboard views/week | ≥ 3 | Analytics |
| "Remaining budget" checks | ≥ 5/week | Event tracking |
| Expense add frequency | ≥ 3/week | Firestore |
| **Budget Adherence** | | |
| Users staying within budget | 70% | % users not exceeding |
| Avg budget utilization | 85-95% | spent/budget ratio |
| Budget alert response time | < 12h | Time from alert to action |
| **Retention** | | |
| D7 retention | 70% | Cohort analysis |
| D30 retention | 60% | Cohort analysis |
| Monthly churn | < 8% | Analytics |
| **Value** | | |
| Budget adherence improvement | +25% | Month 1 vs month 3 |
| Reduction in budget overruns | 40% | Compare pre/post app |
| User reported savings | 500 PLN/mo | Survey |

---

## 5. Product Scope

### 5.1 In Scope (MVP - Launch v1.0)

#### Moduł Budżetowania (CORE):
✅ Setup budżetów miesięcznych (wizard z szablonami)  
✅ Sugerowane budżety na podstawie dochodu  
✅ Dashboard "Remaining Budget" - główny widok  
✅ Real-time budget tracking (ile zostało)  
✅ Prognozowanie end-of-month spending  
✅ System alertów proaktywnych (przed przekroczeniem)  
✅ Quick budget check (widget "Can I afford this?")  
✅ Budget vs Actual - porównanie miesięczne  

#### Moduł Wydatków (WSPARCIE dla budżetów):
✅ Ręczne dodawanie wydatków  
✅ Kategoryzacja (predefiniowane + custom)  
✅ Automatyczne aktualizowanie pozostałego budżetu  
✅ Lista wydatków z filtrowaniem  
✅ Export/Import CSV  
✅ Edycja/usuwanie wydatku  

#### Moduł Analityki:
✅ Dashboard budżetowy (pozostałe, wykorzystane, prognoza)  
✅ Wykresy miesięczne (budget vs actual)  
✅ Breakdown po kategoriach z progress bars  
✅ Trendy wydatków (porównanie m/m)  

#### Moduł Inwestycji:
✅ Ręczne dodawanie pozycji (akcje, ETF, obligacje)  
✅ Tracking transakcji (buy/sell)  
✅ Konta maklerskie (multi-account)  
✅ Dashboard P&L (zyski/straty)  
✅ Alokacja aktywów (pie chart)  
✅ Historia transakcji  

#### Core:
✅ Onboarding flow (budget-first)  
✅ Autentykacja (email/password, Google)  
✅ Responsive design (mobile-first)  
✅ Dark mode  

### 5.2 Out of Scope (Post-MVP / Future)

❌ **Integracje bankowe** (Open Banking API) - V2.0  
❌ **Automatyczny import transakcji z banku** - V2.0  
❌ **Real-time ceny akcji** (API) - V1.5  
❌ **Powiadomienia push** (mobile app) - V2.0  
❌ **Multi-currency support** (USD, EUR) - V1.5  
❌ **Family accounts** (shared budgets) - V3.0  
❌ **AI-powered insights** (spending predictions) - V3.0  
❌ **Receipt scanning** (OCR) - V2.5  
❌ **Bill reminders** - V2.0  
❌ **Tax calculator** - V3.0  

### 5.3 Assumptions & Dependencies

**Assumptions:**
- Użytkownicy są willing to ręcznie dodawać wydatki (minimum friction)
- Single-user account (no family/shared accounts w MVP)
- Polski język i PLN currency only
- Desktop i mobile web (no native apps)

**Dependencies:**
- Firebase availability (99.9% SLA)
- Vercel hosting (deployment)
- Chart.js library (visualizations)

---

## 6. Moduł Budżetowania - Functional Requirements (PRIORITY MODULE)

### 6.1 FR-B001: Budget Setup Wizard (CORE FEATURE)

**Opis:**  
Przewodnik po konfiguracji budżetów miesięcznych - punkt startowy aplikacji. Użytkownik definiuje ile może wydać w każdej kategorii zanim zacznie trackować wydatki.

**Wymagania:**

**Krok 1: Podanie dochodu miesięcznego**
- Input: Kwota netto (PLN)
- Optional: Dodatkowe źródła dochodu
- System oblicza recommended budgets na podstawie:
  - 50/30/20 rule (potrzeby/przyjemności/oszczędności)
  - Polskie średnie dla danych kategorii
  - Kwartyle dochodowe (user w którym przedziale)

**Krok 2: Wybór kategorii do budżetowania**
- Grid z kategoriami (minimum 3 wymagane)
- Każda kategoria pokazuje:
  - Sugerowany % dochodu
  - Sugerowaną kwotę PLN
  - Możliwość customizacji

**Predefiniowane kategorie z sugestiami:**
```
Essentials (Needs - 50%):
- 🏠 Mieszkanie: 30% (2,400 PLN dla 8k dochodu)
- 🍽️ Jedzenie: 15% (1,200 PLN)
- 🚗 Transport: 10% (800 PLN)
- ⚕️ Zdrowie: 5% (400 PLN)

Lifestyle (Wants - 30%):
- 🎮 Rozrywka: 10% (800 PLN)
- 🛍️ Zakupy: 10% (800 PLN)
- ☕ Kawiarnie/Restauracje: 5% (400 PLN)
- 📱 Subskrypcje: 3% (240 PLN)
- ✈️ Podróże: 2% (160 PLN)

Savings (20%):
- 💰 Oszczędności: 15% (1,200 PLN)
- 🎁 Prezenty/Inne: 5% (400 PLN)
```

**Krok 3: Dostosowanie budżetów**
- Slider do customizacji każdej kategorii
- Suma musi = 100% dochodu
- Visual feedback: "You have X PLN unallocated"
- Warning jeśli Essentials < 40% lub > 70%

**Krok 4: Podsumowanie i aktywacja**
- Przegląd wszystkich budżetów
- Total allocated vs income
- CTA: "Aktywuj budżety na [current month]"
- Info: "Możesz zmienić to później w ustawieniach"

**Behavior:**
- Po aktywacji: redirect do Budget Dashboard
- Budżety zapisane w Firestore `/budgets`
- System zaczyna tracking od dzisiaj
- Pokazuje "Welcome tour" wyjaśniający dashboard

**Success Criteria:**
- ✅ 85% użytkowników kończy setup (vs 80% poprzednio)
- ✅ Średni czas setup: < 3 min
- ✅ 80% użytkowników akceptuje sugerowane budżety lub robi minimalne zmiany
- ✅ 70% użytkowników alokuje 100% dochodu

**Priority:** 🔴 P0 (Must-have - CORE)

---

### 6.2 FR-B002: Budget Dashboard (PRIMARY VIEW)

**Opis:**  
Główny ekran aplikacji - pokazuje status wszystkich budżetów w czasie rzeczywistym. Użytkownik widzi ile może jeszcze wydać w każdej kategorii.

**Wymagania:**

**Layout:**
```
┌─────────────────────────────────────────────┐
│  📊 Budget Dashboard - Październik 2025     │
│                                              │
│  💰 Total Remaining: 3,245 PLN / 8,000 PLN │
│  📈 On track to save: 1,100 PLN this month  │
│  ⏰ 12 days remaining                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🚨 ALERTS                                   │
│  • Rozrywka at 95% - slow down! (760/800)  │
│  • Transport on track to exceed by 15%      │
└─────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Budget Categories                    │
│                                       │
│  🏠 Mieszkanie                        │
│  ████████████████░░ 2,100 / 2,400    │
│  Remaining: 300 PLN (12.5%)          │
│  On pace: ✅ Will stay within budget │
│                                       │
│  🍽️ Jedzenie                          │
│  ███████████░░░░░░ 850 / 1,200       │
│  Remaining: 350 PLN (29%)            │
│  On pace: ✅ Well under budget       │
│                                       │
│  🎮 Rozrywka                          │
│  ███████████████████ 760 / 800       │
│  Remaining: 40 PLN (5%)              │
│  On pace: ⚠️ Will exceed by 50 PLN   │
│                                       │
│  [... more categories ...]           │
└──────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Quick Actions                               │
│  [+ Add Expense] [Check Affordability]      │
└─────────────────────────────────────────────┘
```

**Dla każdej kategorii pokazuje:**
- **Remaining budget** (kwota + %)
- **Progress bar** (visual, color-coded)
- **Spent vs Budget** (850 / 1,200 PLN)
- **Pace indicator:**
  - ✅ "Will stay within budget" (green)
  - ⚠️ "Will exceed by X PLN" (orange)
  - 🚨 "Already exceeded" (red)
- **Days remaining** in month
- **Projected end-of-month spending**

**Color coding progress bars:**
- 0-70%: Green (safe zone)
- 71-90%: Yellow (warning zone)
- 91-100%: Orange (danger zone)
- 100%+: Red (exceeded)

**Summary Cards (top):**
- **Total Remaining:** Suma pozostałych budżetów
- **On track to save:** Prognoza oszczędności na koniec miesiąca
- **Days remaining:** Do końca miesiąca
- **Biggest spender:** Kategoria z największym % wykorzystania

**Interactions:**
- Klik na kategorię → rozwija szczegóły (lista ostatnich wydatków)
- Klik "Add Expense" → modal z pre-selected category
- Klik "Check Affordability" → kalkulator (opisany w FR-B003)

**Real-time updates:**
- Po dodaniu wydatku: instant update remaining budget
- Animacja progress bar (smooth transition)
- Badge z "New!" jeśli alert się pojawił

**Success Criteria:**
- ✅ Dashboard loads in < 1s
- ✅ 85% użytkowników sprawdza dashboard minimum 3x/tydzień
- ✅ Avg time on dashboard > 4 min (wzrost vs 3 min)
- ✅ 70% użytkowników rozumie "pace indicator" bez instrukcji

**Priority:** 🔴 P0 (Must-have - CORE)

---

### 6.3 FR-B003: "Can I Afford This?" Widget

**Opis:**  
Quick calculator pozwalający sprawdzić czy użytkownika stać na planowany wydatek PRZED jego dokonaniem.

**Wymagania:**

**Trigger:**
- Button "Check Affordability" na Budget Dashboard
- Shortcut: Floating action button (mobile)
- Keyboard shortcut: Ctrl+A (desktop)

**UI - Modal/Drawer:**
```
┌─────────────────────────────────────┐
│  💰 Can I Afford This?              │
├─────────────────────────────────────┤
│                                      │
│  How much? [____] PLN               │
│  Category: [Dropdown ▼]             │
│                                      │
│  ────────────────────                │
│                                      │
│  🍽️ Jedzenie                         │
│  Remaining: 350 PLN                 │
│                                      │
│  Your expense: 120 PLN              │
│  After purchase: 230 PLN (19%)     │
│                                      │
│  ✅ You can afford this!             │
│  You'll have 230 PLN left for       │
│  the next 12 days (~19 PLN/day)    │
│                                      │
│  [Cancel] [Add Expense Now]         │
└─────────────────────────────────────┘
```

**Logic:**
1. User enters kwotę + wybiera kategorię
2. System oblicza:
   - Remaining po wydatku
   - % budżetu które zostanie
   - Daily allowance = remaining / days left
3. System pokazuje verdict:
   - ✅ **Can afford** (remaining > 20%)
   - ⚠️ **Tight but OK** (remaining 10-20%)
   - 🚨 **Will exceed budget** (remaining < 10% or negative)

**Verdicts z kontekstem:**
- ✅ "You can afford this! You'll have X PLN left..."
- ⚠️ "Tight squeeze. This leaves you only X PLN for Y days"
- 🚨 "This will exceed your budget by X PLN. Consider..."

**Suggestions (dla exceeded):**
- "Use from [other category] instead?"
- "Postpone until next month?"
- "Adjust your budget?"

**Quick actions:**
- "Add Expense Now" → pre-fills expense form
- "Adjust Budget" → edit category budget
- "Use different category" → change dropdown

**Success Criteria:**
- ✅ 50% użytkowników używa tego minimum 1x/tydzień
- ✅ 80% użytkowników którzy sprawdzili i dostali 🚨 NIE dodaje tego wydatku
- ✅ 60% użytkowników po ✅ verdict dodaje wydatek

**Priority:** 🔴 P0 (Must-have - UNIQUE FEATURE)

---

### 6.4 FR-B004: Proactive Budget Alerts

**Opis:**  
System alertów które ostrzegają użytkownika PRZED problemami, nie po fakcie.

**Wymagania:**

**Typy alertów:**

**1. Approaching Limit (80% spent)**
```
⚠️ Rozrywka Alert
You've spent 640 PLN of 800 PLN budget (80%)
160 PLN remaining for 12 days

Tip: That's ~13 PLN/day. Plan accordingly!
[View Expenses] [Dismiss]
```

**2. Pace-Based Warning (projekcja przekroczenia)**
```
🚨 Transport Warning
At current pace, you'll exceed budget by 150 PLN

Current: 450 PLN spent in 18 days
Projected: 750 PLN by month end
Budget: 600 PLN

Slow down or adjust budget!
[View Expenses] [Adjust Budget] [Dismiss]
```

**3. Daily Limit Exceeded**
```
🔴 Daily Spending Alert
You've spent 85 PLN today in Jedzenie
Your daily allowance: 40 PLN (1,200 / 30 days)

Tomorrow, try to stay under 35 PLN to compensate
[OK]
```

**4. Budget Exceeded**
```
🚨 Budget Exceeded - Rozrywka
You've spent 820 PLN (budget: 800 PLN)
20 PLN over budget

Options:
• Use from another category
• Accept overspend (affects savings goal)
• Adjust budget for next month

[View Details] [Adjust]
```

**5. End-of-Month Forecast (5 days before)**
```
📊 Month-End Forecast
Based on your spending, you're on track to:
• Stay within budget in 7/10 categories ✅
• Exceed in Rozrywka by 50 PLN ⚠️
• Save 1,050 PLN (goal: 1,200) 📉

Total overspend: 50 PLN
Projected savings: 87% of goal

[View Breakdown]
```

**Alert Channels:**
- In-app: Badge na Budget Dashboard (primary)
- Push notification (optional, future V1.5)
- Email digest (daily summary, optional)

**Alert Settings (user configurable):**
- Enable/disable each alert type
- Threshold customization (80% default, można zmienić na 70/90%)
- Frequency: Real-time / Daily digest / Weekly only

**Alert Lifecycle:**
- **Created:** Gdy warunek spełniony
- **Shown:** W dedicated section na dashboard
- **Acknowledged:** User clicks "Dismiss" lub "View"
- **Resolved:** Problem rozwiązany (np. wrócił poniżej 80%)

**Persistence:**
- Unread alerts: Persist until acknowledged
- Read alerts: Archive po 7 dniach
- Counter badge w navigation

**Success Criteria:**
- ✅ 90% alertów jest acknowledged w < 24h (wzrost vs 80%)
- ✅ 70% użytkowników którzy dostali pace-based warning podejmuje akcję
- ✅ 50% redukcja w budget exceeded incidents po 3 miesiącach

**Priority:** 🔴 P0 (Must-have - CORE VALUE)

---

### 6.5 FR-B005: Budget Templates & Suggestions

**Opis:**  
Gotowe szablony budżetowe dla różnych profili użytkowników, ułatwiające setup.

**Wymagania:**

**Szablon Selection (w onboarding):**
```
Choose your budget profile:

┌──────────────────────────────────┐
│  👨‍💻 Young Professional            │
│  Income: 6-10k PLN               │
│  Focus: Career + Social Life     │
│                                   │
│  Mieszkanie: 35%                 │
│  Jedzenie: 15%                   │
│  Transport: 10%                  │
│  Rozrywka: 12%                   │
│  Oszczędności: 18%               │
│  ...                             │
│  [Preview] [Select]              │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  👨‍👩‍👧 Family Budget                │
│  Income: 10-15k PLN              │
│  Focus: Family Needs             │
│  ...                             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  💰 Aggressive Saver              │
│  Focus: Maximize Savings         │
│  ...                             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  🎨 Custom (Start from scratch)  │
└──────────────────────────────────┘
```

**Dostępne szablony:**

**1. Young Professional (6-10k PLN)**
- Mieszkanie: 35%
- Jedzenie: 15%
- Transport: 10%
- Rozrywka: 12%
- Zakupy: 8%
- Subskrypcje: 3%
- Zdrowie: 5%
- Oszczędności: 12%

**2. Family Budget (10-15k PLN)**
- Mieszkanie: 40%
- Jedzenie: 20%
- Transport: 12%
- Edukacja: 8%
- Zdrowie: 7%
- Rozrywka: 5%
- Oszczędności: 8%

**3. Aggressive Saver**
- Essentials: 50% total
- Lifestyle: 20% total
- Savings: 30% (goal!)

**4. Student Budget (3-5k PLN)**
- Mieszkanie: 40%
- Jedzenie: 25%
- Transport: 8%
- Edukacja: 10%
- Rozrywka: 10%
- Oszczędności: 7%

**Customization:**
- Po wyborze szablonu: możliwość dostosowania każdej kategorii
- System waliduje czy suma = 100%
- Tooltip z wyjaśnieniem każdej kategorii

**Intelligent Suggestions:**
System analizuje:
- Income level
- Age (jeśli podany)
- Location (Warszawa vs inne miasta)

I sugeruje:
- "Based on 8,000 PLN income in Warsaw, we recommend X% for Mieszkanie"
- "Users similar to you typically save 15%"

**Success Criteria:**
- ✅ 75% użytkowników wybiera template (vs custom)
- ✅ 60% użytkowników robi minimalne zmiany (< 3 kategorie)
- ✅ 90% ukończonych setupów (no abandon)

**Priority:** 🔴 P0 (Must-have - ONBOARDING SUCCESS)

---

### 6.6 FR-B006: Budget Adjustment & Rollover

**Opis:**  
Zarządzanie budżetami: edycja, rollover na następny miesiąc, korekty mid-month.

**Wymagania:**

**Mid-Month Adjustment:**
```
Edit Budget - Rozrywka

Current: 800 PLN
Spent so far: 650 PLN (81%)

New budget: [____] PLN

⚠️ Warning: You've already spent 650 PLN
Setting budget below this will mark as exceeded.

Recommended: ≥ 700 PLN (allows 50 PLN more)

[Cancel] [Save]
```

**Logic:**
- Można zwiększyć w każdej chwili
- Zmniejszenie: warning jeśli spent > new budget
- Update w real-time: instant refresh dashboard
- History: Log zmian budżetu (audit trail)

**Monthly Rollover (automated):**
1. **Last day of month:**
   - System generuje summary poprzedniego miesiąca
   - "October Budget Review" modal

2. **First day of new month:**
   - Budżety kopiowane z poprzedniego miesiąca
   - Option: "Use last month's budgets" (default) vs "Adjust"
   - Spent reset do 0

**Rollover Options:**
```
November Budget Setup

📊 October Performance:
✅ 7/10 categories within budget
⚠️ 3 categories exceeded

Options:
🔁 Use same budgets (recommended)
📈 Increase budgets by 10% across board
✏️ Customize for November

[Proceed]
```

**Surplus/Deficit Handling:**
- Surplus (saved money): "You saved 200 PLN last month! Add to savings or adjust budgets?"
- Deficit (overspent): "You overspent 150 PLN. Reduce November budgets or use from savings?"

**Budget History:**
- View all past months
- Compare month-over-month
- Export to CSV

**Success Criteria:**
- ✅ 85% użytkowników rolluje budżety na następny miesiąc (przyjmuje defaults)
- ✅ < 10% abandon rate w monthly transition
- ✅ 40% użytkowników adjustuje budżety based on performance

**Priority:** 🟡 P1 (Should-have - LIFECYCLE MANAGEMENT)

---

## 7. Moduł Wydatków - Functional Requirements (SUPPORTING MODULE)

### 7.1 FR-E001: Dodawanie Wydatku

**Opis:**  
Użytkownik może szybko dodać nowy wydatek, który automatycznie aktualizuje pozostały budżet w kategorii.

**Wymagania:**
- **Input fields:**
  - Kwota (required, number, > 0)
  - Kategoria (required, dropdown z user's categories + pokazuje remaining budget)
  - Data (required, date picker, max = today, default = today)
  - Opis (required, text, max 200 chars)
  - Metoda płatności (optional, enum: gotówka/karta/przelew/inne)
  - Notatki (optional, textarea, max 500 chars)
  - Tagi (optional, comma-separated)

**Category Dropdown z kontekstem budżetowym:**
```
Select Category:

🍽️ Jedzenie
   Budget: 350 PLN remaining (29%)
   ✅ You can afford this

🎮 Rozrywka  
   Budget: 40 PLN remaining (5%)
   ⚠️ Almost at limit!

🏠 Mieszkanie
   Budget: 300 PLN remaining (12%)
   ✅ Within budget
```

**Real-time Budget Preview (w formularzu):**
```
Amount: [120] PLN
Category: Jedzenie ▼

───────────────────────
Budget Impact:
Current: 850 / 1,200 PLN
After: 970 / 1,200 PLN
Remaining: 230 PLN (19%)

✅ This expense fits your budget
───────────────────────
```

- **Validation:**
  - Kwota musi być > 0
  - Opis nie może być pusty
  - Data nie może być w przyszłości
  - Kategoria musi istnieć w systemie
  - **Budget warning** jeśli expense > remaining budget

**Budget Warning Dialog:**
```
⚠️ Budget Warning

This 150 PLN expense will exceed your
Rozrywka budget by 110 PLN

Remaining: 40 PLN
After: -110 PLN

Options:
○ Add anyway (accept overspend)
○ Use different category
○ Reduce amount
○ Cancel

[Proceed] [Cancel]
```

- **Behavior:**
  - Po zapisaniu: success message z budget update
  - Formularz resetuje się do defaults
  - Budget Dashboard auto-refresh (real-time)
  - Jeśli przekroczono budżet → tworzy alert
  - Animacja: progress bar update

**Success Message:**
```
✅ Expense added!
   Jedzenie: 230 PLN remaining (19%)
   [View Budget] [Add Another]
```

**Success Criteria:**
- ✅ Użytkownik może dodać wydatek w < 30 sekund
- ✅ 95% wydatków dodawanych bez błędów walidacji
- ✅ Budżet aktualizuje się instant (< 1s)
- ✅ 80% użytkowników widzi budget preview przed dodaniem

**Priority:** 🔴 P0 (Must-have)

---

### 6.2 FR-E002: Kategoryzacja Wydatków

**Opis:**  
System umożliwia organizację wydatków w kategorie, z możliwością customizacji.

**Wymagania:**

**Predefiniowane kategorie (onboarding):**
- Jedzenie i napoje 🍽️
- Transport 🚗
- Zakupy 🛍️
- Mieszkanie 🏠
- Rozrywka 🎮
- Zdrowie ⚕️
- Edukacja 📚
- Subskrypcje 📱
- Podróże ✈️
- Oszczędności 💰
- Prezenty 🎁
- Inne 📌

**CRUD Operations:**
- **Create:** Użytkownik może dodać nową kategorię
  - Inputs: Nazwa, ikona (emoji picker), kolor (color picker), budżet miesięczny
- **Read:** Lista wszystkich kategorii (sortowane: aktywne na górze, potem nieaktywne)
- **Update:** Edycja nazwy, ikony, koloru, budżetu
- **Delete:** Soft delete (isActive = false) - nie kasujemy by zachować historię

**Podkategorie (Optional - Future):**
- Hierarchiczna struktura (1 poziom głębokości)
- Przykład: Transport → Paliwo, Parking, Serwis

**Budżet miesięczny:**
- Każda kategoria może mieć opcjonalny budżet
- System trackuje wydatki vs budżet
- Progress bar pokazuje wykorzystanie (%)

**Success Criteria:**
- ✅ Onboarding: 90% użytkowników wybiera minimum 5 kategorii
- ✅ Custom categories: 40% użytkowników tworzy własną kategorię w ciągu 30 dni
- ✅ Budget adherence: 70% użytkowników nie przekracza budżetu w kategoriach z budżetem

**Priority:** 🔴 P0 (Must-have)

---

### 6.3 FR-E003: Budżety Miesięczne

**Opis:**  
Użytkownik może ustawić limity wydatków dla kategorii i otrzymywać alerty przy przekroczeniu.

**Wymagania:**

**Ustawianie budżetu:**
- Per kategoria
- Kwota (PLN)
- Period: monthly (MVP), yearly (future)
- Alert threshold: 80% / 90% / 100%

**Tracking:**
- System automatycznie liczy wydatki w danej kategorii w bieżącym miesiącu
- Cached value w `budgets.spent` dla performance
- Recalculation trigger: po każdym dodaniu/edycji/usunięciu wydatku

**Alerty:**
- **Approaching limit (80%):** 🟡 Żółty alert
- **Near limit (90%):** 🟠 Pomarańczowy alert
- **Exceeded (100%+):** 🔴 Czerwony alert

**Typy alertów:**
1. **Budget exceeded** - przekroczono 100%
2. **Approaching limit** - 80-99%
3. **Above average** - wydatki > średnia 6-miesięczna o 20%+

**Alert display:**
- Dashboard: sekcja "Alerty" na górze (sticky)
- Progress bar na karcie kategorii
- Badge count w navigation

**Success Criteria:**
- ✅ 60% użytkowników ustawia budżet w minimum 3 kategoriach
- ✅ 80% alertów jest acknowledged (isRead = true)
- ✅ Średni czas reakcji na alert < 24h

**Priority:** 🔴 P0 (Must-have)

---

### 6.4 FR-E004: Dashboard Analityczny

**Opis:**  
Centralny dashboard pokazujący overview finansów z wykresami, statystykami i trendami.

**Wymagania:**

**Sekcja 1: Alerty (jeśli są)**
- Karty alertów (czerwone/pomarańczowe/żółte)
- Możliwość dismiss (mark as read)
- Sortowane: exceeded → approaching → above average

**Sekcja 2: Statystyki obecnego miesiąca**
Cards z metrics:
- **Total spent:** Suma wydatków (vs poprzedni miesiąc %)
- **Avg daily:** Średnia dzienna (vs target)
- **Projected:** Prognoza na koniec miesiąca (based on current pace)
- **Avg transaction:** Średnia wartość wydatku

**Sekcja 3: Wykres trendów miesięcznych**
- Line chart: ostatnie 12 miesięcy
- X-axis: miesiące (Sty, Lut, Mar...)
- Y-axis: kwota PLN
- Hover: tooltip z dokładną kwotą
- Responsive (mobile: scroll horizontal)

**Sekcja 4: Breakdown po kategoriach**
- Doughnut/Pie chart: % wydatków per kategoria
- Top 5 kategorii (reszta jako "Inne")
- Kolory = kolory kategorii
- Klik na segment → filtruje listę wydatków

**Sekcja 5: Tabela szczegółów kategorii**
Kolumny:
- Kategoria (ikona + nazwa)
- Bieżący miesiąc (kwota)
- Poprzedni miesiąc (kwota)
- Średnia 6m (kwota)
- Budżet (kwota + progress bar)
- Wykorzystanie (%)
- Trend (↑ ↓ →)

**Sekcja 6: Top wydatki**
- Lista 10 największych transakcji w bieżącym miesiącu
- Quick actions: edit, delete

**Filters:**
- Date range picker (default: current month)
- Category multiselect
- Min/max amount

**Success Criteria:**
- ✅ Dashboard loads in < 2 seconds
- ✅ 80% użytkowników odwiedza dashboard minimum 2x/tydzień
- ✅ Avg time on dashboard > 3 min

**Priority:** 🔴 P0 (Must-have)

---

### 6.5 FR-E005: Lista Wydatków

**Opis:**  
Przeszukiwalna i filtrowalna lista wszystkich wydatków użytkownika.

**Wymagania:**

**Display:**
- Cards/rows z informacjami:
  - Ikona kategorii + nazwa
  - Opis wydatku
  - Kwota (bold)
  - Data
  - Metoda płatności (badge)
  - Tagi (jeśli są)
- Sortowanie: date desc (default), amount desc/asc, category
- Paginacja: 50 per page (infinite scroll lub pagination buttons)

**Filters:**
- Date range (preset: today, last 7 days, last 30 days, custom)
- Category (multiselect)
- Amount range (slider)
- Payment method (multiselect)
- Tags (multiselect)
- Search (opis, notatki)

**Actions per wydatek:**
- Edit (modal)
- Delete (confirmation dialog)
- Duplicate (pre-fill form)

**Bulk actions:**
- Select multiple → delete
- Export selected to CSV

**Empty state:**
- "Brak wydatków" + CTA "Dodaj pierwszy wydatek"

**Success Criteria:**
- ✅ Filters apply in < 500ms
- ✅ Search results < 1s
- ✅ 60% użytkowników używa filtrów minimum 1x/tydzień

**Priority:** 🔴 P0 (Must-have)

---

### 6.6 FR-E006: Import/Export CSV

**Opis:**  
Użytkownik może importować wydatki z CSV (z innych systemów) oraz exportować dane do analizy offline.

**Wymagania:**

**Export:**
- Format: CSV (UTF-8)
- Columns: Data, Kwota, Kategoria, Opis, Metoda płatności, Notatki, Tagi
- Filename: `wydatki_YYYY-MM-DD.csv`
- Filters: eksportuj tylko filtered data (jeśli filters active)
- Button: "Export to CSV" na liście wydatków

**Import:**
- Upload CSV file (drag & drop lub file picker)
- Max size: 5MB
- Validation:
  - Check required columns (Data, Kwota, Kategoria, Opis)
  - Map category names to existing categories (case-insensitive)
  - Validate data types
  - Skip invalid rows (log errors)
- Preview: pokazuje first 10 rows przed importem
- Options:
  - Skip duplicates (based on: date + amount + description match)
  - Dry run (preview without saving)
- Progress indicator podczas importu
- Summary: "Imported X, Skipped Y, Errors Z"
- Error report downloadable (CSV with error descriptions)

**CSV Format Example:**
```csv
Data,Kwota,Kategoria,Opis,Metoda płatności,Notatki,Tagi
2025-10-15,45.50,Jedzenie i napoje,Biedronka zakupy,karta,Zakupy tygodniowe,spożywcze
2025-10-16,120.00,Transport,Paliwo,karta,,
```

**Success Criteria:**
- ✅ 20% użytkowników używa import w pierwszym tygodniu (migracja z Excel)
- ✅ 95% accuracy w mapping kategorii
- ✅ < 5% failed imports

**Priority:** 🟡 P1 (Should-have)

---

### 6.7 FR-E007: Onboarding Flow

**Opis:**  
Pierwszy użytkownik experience - setup kategorii i dodanie pierwszego wydatku.

**Wymagania:**

**Krok 1: Powitanie**
- Welcome screen z logo
- Krótki opis app (1-2 zdania)
- CTA: "Zacznij" button

**Krok 2: Wybór kategorii**
- Grid z 12 predefiniowanymi kategoriami
- Multi-select (checkbox style)
- Minimum: 3 kategorie required
- CTA: "Dalej" (disabled jeśli < 3)

**Krok 3: Budżety (opcjonalny)**
- "Chcesz ustawić budżety dla wybranych kategorii?"
- Lista wybranych kategorii + input field (kwota)
- CTA: "Pomiń" lub "Zapisz i kontynuuj"

**Krok 4: Dodaj pierwszy wydatek**
- Prosty formularz (tylko: kwota, kategoria, opis, data)
- Placeholder hints
- CTA: "Dodaj wydatek" → redirect do dashboard
- Option: "Pomiń" → dashboard (pusty state)

**Krok 5: Welcome tour (optional)**
- Tooltips pokazujące kluczowe features
- 3-4 steps: Dashboard, Dodaj wydatek, Alerty, Ustawienia
- Możliwość skip

**Success Criteria:**
- ✅ 80% completion rate (start → finish)
- ✅ Average time: 2-3 minuty
- ✅ 70% użytkowników dodaje pierwszy wydatek w onboarding

**Priority:** 🔴 P0 (Must-have)

---

### 6.8 FR-E008: Edycja Wydatku

**Opis:**  
Użytkownik może edytować istniejące wydatki (fix mistakes, update details).

**Wymagania:**

**Trigger:**
- Klik "Edit" na karcie wydatku
- Opens modal z formularzem

**Editable fields:**
- Wszystkie pola z create form (kwota, kategoria, data, opis, notatki, metoda płatności, tagi)
- Pre-filled z current values

**Validation:**
- Same rules as create

**Side effects:**
- Jeśli zmiana kategorii → update budgets (old i new category)
- Jeśli zmiana kwoty → update budget spent
- Jeśli zmiana daty → może wpłynąć na monthly stats (recalculate jeśli trzeba)

**History tracking:**
- Nie wymaga MVP, ale nice-to-have: audit log (kto, kiedy, co zmienił)

**Success Criteria:**
- ✅ 15% wydatków jest edytowanych w ciągu 7 dni od utworzenia
- ✅ 95% edycji bez błędów

**Priority:** 🔴 P0 (Must-have)

---

### 6.9 FR-E009: Usuwanie Wydatku

**Opis:**  
Użytkownik może usunąć wydatek (hard delete w MVP).

**Wymagania:**

**Trigger:**
- Klik "Delete" na karcie wydatku
- Confirmation dialog: "Czy na pewno chcesz usunąć ten wydatek? Ta operacja jest nieodwracalna."

**Actions:**
- Yes: delete document z Firestore
- No: cancel

**Side effects:**
- Update budget spent dla kategorii
- Delete attachments z Storage (jeśli były)

**Bulk delete:**
- Możliwość select multiple w liście → delete all
- Confirmation: "Czy na pewno chcesz usunąć X wydatków?"

**Success Criteria:**
- ✅ < 5% wydatków jest usuwanych (oznacza że validation działa)
- ✅ Zero data loss issues

**Priority:** 🔴 P0 (Must-have)

---

### 6.10 FR-E010: Wyszukiwanie i Filtrowanie

**Opis:**  
Szybkie znajdowanie wydatków poprzez search i advanced filters.

**Wymagania:**

**Search bar:**
- Placeholder: "Szukaj wydatków..."
- Search scope: opis + notatki
- Real-time search (debounce 300ms)
- Clear button (X)

**Filters panel:**
- Collapsible sidebar lub modal
- Filters:
  1. **Date range:**
     - Presets: Dzisiaj, Ostatnie 7 dni, Ostatnie 30 dni, Ten miesiąc, Poprzedni miesiąc, Custom range
     - Date picker dla custom
  2. **Category:** Multiselect checkboxes
  3. **Amount range:** Slider (min-max) lub two inputs
  4. **Payment method:** Multiselect
  5. **Tags:** Multiselect (autocomplete)
- Apply button
- Clear all filters button

**Filter persistence:**
- Save filters w URL query params (shareable links)
- Remember last used filters (localStorage)

**Results:**
- Update list dynamically
- Show count: "Znaleziono X wydatków"
- Highlight search terms w results

**Success Criteria:**
- ✅ Search results < 500ms
- ✅ 50% użytkowników używa search minimum 1x/miesiąc
- ✅ 30% używa advanced filters

**Priority:** 🟡 P1 (Should-have)

---

## 7. Moduł 2: Inwestycje - Functional Requirements

### 7.1 FR-I001: Konta Maklerskie

**Opis:**  
Użytkownik może dodawać i zarządzać wieloma kontami maklerskimi (multi-broker).

**Wymagania:**

**Dodawanie konta:**
- Inputs:
  - Nazwa brokera (text, np. "XTB", "mBank", "Revolut", "Interactive Brokers")
  - Nickname (optional, np. "Moje główne konto", "Konto emerytalne")
  - Numer konta (optional, masked: XXX-XXX-123)
  - Waluta bazowa (default: PLN, future: USD, EUR)
  - Data otwarcia (optional)
  - Notatki (optional)

**Display:**
- Cards z info:
  - Logo/ikona brokera
  - Nazwa + nickname
  - Łączna wartość pozycji (suma current value wszystkich positions)
  - P&L konta (suma P&L wszystkich positions)
  - % return
  - Liczba pozycji

**Actions:**
- Edit account details
- Deactivate (soft delete)
- View positions (filter list by accountId)

**Success Criteria:**
- ✅ Średnio 2.5 kont per użytkownik
- ✅ 90% użytkowników dodaje minimum 1 konto w pierwszym tygodniu

**Priority:** 🔴 P0 (Must-have)

---

### 7.2 FR-I002: Dodawanie Pozycji Inwestycyjnych

**Opis:**  
Użytkownik może ręcznie dodać pozycję (akcja, ETF, obligacja) do konta.

**Wymagania:**

**Inputs:**
- **Konto maklerskie** (required, dropdown)
- **Typ aktywa** (required, enum: akcja / ETF / obligacja)
- **Ticker/Symbol** (required, text, np. "AAPL", "SPY", "PL0000000000")
- **Nazwa** (optional, autocomplete if possible, np. "Apple Inc.")
- **Ilość** (required, number, > 0)
- **Średnia cena zakupu** (required, number, avgPrice)
- **Aktualna cena** (required, number, currentPrice) - MVP: ręczna, future: API
- **Waluta** (default: PLN, future: multi-currency)
- **Data pierwszego zakupu** (optional)
- **Notatki** (optional)

**Auto-calculations:**
- **Total invested:** `quantity * avgPrice`
- **Current value:** `quantity * currentPrice`
- **P&L (PLN):** `currentValue - totalInvested`
- **P&L (%):** `(currentValue - totalInvested) / totalInvested * 100`

**Validation:**
- Wszystkie liczby > 0
- Ticker format check (optional)

**Behavior:**
- Po zapisaniu: redirect do listy pozycji
- Account total value aktualizuje się

**Success Criteria:**
- ✅ Użytkownik może dodać pozycję w < 1 min
- ✅ Średnio 8 pozycji per użytkownik

**Priority:** 🔴 P0 (Must-have)

---

### 7.3 FR-I003: Lista Pozycji

**Opis:**  
Przegląd wszystkich pozycji inwestycyjnych z możliwością filtrowania.

**Wymagania:**

**Display:**
- Table lub cards z kolumnami:
  - Ticker + Nazwa
  - Typ aktywa (badge)
  - Konto (nazwa brokera)
  - Ilość
  - Avg price
  - Current price
  - Total value
  - P&L (PLN)
  - P&L (%)
  - Actions (edit, delete, add transaction)

**Sorting:**
- Default: P&L % desc (biggest winners first)
- Options: Ticker asc, Value desc, P&L asc

**Filters:**
- Account (multiselect)
- Asset type (multiselect)
- Profit/Loss (filter: only winners, only losers, all)

**Color coding:**
- P&L positive → green
- P&L negative → red
- P&L neutral (0) → gray

**Actions per position:**
- Edit (modal): update current price, avg price, quantity
- Delete (confirmation)
- Add transaction (modal): buy/sell/dividend

**Success Criteria:**
- ✅ List loads in < 1s
- ✅ 70% użytkowników sprawdza pozycje minimum 2x/tydzień

**Priority:** 🔴 P0 (Must-have)

---

### 7.4 FR-I004: Dashboard Inwestycji

**Opis:**  
Overview portfolio z kluczowymi metrykami, wykresami i insights.

**Wymagania:**

**Sekcja 1: Summary Cards**
- **Łączna wartość portfolio:** Suma current value wszystkich pozycji
- **Łączny P&L (PLN):** Suma P&L
- **Łączny P&L (%):** Weighted average return
- **Zainwestowane:** Suma total invested
- **Liczba pozycji:** Count aktywnych positions
- **Liczba kont:** Count active accounts

**Sekcja 2: Alokacja Aktywów (Pie Chart)**
- Breakdown by asset type: Akcje X%, ETF-y Y%, Obligacje Z%
- Color-coded
- Klik na segment → filter positions list

**Sekcja 3: Alokacja per Konto (Bar Chart)**
- Horizontal bars: każde konto = bar
- Length = % total portfolio value
- Hover: tooltip z exact value

**Sekcja 4: Top Winners & Losers**
- Two columns:
  - **Top 5 Winners:** Pozycje z największym P&L %
  - **Top 5 Losers:** Pozycje z najmniejszym P&L %
- Display: Ticker, P&L %, P&L PLN

**Sekcja 5: Performance Over Time (Future - V1.5)**
- Line chart: portfolio value over time
- Requires: historical price data lub manual snapshots

**Filters:**
- Date range (for historical data, future)
- Account (filter entire dashboard by account)

**Success Criteria:**
- ✅ Dashboard loads in < 2s
- ✅ 85% użytkowników odwiedza dashboard inwestycji minimum 1x/tydzień

**Priority:** 🔴 P0 (Must-have)

---

### 7.5 FR-I005: Transakcje (Buy/Sell/Dividend)

**Opis:**  
Tracking historii transakcji dla każdej pozycji.

**Wymagania:**

**Typy transakcji:**
1. **Buy:** Kupno akcji
2. **Sell:** Sprzedaż akcji
3. **Dividend:** Dywidenda otrzymana

**Dodawanie transakcji:**

**Buy Transaction:**
- Inputs:
  - Position (linked)
  - Quantity (number)
  - Price per share (number)
  - Total cost (auto-calculated: quantity * price + fees)
  - Fees (optional, broker commission)
  - Date (date picker)
  - Notes (optional)
- Effect: Update position avgPrice (weighted average)

**Sell Transaction:**
- Inputs: Similar to Buy
- Effect: 
  - Decrease position quantity
  - Calculate realized P&L
  - If quantity = 0 → position closed

**Dividend Transaction:**
- Inputs:
  - Position (linked)
  - Amount (gross)
  - Tax withheld (optional)
  - Net amount (auto: gross - tax)
  - Payment date
  - Notes
- Effect: Add to total dividends received (tracked separately)

**Historia transakcji:**
- Lista wszystkich transakcji
- Filters: Type, Date range, Position
- Display: Date, Type, Ticker, Quantity, Price, Total, P&L (for sells)
- Export to CSV

**Success Criteria:**
- ✅ 60% użytkowników dodaje transakcje regularnie (tracking all buys/sells)
- ✅ Accuracy w avg price calculations = 100%

**Priority:** 🟡 P1 (Should-have dla MVP, can be simplified)

---

### 7.6 FR-I006: Aktualizacja Cen (Manual w MVP)

**Opis:**  
Użytkownik może ręcznie zaktualizować aktualną cenę pozycji.

**Wymagania:**

**MVP (Manual):**
- Edit position → update currentPrice field
- Bulk update: Select multiple positions → "Update prices" → modal z inputs per position

**Future (V1.5 - API Integration):**
- Integracja z API (Alpha Vantage, Yahoo Finance, IEX Cloud)
- Auto-refresh co X minut (for real-time data)
- Manual refresh button ("Odśwież ceny")
- Last updated timestamp

**Success Criteria (MVP):**
- ✅ 80% użytkowników aktualizuje ceny minimum 1x/tydzień
- ✅ < 5% błędów w wpisywanych cenach

**Priority:** 🟡 P1 (Manual MVP, API future)

---

## 8. User Stories & Use Cases

### 8.1 User Stories - Moduł Wydatków

#### US-E001: Quick Expense Add
**As a** busy professional  
**I want to** quickly add an expense in < 30 seconds  
**So that** I don't have friction in tracking my spending

**Acceptance Criteria:**
- Form has only essential fields visible by default
- Auto-fills date to today
- Remembers last used category
- One-click submit

---

#### US-E002: Budget Overrun Alert
**As a** budget-conscious user  
**I want to** be alerted when I exceed my category budget  
**So that** I can adjust my spending behavior

**Acceptance Criteria:**
- Alert shows immediately after adding expense that causes overrun
- Alert includes: category name, amount over budget, % over budget
- Alert persists on dashboard until acknowledged
- Option to increase budget directly from alert

---

#### US-E003: Spending Trend Analysis
**As a** data-driven user  
**I want to** see my spending trends over last 6 months  
**So that** I can identify patterns and optimize

**Acceptance Criteria:**
- Line chart shows monthly totals for 6 months
- Ability to drill down by category
- Shows comparison to previous period
- Highlights month with highest/lowest spending

---

#### US-E004: Category Customization
**As a** user with unique spending patterns  
**I want to** create custom categories  
**So that** my tracking matches my lifestyle

**Acceptance Criteria:**
- Can create category with custom name, icon, color
- Can set monthly budget for category
- Can edit/deactivate category
- Deactivated categories don't affect new expenses but preserve history

---

#### US-E005: Data Export for Tax
**As a** self-employed user  
**I want to** export my expenses to CSV  
**So that** I can use data for tax filing

**Acceptance Criteria:**
- Export button on expenses list
- Can filter before export (e.g., only "Business" tagged expenses)
- CSV includes all relevant fields
- Filename includes date range

---

### 8.2 User Stories - Moduł Inwestycji

#### US-I001: Multi-Broker Portfolio View
**As an** investor with multiple brokerage accounts  
**I want to** see all my positions in one place  
**So that** I don't need to log into each broker separately

**Acceptance Criteria:**
- Can add multiple accounts
- Dashboard aggregates P&L across all accounts
- Can filter view by specific account
- Each position shows which account it belongs to

---

#### US-I002: P&L Tracking
**As an** active investor  
**I want to** see my profit/loss for each position  
**So that** I can evaluate my investment decisions

**Acceptance Criteria:**
- P&L shows both PLN and % return
- Color-coded (green = profit, red = loss)
- Calculates from weighted average purchase price
- Includes fees in calculation

---

#### US-I003: Asset Allocation View
**As a** diversification-focused investor  
**I want to** see my portfolio allocation by asset type  
**So that** I can ensure proper diversification

**Acceptance Criteria:**
- Pie chart shows % in Stocks, ETFs, Bonds
- Clicking segment filters positions list
- Shows target allocation vs actual (future)
- Highlights over/under-weighted assets

---

#### US-I004: Transaction History
**As a** diligent investor  
**I want to** keep track of all my buy/sell transactions  
**So that** I have accurate records for tax purposes

**Acceptance Criteria:**
- Can log buy, sell, dividend transactions
- Each transaction updates position metrics
- Can view full transaction history per position
- Can export history to CSV

---

#### US-I005: Quick Price Update
**As a** long-term investor  
**I want to** easily update current prices weekly  
**So that** my portfolio value is always accurate

**Acceptance Criteria:**
- Bulk update: select all → enter new prices
- Last updated timestamp visible
- (Future) Auto-refresh button for API prices

---

### 8.3 Use Cases - Detailed Scenarios

#### UC-001: First-Time User Onboarding

**Primary Actor:** New User  
**Goal:** Complete onboarding and add first expense

**Preconditions:**
- User has created account (email/Google auth)
- User is on welcome screen

**Main Flow:**
1. User clicks "Zacznij"
2. System displays category selection grid (12 default categories)
3. User selects 5 categories (Jedzenie, Transport, Mieszkanie, Rozrywka, Inne)
4. User clicks "Dalej"
5. System asks "Chcesz ustawić budżety?"
6. User selects "Tak" → enters budgets for 3 categories
7. User clicks "Dalej"
8. System shows "Dodaj pierwszy wydatek" form
9. User enters: 45.50 PLN, Jedzenie, "Biedronka zakupy", today
10. User clicks "Dodaj"
11. System saves expense, redirects to dashboard
12. Dashboard shows: 1 expense, budget progress bars, empty charts

**Alternative Flows:**
- 3a. User selects < 3 categories → "Dalej" button disabled
- 6a. User clicks "Pomiń" → goes directly to step 8
- 9a. User clicks "Pomiń" → dashboard with empty state CTA

**Postconditions:**
- User has selected categories stored in Firestore
- Budgets (if set) are stored
- First expense (if added) is stored
- onboardingCompleted = true
- User is on main dashboard

**Success Metric:** 80% completion rate

---

#### UC-002: Monthly Budget Review

**Primary Actor:** Existing User (end of month)  
**Goal:** Review spending vs budgets, adjust for next month

**Preconditions:**
- User has been tracking expenses for 1 month
- User has budgets set for 3+ categories

**Main Flow:**
1. User navigates to Dashboard
2. System shows alerts: "Przekroczono budżet w kategorii Rozrywka" (120%)
3. User clicks alert → sees detailed breakdown
4. User reviews "Szczegóły kategorii" table
   - Jedzenie: 800/1000 PLN (80%) ✅
   - Transport: 650/600 PLN (108%) ⚠️
   - Rozrywka: 720/600 PLN (120%) 🚨
5. User clicks "Rozrywka" → views list of expenses in that category
6. User identifies: 4 cinema trips (400 PLN), 2 concerts (320 PLN)
7. User decides: reduce cinema budget for next month
8. User navigates to Categories settings
9. User edits "Rozrywka" → changes budget from 600 to 500 PLN
10. User marks alert as read
11. System updates budget for next month cycle

**Alternative Flows:**
- 7a. User decides spending was justified → increases budget instead
- 10a. User exports expenses to CSV for deeper analysis in Excel

**Postconditions:**
- Budgets adjusted for next month
- User has insights into spending patterns
- Alerts acknowledged

**Success Metric:** 70% budget adherence rate

---

#### UC-003: Adding New Investment Position

**Primary Actor:** Investor  
**Goal:** Add newly purchased stock position to portfolio

**Preconditions:**
- User has at least 1 brokerage account added
- User has purchased stocks (e.g., 10 shares of AAPL)

**Main Flow:**
1. User navigates to Inwestycje → Pozycje
2. User clicks "Dodaj pozycję"
3. System shows form
4. User selects:
   - Konto: "XTB - Główne"
   - Typ: "Akcja"
   - Ticker: "AAPL"
5. System auto-suggests: "Apple Inc."
6. User enters:
   - Ilość: 10
   - Średnia cena: 180.00 USD (konwertowane do PLN: 720 PLN)
   - Aktualna cena: 185.00 USD (740 PLN)
7. System calculates:
   - Total invested: 7,200 PLN
   - Current value: 7,400 PLN
   - P&L: +200 PLN (+2.78%)
8. User clicks "Zapisz"
9. System saves position, updates account total value
10. User is redirected to lista pozycji
11. New position appears in list, sorted by P&L %

**Alternative Flows:**
- 4a. Ticker not recognized → User enters manually without autocomplete
- 6a. User leaves current price = avg price (assumes no change yet)

**Postconditions:**
- Position stored in Firestore
- Account total value updated
- Dashboard charts updated (asset allocation)

**Success Metric:** Average 8 positions per user

---

## 9. User Flows & Journey Maps

### 9.1 User Flow: Adding an Expense

```
[Dashboard] 
    ↓
[Click "+ Dodaj wydatek" button]
    ↓
[Expense Form Modal Opens]
    ↓
[Fill required fields: Amount, Category, Date, Description]
    ↓
[Optional: Add notes, tags, payment method]
    ↓
[Click "Dodaj wydatek"]
    ↓
[Validation]
    ↓
{Valid?} 
    Yes ↓                          No ↓
[Save to Firestore]          [Show validation errors]
    ↓                               ↓
[Update budget spent]          [User corrects inputs]
    ↓                               ↓
[Check if budget exceeded]     [Back to validation]
    ↓
{Budget exceeded?}
    Yes ↓                    No ↓
[Create alert]          [No alert]
    ↓                         ↓
[Show success message] ←------┘
    ↓
[Close modal, refresh expenses list]
    ↓
[Return to Dashboard]
```

---

### 9.2 User Flow: Onboarding

```
[Sign Up / Login]
    ↓
[Welcome Screen]
    ↓
[Click "Zacznij"]
    ↓
[Category Selection Screen]
    ↓
[User selects 3+ categories]
    ↓
[Click "Dalej"]
    ↓
[Budget Setup Screen (Optional)]
    ↓
{User wants to set budgets?}
    Yes ↓                    No ↓
[Enter budgets] --------→ [Skip]
    ↓                         ↓
[Click "Dalej"] ←-------------┘
    ↓
[Add First Expense Screen]
    ↓
{User wants to add expense?}
    Yes ↓                    No ↓
[Fill expense form] ----→ [Skip]
    ↓                         ↓
[Click "Dodaj"] ←-------------┘
    ↓
[Mark onboardingCompleted = true]
    ↓
[Redirect to Dashboard]
    ↓
{First expense added?}
    Yes ↓                    No ↓
[Dashboard with data]    [Dashboard empty state]
                              ↓
                        [CTA: "Dodaj pierwszy wydatek"]
```

---

### 9.3 Journey Map: Monthly Budget User

**Persona:** Oszczędny Tomek (28, developer, wants to save 30%)

| Phase | Touchpoint | Actions | Thoughts | Emotions | Pain Points | Opportunities |
|-------|-----------|---------|----------|----------|-------------|---------------|
| **Discovery** | Google search "budget app polska" | Searches for budgeting tool | "Potrzebuję czegoś prostego" | 😐 Neutral | Too many options | SEO optimization |
| **Sign Up** | Landing page | Reads features, clicks "Start free" | "Looks simple enough" | 🙂 Curious | None | Clear value prop |
| **Onboarding** | Category selection | Picks 5 categories | "This is quick!" | 😊 Pleased | None | Smooth flow |
| | Budget setup | Sets budgets for 3 categories | "Not sure what limits to set" | 🤔 Uncertain | No guidance on amounts | Suggest budgets based on salary |
| | First expense | Adds coffee purchase | "That was easy" | 😊 Satisfied | None | - |
| **Week 1** | Daily usage | Adds 2-3 expenses/day | "I'm remembering!" | 😊 Motivated | Sometimes forgets | Push notifications (future) |
| | Dashboard | Checks progress | "Hmm, lots on coffee" | 😮 Surprised | - | Insight highlight |
| **Week 2** | Alert | Receives "80% budget used" | "Already?!" | 😰 Worried | - | Actionable tips |
| | Expense list | Reviews coffee category | "4 times this week" | 🤔 Reflective | - | Category insights |
| | Behavior change | Reduces coffee shop visits | "Making coffee at home" | 💪 Determined | - | - |
| **Week 3** | Dashboard | Below average spending | "I'm doing it!" | 🎉 Accomplished | - | - |
| **Week 4** | Monthly review | Exports to CSV, analyzes | "Saved 25%!" | 😄 Happy | - | - |
| **Long-term** | Habit formation | Tracks without thinking | "It's automatic now" | 😌 Confident | - | Referral program |

**Key Insights:**
- ⚡ Speed of onboarding is critical (< 3 min)
- 🎯 Budgets need suggested defaults
- 🔔 Alerts are effective behavior change triggers
- 📊 Visual progress is motivating
- 🎁 Success stories → referrals

---

### 9.4 User Flow: Investment Portfolio Check (Weekly)

```
[User opens app on Sunday]
    ↓
[Navigate to Inwestycje Dashboard]
    ↓
[View summary cards: Total value, P&L]
    ↓
{P&L positive?}
    Yes ↓                       No ↓
[Feel good 😊]            [Feel concerned 😟]
    ↓                            ↓
[Click "Top Winners"]      [Click "Top Losers"]
    ↓                            ↓
[Review which positions    [Identify losing positions]
 are performing well]           ↓
    ↓                     [Click on loser position]
    ↓                            ↓
[Scroll to position list] [View position details]
    ↓                            ↓
[Click "Odśwież ceny"]    [Decision: Hold or Sell?]
    ↓                            ↓
[Bulk update prices for   {Decide to sell?}
 all positions]               Yes ↓           No ↓
    ↓                     [Note to sell]   [Hold position]
[View updated P&L]              ↓                ↓
    ↓                     [External: Login  [Continue browsing]
[Check asset allocation]   to broker,           ↓
    ↓                      execute sell]   [Close app]
{Balanced?}                     ↓
   Yes ↓            No ↓       [Return to app]
[Close app]    [Note to        ↓
                rebalance]  [Add sell transaction]
                    ↓            ↓
               [Close app]  [Position updates]
                                ↓
                          [Close app]
```

---

## 10. Feature Prioritization

### 10.1 MoSCoW Method

#### ✅ MUST HAVE (MVP - Launch Blockers)

**Wydatki:**
- ✅ Dodawanie wydatku (ręczne)
- ✅ Kategoryzacja (predefiniowane + custom)
- ✅ Budżety miesięczne per kategoria
- ✅ Dashboard z podstawową analityką
- ✅ Lista wydatków (sortowanie, filtrowanie)
- ✅ Edycja/usuwanie wydatku
- ✅ Onboarding flow
- ✅ System alertów (przekroczenie budżetu)

**Inwestycje:**
- ✅ Konta maklerskie (multi-account)
- ✅ Dodawanie pozycji (ręczne)
- ✅ Lista pozycji z P&L
- ✅ Dashboard inwestycji (summary, alokacja)
- ✅ Edycja pozycji (update prices)

**Core:**
- ✅ Autentykacja (email, Google)
- ✅ Responsive design
- ✅ Security (Firestore rules)

---

#### 🟢 SHOULD HAVE (MVP+ / V1.1)

**Wydatki:**
- 🟢 Import/Export CSV
- 🟢 Wyszukiwanie (search bar)
- 🟢 Advanced filters (amount range, tags)
- 🟢 Załączniki do wydatków (receipts)
- 🟢 Wydatki cykliczne (recurring)

**Inwestycje:**
- 🟢 Transakcje (buy/sell/dividend tracking)
- 🟢 Historia transakcji per pozycja
- 🟢 Export portfolio to CSV

**Core:**
- 🟢 Dark mode
- 🟢 Settings page (currency, language)
- 🟢 Profile page (user info, stats)

---

#### 🟡 COULD HAVE (V1.5 / V2.0)

**Wydatki:**
- 🟡 Podkategorie (hierarchical)
- 🟡 Multi-currency support
- 🟡 Receipt OCR scanning
- 🟡 Wykresy porównawcze (month-over-month)
- 🟡 Goals & savings targets

**Inwestycje:**
- 🟡 Real-time price updates (API)
- 🟡 Auto-refresh prices (scheduled)
- 🟡 Portfolio performance over time (chart)
- 🟡 Dividend calendar
- 🟡 Crypto support

**Core:**
- 🟡 Push notifications (web)
- 🟡 Email digests (weekly summary)
- 🟡 Export wszystkich danych (PDF report)

---

#### 🔵 WON'T HAVE (Post V2.0 / Future)

**Wydatki:**
- 🔵 Bank integrations (Open Banking)
- 🔵 Automatic transaction import
- 🔵 AI spending predictions
- 🔵 Bill reminders
- 🔵 Shared budgets (family accounts)

**Inwestycje:**
- 🔵 Broker API integrations (auto-import)
- 🔵 Options & derivatives tracking
- 🔵 Tax optimization suggestions
- 🔵 Real estate investments
- 🔵 Alternative investments (P2P, crowdfunding)

**Core:**
- 🔵 Native mobile apps (iOS, Android)
- 🔵 Desktop app (Electron)
- 🔵 API dla third-party integrations

---

### 10.2 Launch Phases

#### Phase 1: MVP (V1.0) - 3 months
**Goal:** Core functionality for early adopters

**Features:**
- ✅ All MUST HAVE items
- 🎯 Target: 100 beta users
- 📊 Success metric: 70% retention D7

**Timeline:**
- Month 1: Architecture + Auth + Firestore setup
- Month 2: Wydatki module (all core features)
- Month 3: Inwestycje module + testing + launch

---

#### Phase 2: Enhancement (V1.1) - 1 month post-launch
**Goal:** Improve based on user feedback

**Features:**
- 🟢 Import/Export CSV
- 🟢 Advanced filters
- 🟢 Transaction history (investments)
- 🔧 Bug fixes from V1.0
- 🎨 UI/UX improvements

**Timeline:**
- Weeks 1-2: Development
- Weeks 3-4: Testing + rollout

---

#### Phase 3: Scale (V1.5) - 3 months post-V1.1
**Goal:** Scale to 1,000 users

**Features:**
- 🟡 Real-time investment prices (API)
- 🟡 Multi-currency support
- 🟡 Receipt OCR
- 📱 Push notifications
- 🚀 Marketing push

**Timeline:**
- Month 1: API integrations
- Month 2: Multi-currency + OCR
- Month 3: Marketing + growth

---

#### Phase 4: Advanced (V2.0) - 6 months post-V1.5
**Goal:** Market leader in Poland

**Features:**
- 🔵 Bank integrations (Open Banking)
- 🔵 AI insights
- 🔵 Mobile apps (native)
- 🏆 Premium tier (subscription model)

---

## 11. Non-Functional Requirements

### 11.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Page load time | < 2s | Lighthouse |
| API response time | < 500ms | Server logs |
| Database query | < 300ms | Firestore metrics |
| Dashboard render | < 1s | React Profiler |
| Expense add (end-to-end) | < 30s | User testing |
| Real-time updates | < 1s delay | onSnapshot latency |

**Optimization strategies:**
- Server Components dla static content
- Client Components tylko gdy needed
- Firestore indexes dla frequent queries
- Caching z Next.js revalidation
- Image optimization (next/image)
- Code splitting (dynamic imports)

---

### 11.2 Scalability

**Target Load:**
- **MVP:** 100 concurrent users
- **V1.5:** 1,000 concurrent users
- **V2.0:** 10,000 concurrent users

**Firestore Limits:**
- Reads: 1M/day free tier → need monitoring
- Writes: 500K/day free tier
- Storage: 1GB free tier

**Scaling Strategy:**
- **Horizontal:** Vercel auto-scales
- **Database:** Firestore auto-scales
- **CDN:** Vercel Edge Network
- **Caching:** Redis/Upstash dla aggregated data (future)

---

### 11.3 Security

**Authentication:**
- ✅ Firebase Auth (email/password, Google OAuth)
- ✅ ID token verification w API routes
- ✅ Session management
- 🔒 2FA (future - V1.5)

**Authorization:**
- ✅ Firestore Security Rules (user-level isolation)
- ✅ API route authorization checks
- ✅ No direct Firestore access from client (except auth)

**Data Protection:**
- ✅ HTTPS only
- ✅ Firestore rules prevent data leakage
- ✅ Input validation (XSS prevention)
- ✅ SQL injection N/A (NoSQL)
- 🔒 Data encryption at rest (Firestore default)
- 🔒 PII handling (GDPR compliance)

**Security Rules Example:**
```javascript
// User can only access their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
  
  match /expenses/{expenseId} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

---

### 11.4 Reliability & Availability

**Uptime Target:** 99.9% (8.76 hours downtime/year max)

**Dependencies:**
- Firebase: 99.95% SLA
- Vercel: 99.99% SLA

**Error Handling:**
- ✅ Try-catch w wszystkich API routes
- ✅ User-friendly error messages
- ✅ Fallback UI dla failed loads
- ✅ Retry logic dla transient failures
- 📊 Error logging (Sentry - future)

**Backup & Recovery:**
- 🔄 Firestore automatic backups (daily)
- 📦 Export functionality dla user data
- 🔙 Rollback strategy (Git + Vercel)

---

### 11.5 Usability

**Accessibility (WCAG 2.1 Level AA):**
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Color contrast (min 4.5:1)
- ✅ Screen reader compatible
- 🔲 Skip to content links

**Internationalization:**
- 🇵🇱 Polish (MVP)
- 🌍 English (V1.5)
- 🔄 i18n setup w kodzie (prepared for future)

**Browser Support:**
- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ❌ IE11 (not supported)

**Mobile:**
- ✅ Responsive design (mobile-first)
- ✅ Touch-friendly (min 44x44px tap targets)
- ✅ PWA ready (future)

---

### 11.6 Maintainability

**Code Quality:**
- ✅ TypeScript (100% typed)
- ✅ ESLint + Prettier
- ✅ Component documentation (Storybook - future)
- ✅ Code reviews (PR process)
- ✅ Testing (unit, integration, e2e)

**Testing Coverage Target:**
- Unit tests: 70%
- Integration tests: 50%
- E2E tests: Critical paths only

**Documentation:**
- ✅ README.md (setup instructions)
- ✅ API documentation (inline comments)
- ✅ Architecture diagrams
- ✅ PRD (this document)

---

## 12. Technical Architecture (High-Level)

### 12.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    USER (Browser)                    │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────┐
│              Next.js App (Vercel)                    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         App Router (Next.js 14+)           │    │
│  │                                             │    │
│  │  • Server Components (SSR)                 │    │
│  │  • Client Components (CSR)                 │    │
│  │  • API Routes (/api/*)                     │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         React Components                   │    │
│  │                                             │    │
│  │  • Expenses UI                             │    │
│  │  • Investments UI                          │    │
│  │  • Dashboard                               │    │
│  │  • Analytics Charts (Chart.js)             │    │
│  └────────────────────────────────────────────┘    │
└───────────┬──────────────────────┬──────────────────┘
            │                      │
            │                      │
            ↓                      ↓
┌──────────────────────┐  ┌──────────────────────┐
│   Firebase Auth      │  │   Firebase Firestore │
│                      │  │                      │
│  • Email/Password    │  │  • /users/{uid}      │
│  • Google OAuth      │  │  • /expenses         │
│  • ID Token          │  │  • /categories       │
│                      │  │  • /investments      │
└──────────────────────┘  │  • /budgets          │
                          │                      │
                          │  Real-time listeners │
                          └──────────────────────┘
                                   │
                                   │
                          ┌────────↓──────────┐
                          │ Firebase Storage  │
                          │                   │
                          │  • Receipt images │
                          │  • Attachments    │
                          └───────────────────┘
```

---

### 12.2 Data Flow - Adding Expense

```
User fills form in CreateExpenseForm (Client Component)
        ↓
User clicks "Dodaj wydatek"
        ↓
Client-side validation (React Hook Form)
        ↓
{Valid?} → No → Show validation errors
        ↓ Yes
Call API: POST /api/expenses
        ↓
API Route (Next.js Server)
        ↓
Verify Firebase ID Token (auth check)
        ↓
{Authenticated?} → No → Return 401 Unauthorized
        ↓ Yes
Validate request body (Zod schema)
        ↓
{Valid?} → No → Return 400 Bad Request
        ↓ Yes
Check if category exists in Firestore
        ↓
{Exists?} → No → Return 404 Not Found
        ↓ Yes
Create expense document in Firestore:
  /users/{uid}/expenses/{expenseId}
        ↓
Update budget spent (cached value):
  /users/{uid}/budgets/{budgetId}.spent += amount
        ↓
Check if budget exceeded
        ↓
{Exceeded?} → Yes → Create budget alert document
        ↓
revalidatePath('/dashboard/expenses')
        ↓
Return 200 OK with expenseId
        ↓
Client receives response
        ↓
Show success message
        ↓
Real-time listener updates ExpensesList (onSnapshot)
        ↓
Dashboard refreshes with new data
```

---

### 12.3 Technology Stack Details

**Frontend:**
- **Framework:** Next.js 14+ (App Router)
  - Server Components by default
  - Client Components for interactivity
- **UI Library:** React 18+
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS 3+
- **Charts:** Chart.js + react-chartjs-2
- **Forms:** React Hook Form + Zod validation
- **State Management:** React Context (minimal, most state in Firestore)
- **Real-time:** Firebase onSnapshot listeners

**Backend:**
- **API:** Next.js API Routes (serverless)
- **Auth:** Firebase Authentication
  - Email/Password provider
  - Google OAuth provider
- **Database:** Firebase Firestore (NoSQL)
  - Real-time database
  - Automatic scaling
  - Built-in security rules
- **Storage:** Firebase Storage (for attachments)
- **Functions:** Firebase Cloud Functions (future - scheduled jobs)

**DevOps:**
- **Hosting:** Vercel (Next.js optimized)
- **CI/CD:** Vercel Git integration
- **Monitoring:** Vercel Analytics (future: Sentry)
- **Logging:** Console.log → Vercel logs (future: structured logging)

**External Services (Future):**
- **Email:** SendGrid / Resend (for notifications)
- **Price API:** Alpha Vantage / Yahoo Finance (investment prices)
- **OCR:** Google Cloud Vision API (receipt scanning)

---

### 12.4 Database Schema (Firestore)

**Collection Structure:**

```
/users (collection)
  /{userId} (document)
    - email: string
    - displayName: string
    - currency: string
    - onboardingCompleted: boolean
    - createdAt: timestamp
    
    /categories (subcollection)
      /{categoryId} (document)
        - name: string
        - icon: string
        - color: string
        - parentCategoryId: string | null
        - monthlyBudget: number | null
        - isDefault: boolean
        - order: number
        - isActive: boolean
        - createdAt: timestamp
    
    /expenses (subcollection)
      /{expenseId} (document)
        - amount: number
        - currency: string
        - categoryId: string
        - date: timestamp
        - createdAt: timestamp
        - description: string
        - notes: string | null
        - paymentMethod: enum
        - tags: array<string>
        - isRecurring: boolean
        - attachments: array<object>
    
    /budgets (subcollection)
      /{budgetId} (document)
        - categoryId: string
        - amount: number
        - period: enum
        - spent: number (cached)
        - lastCalculated: timestamp
        - alertThreshold: number
    
    /budgetAlerts (subcollection)
      /{alertId} (document)
        - categoryId: string
        - type: enum
        - threshold: number
        - currentSpent: number
        - budgetAmount: number
        - month: string
        - isRead: boolean
        - createdAt: timestamp
        - message: string
    
    /monthlyStats (subcollection)
      /{month} (document) // YYYY-MM
        - totalSpent: number
        - expenseCount: number
        - byCategory: map<categoryId, amount>
        - averageDailySpending: number
        - calculatedAt: timestamp
    
    /investmentAccounts (subcollection)
      /{accountId} (document)
        - brokerName: string
        - nickname: string
        - accountNumber: string
        - currency: string
        - createdAt: timestamp
        - isActive: boolean
    
    /positions (subcollection)
      /{positionId} (document)
        - accountId: string
        - ticker: string
        - name: string
        - assetType: enum (stock/etf/bond)
        - quantity: number
        - avgPrice: number
        - currentPrice: number
        - currency: string
        - totalInvested: number (calculated)
        - currentValue: number (calculated)
        - plAmount: number (calculated)
        - plPercent: number (calculated)
        - createdAt: timestamp
    
    /transactions (subcollection)
      /{transactionId} (document)
        - positionId: string
        - type: enum (buy/sell/dividend)
        - quantity: number
        - price: number
        - totalCost: number
        - fees: number
        - date: timestamp
        - notes: string
        - realizedPL: number (for sells)
```

**Indexes Required:**
```
Collection: expenses
- Composite: categoryId ASC + date DESC
- Composite: date DESC + amount DESC

Collection: positions
- Composite: accountId ASC + assetType ASC

Collection: transactions
- Composite: positionId ASC + date DESC
```

---

## 13. Risks & Mitigations

### 13.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Firestore cost overrun** | Medium | High | • Monitor daily read/write counts<br>• Implement caching (monthlyStats)<br>• Optimize queries (use indexes)<br>• Set up billing alerts |
| **Performance degradation** | Medium | Medium | • Lazy load components<br>• Use Server Components<br>• Implement pagination (50 items/page)<br>• Monitor Lighthouse scores |
| **Security vulnerability** | Low | High | • Regular security audits<br>• Firebase Security Rules testing<br>• Input validation (Zod)<br>• HTTPS only |
| **Data loss** | Low | Critical | • Firestore automatic backups<br>• Export functionality<br>• No hard deletes (soft delete) |
| **Third-party API failures** (future) | Medium | Medium | • Fallback to manual entry<br>• Retry logic<br>• Cache last known prices |
| **Browser compatibility issues** | Low | Low | • Cross-browser testing<br>• Polyfills for missing features<br>• Progressive enhancement |

---

### 13.2 Product Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Low user adoption** | Medium | High | • Beta testing with target users<br>• SEO optimization<br>• Content marketing (blog)<br>• Referral program |
| **High onboarding drop-off** | Medium | High | • A/B test onboarding flow<br>• Simplify to 2 steps minimum<br>• Optional features (skip budgets)<br>• Progress indicator |
| **Users don't see value** | Medium | High | • Clear value prop on landing page<br>• Show insights immediately<br>• Gamification (achievements)<br>• Email engagement campaigns |
| **Feature bloat** | Low | Medium | • Stick to MVP scope<br>• User feedback before adding features<br>• Prioritization framework (MoSCoW) |
| **Competitor launches similar product** | Medium | Medium | • Speed to market (3-month MVP)<br>• Focus on unique features<br>• Build community early |

---

### 13.3 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **No monetization model** | Low | Medium | • V1.0 = free (user acquisition)<br>• V2.0 = freemium model:<br>&nbsp;&nbsp;- Free: Basic features<br>&nbsp;&nbsp;- Premium (29 PLN/mo): Advanced analytics, unlimited positions, API access |
| **GDPR compliance issues** | Low | High | • Privacy policy<br>• Terms of service<br>• Data export functionality<br>• Right to be forgotten (delete account) |
| **Dependence on Firebase** | Medium | Medium | • Firebase is industry standard<br>• Migration plan (abstract DB layer)<br>• Monitor Firebase pricing changes |
| **Team capacity** | Low | Low | • Single developer MVP feasible<br>• Phased rollout<br>• Community contributions (open source future?) |

---

## 14. Future Roadmap

### 14.1 Post-MVP Enhancements (V1.5 - V2.0)

**Q1 2026:**
- ✨ Real-time investment prices (API integration)
- 📱 Push notifications (web)
- 💱 Multi-currency support
- 📄 Receipt OCR scanning
- 📧 Email weekly summaries

**Q2 2026:**
- 🏦 Open Banking integration (Plaid/TrueLayer for Poland)
- 🤖 AI spending insights
- 📊 Advanced analytics (custom date ranges, export to PDF)
- 🎯 Savings goals & tracking
- 👥 Shared budgets (family accounts)

**Q3 2026:**
- 📱 Native mobile apps (iOS, Android)
- 🔔 Smart alerts (ML-based predictions)
- 💳 Crypto wallet tracking
- 🏠 Real estate investment tracking
- 🔗 Broker API integrations (auto-import)

**Q4 2026:**
- 🌍 International expansion (EN, DE markets)
- 💼 Premium tier launch (subscription model)
- 📈 Tax optimization tools
- 🤝 Partnerships with brokers
- 🏆 Gamification & challenges

---

### 14.2 Vision 2027

**Greedy Szumrak becomes:**
- 🥇 #1 Personal Finance App in Poland (50K+ users)
- 🌍 Available in 5 countries (PL, CZ, SK, DE, UK)
- 💰 Profitable (30% revenue from premium subscriptions)
- 🏆 Award-winning UX
- 🤖 AI-powered financial advisor
- 🔗 Integration hub (20+ brokers, 10+ banks)

---

## 15. Appendix

### 15.1 Glossary

**Term** | **Definition**
---------|---------------
**Expense** | A single financial transaction where money is spent
**Category** | A classification for expenses (e.g., Food, Transport)
**Budget** | A spending limit set for a category over a period (month/year)
**Alert** | A notification when budget is exceeded or approaching limit
**Position** | An investment holding (e.g., 10 shares of AAPL)
**P&L** | Profit and Loss - the gain or loss on an investment
**Ticker** | Stock symbol (e.g., AAPL for Apple Inc.)
**Asset Type** | Category of investment (Stock, ETF, Bond, etc.)
**Brokerage Account** | An account with a broker for buying/selling investments
**Allocation** | Distribution of portfolio across different asset types
**MVP** | Minimum Viable Product - first version with core features

---

### 15.2 References

**Tools & Libraries:**
- Next.js: https://nextjs.org/
- Firebase: https://firebase.google.com/
- Chart.js: https://www.chartjs.org/
- Tailwind CSS: https://tailwindcss.com/

**Competitors Analyzed:**
- YNAB (You Need A Budget)
- Mint
- Personal Capital
- Wallet by BudgetBakers
- Spendee

**Design Inspiration:**
- Dribbble: Finance app designs
- Mobbin: Mobile patterns

---

### 15.3 Contact & Team

**Product Owner:** [Your Name]  
**Lead Developer:** [Your Name]  
**Designer:** [TBD]

**Feedback:** feedback@greedyszumrak.pl  
**Support:** support@greedyszumrak.pl

---

**Document Status:** Draft  
**Last Updated:** 27 października 2025  
**Next Review:** Po beta launch

---

# ✅ Document Complete

This Product Requirements Document provides a comprehensive foundation for building **Greedy Szumrak**.

**Key Sections:**
- ✅ Executive Summary & Vision
- ✅ User Personas & Target Market
- ✅ Functional Requirements (Expenses + Investments)
- ✅ User Stories & Use Cases
- ✅ Technical Architecture
- ✅ Risk Management
- ✅ Roadmap & Future Vision

**Next Steps:**
1. Review and validate with stakeholders
2. Create implementation plan (sprints, tasks)
3. Design UI/UX mockups
4. Set up development environment
5. Begin MVP development

**For questions or updates, contact the product team.**