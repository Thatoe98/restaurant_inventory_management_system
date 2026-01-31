# RestaurantOS Testing Procedures

## Quality Assurance Guide

This document outlines comprehensive testing procedures for the RestaurantOS system, covering functional testing, integration testing, performance testing, and user acceptance testing.

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Pre-Testing Checklist](#pre-testing-checklist)
3. [Functional Test Cases](#functional-test-cases)
4. [Integration Tests](#integration-tests)
5. [Performance Tests](#performance-tests)
6. [User Acceptance Tests](#user-acceptance-tests)
7. [Regression Testing](#regression-testing)
8. [Bug Reporting](#bug-reporting)
9. [Test Automation](#test-automation)

---

## Testing Overview

### Testing Levels

```
┌─────────────────────────────────────────────────────────┐
│                  User Acceptance Testing                 │
│              (Real users, real scenarios)                │
├─────────────────────────────────────────────────────────┤
│                  Integration Testing                     │
│           (Components working together)                  │
├─────────────────────────────────────────────────────────┤
│                  Functional Testing                      │
│           (Individual features work)                     │
├─────────────────────────────────────────────────────────┤
│                    Unit Testing                          │
│           (Code-level testing)                           │
└─────────────────────────────────────────────────────────┘
```

### Testing Environment

- **Development**: localhost:3000
- **Staging**: [staging URL]
- **Production**: [production URL]

### Test Data

Use the provided CSV files for consistent test data:
- 60+ menu items
- 4,455 sales records
- 89 daily summaries
- 217 cashbook transactions
- 35 ingredients

---

## Pre-Testing Checklist

Before running tests, ensure:

- [ ] Development server is running (`npm run dev`)
- [ ] Database has test data imported
- [ ] Browser console is open for error monitoring
- [ ] Network tab is open for API monitoring
- [ ] Latest code is deployed

---

## Functional Test Cases

### TC-001: Dashboard Loading

**Objective:** Verify dashboard loads correctly with all components

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to / | Dashboard page loads |
| 2 | Check header | Shows "Restaurant Dashboard" |
| 3 | Check navigation cards | 4 cards visible (Sales, Menu, Ingredients, Reports) |
| 4 | Check Today's Performance | 4 metric cards with data |
| 5 | Check Month to Date | 3 colored cards with totals |
| 6 | Check Top Selling Items | List of 5 items |
| 7 | Check Recent Performance | 7 days of data |
| 8 | Check Period Summary | Summary card with totals |

**Pass Criteria:** All elements load without errors

---

### TC-002: Navigation

**Objective:** Verify all navigation links work correctly

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Sales Analytics" card | Navigate to /sales |
| 2 | Click "Back to Dashboard" | Return to / |
| 3 | Click "Menu Management" card | Navigate to /menu |
| 4 | Click "Back to Dashboard" | Return to / |
| 5 | Click "Ingredients" card | Navigate to /ingredients |
| 6 | Click "Back to Dashboard" | Return to / |
| 7 | Click "Financial Reports" card | Navigate to /reports |
| 8 | Click "Import Data" button | Navigate to /import |

**Pass Criteria:** All navigation works without 404 errors

---

### TC-003: Menu Page Functionality

**Objective:** Verify menu filtering and search work

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /menu | Menu page loads |
| 2 | Count menu items | 60+ items displayed |
| 3 | Type "Pizza" in search | Only pizza items show |
| 4 | Clear search | All items return |
| 5 | Click "Pizza Grande" filter | Only Pizza Grande items show |
| 6 | Click "Drinks" filter | Only drink items show |
| 7 | Click "All" filter | All items return |
| 8 | Verify card data | Each card shows name, price, cost, GP |
| 9 | Check Summary Stats | Shows totals for filtered items |

**Pass Criteria:** Filtering and search work correctly

---

### TC-004: Sales Page Functionality

**Objective:** Verify sales analytics features

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /sales | Sales page loads |
| 2 | Check default date range | Shows reasonable range |
| 3 | Verify summary cards | 4 cards with data |
| 4 | Check Top Selling Items | 20 items listed |
| 5 | Check Daily Sales table | Shows daily breakdown |
| 6 | Change start date | Data updates |
| 7 | Change end date | Data updates |
| 8 | Set empty date range | Handles gracefully (no errors) |
| 9 | Set future date range | Shows no data or zero values |

**Pass Criteria:** Date filtering works, calculations are correct

---

### TC-005: Ingredients Page Functionality

**Objective:** Verify ingredient management features

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /ingredients | Page loads |
| 2 | Check summary cards | Shows count, low stock, value |
| 3 | Search for "Flour" | Only Flour shows |
| 4 | Clear search | All ingredients return |
| 5 | Click + on an ingredient | Stock In dialog opens |
| 6 | Enter quantity | Preview shows new level |
| 7 | Click Confirm | Stock updates |
| 8 | Click - on same ingredient | Stock Out dialog opens |
| 9 | Enter quantity | Preview shows new level |
| 10 | Click Confirm | Stock updates |
| 11 | Cancel dialog | No changes made |

**Pass Criteria:** Stock adjustments work correctly

---

### TC-006: Reports Page Functionality

**Objective:** Verify financial reports

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /reports | Reports page loads |
| 2 | Check P&L Statement | All sections visible |
| 3 | Verify Revenue section | Shows Net Sales |
| 4 | Verify COGS section | Shows costs and gross profit |
| 5 | Verify OpEx section | Shows all expense categories |
| 6 | Verify Operating Profit | Shows bottom line |
| 7 | Check Cashbook table | Shows recent transactions |
| 8 | Change date range | All values update |
| 9 | Verify calculations | GP = Sales - COGS |

**Pass Criteria:** All financial calculations are accurate

---

### TC-007: Data Import

**Objective:** Verify CSV import functionality

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to /import | Import page loads |
| 2 | Click Initialize | Ingredients created (35) |
| 3 | Upload Menu CSV | Shows success with count |
| 4 | Upload Daily Sales CSV | Shows success (4000+ records) |
| 5 | Upload Daily Summary CSV | Shows success (89 records) |
| 6 | Upload Cashbook CSV | Shows success (217 records) |
| 7 | Navigate to Dashboard | Data is visible |
| 8 | Import same file again | Updates without duplicates |
| 9 | Upload invalid file | Shows error message |

**Pass Criteria:** All imports succeed with correct record counts

---

### TC-008: Error Handling

**Objective:** Verify system handles errors gracefully

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Disconnect internet | Shows error or cached data |
| 2 | Navigate to /invalid-page | Shows 404 page |
| 3 | Submit empty form | Shows validation error |
| 4 | Enter invalid date | Handles gracefully |
| 5 | Enter negative stock | Prevents or shows error |

**Pass Criteria:** No unhandled errors, user-friendly messages

---

### TC-009: Responsive Design

**Objective:** Verify mobile responsiveness

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Chrome DevTools | Press F12 |
| 2 | Toggle device toolbar | Click phone icon |
| 3 | Select iPhone 12 | Viewport changes |
| 4 | Check Dashboard | All elements stack properly |
| 5 | Check navigation | Mobile menu works |
| 6 | Check tables | Horizontal scroll available |
| 7 | Check forms | Inputs are usable |
| 8 | Test iPad size | Works correctly |

**Pass Criteria:** Usable on mobile devices

---

## Integration Tests

### IT-001: Database Connectivity

**Objective:** Verify Supabase connection

```
Test Steps:
1. Start application
2. Open browser console
3. Navigate to Dashboard
4. Check Network tab for Supabase calls
5. Verify responses return 200 status
6. Verify data is correct

Pass Criteria: All API calls succeed
```

### IT-002: Query Invalidation

**Objective:** Verify data updates propagate

```
Test Steps:
1. Open Ingredients page
2. Note current stock for an item
3. Add stock using + button
4. Verify UI updates immediately
5. Refresh page
6. Verify change persisted

Pass Criteria: Changes visible immediately and persist
```

### IT-003: Cross-Page Data Consistency

**Objective:** Verify data matches across pages

```
Test Steps:
1. Note Low Stock count on Dashboard
2. Navigate to Ingredients
3. Count items with "Low Stock" badge
4. Counts should match

Pass Criteria: Data is consistent across pages
```

---

## Performance Tests

### PT-001: Page Load Times

**Objective:** Verify acceptable load times

| Page | Target | Max Acceptable |
|------|--------|----------------|
| Dashboard | < 2s | 5s |
| Menu | < 2s | 5s |
| Sales | < 3s | 6s |
| Reports | < 3s | 6s |
| Ingredients | < 2s | 5s |

**How to Test:**
1. Open DevTools Network tab
2. Navigate to page
3. Check total load time
4. Repeat 3 times and average

### PT-002: Large Data Sets

**Objective:** Verify system handles bulk data

```
Test Steps:
1. Import all CSV files
2. Navigate to Sales page
3. Set date range to full period
4. Page should load within 5 seconds
5. All data should display correctly

Pass Criteria: No timeouts or crashes
```

---

## User Acceptance Tests

### UAT-001: Daily Sales Check Workflow

**Scenario:** Manager checks today's performance

```
Steps:
1. Open RestaurantOS
2. View Dashboard
3. Check "Sales Today" metric
4. Compare to previous days in "Recent Performance"
5. Click to see more details if needed

Expected: Manager can quickly assess business performance
Duration: < 1 minute
```

### UAT-002: Low Stock Alert Workflow

**Scenario:** Staff member checks what needs ordering

```
Steps:
1. Open RestaurantOS
2. View Dashboard "Low Stock Items" count
3. Navigate to Ingredients
4. Identify all items with "Low Stock" badge
5. Note quantities needed

Expected: Clear visibility of what needs reordering
Duration: < 2 minutes
```

### UAT-003: Monthly Report Generation

**Scenario:** Accountant generates month-end report

```
Steps:
1. Open RestaurantOS
2. Navigate to Reports
3. Set date range to full month
4. Review P&L statement
5. Review Cashbook transactions
6. Export or screenshot as needed

Expected: Complete financial picture available
Duration: < 5 minutes
```

### UAT-004: Menu Analysis Workflow

**Scenario:** Owner analyzes menu profitability

```
Steps:
1. Open RestaurantOS
2. Navigate to Menu
3. Review items with high Cost % (red)
4. Navigate to Sales
5. Check if high-cost items are selling well
6. Make pricing decisions

Expected: Data supports business decisions
Duration: < 10 minutes
```

---

## Regression Testing

After any code changes, run these quick checks:

### Quick Regression Checklist

- [ ] Dashboard loads with data
- [ ] All navigation links work
- [ ] Menu search and filter work
- [ ] Sales date filter works
- [ ] Ingredients stock adjustment works
- [ ] Reports P&L displays correctly
- [ ] No console errors

### Full Regression

Run complete test suite (TC-001 through TC-009) after:
- Major feature additions
- Dependency updates
- Database schema changes
- Before production deployment

---

## Bug Reporting

### Bug Report Template

```markdown
## Bug Report

**Title:** [Brief description]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Version: [App version if known]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Third step]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach any relevant screenshots]

**Console Errors:**
[Paste any errors from browser console]

**Severity:**
- [ ] Critical (System unusable)
- [ ] High (Major feature broken)
- [ ] Medium (Feature partially working)
- [ ] Low (Minor issue, workaround exists)
```

### Bug Severity Definitions

| Level | Definition | Example |
|-------|------------|---------|
| Critical | System unusable | Can't load any page |
| High | Major feature broken | Can't save data |
| Medium | Feature partially working | Filter missing one option |
| Low | Minor/Cosmetic | Alignment off by pixels |

---

## Test Automation

### Recommended Tools

For future automation:
- **Playwright** - End-to-end testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing

### Sample Test Structure

```typescript
// Example Playwright test
import { test, expect } from '@playwright/test';

test('dashboard loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Restaurant Dashboard');
  await expect(page.locator('[data-testid="sales-today"]')).toBeVisible();
});

test('menu search works', async ({ page }) => {
  await page.goto('/menu');
  await page.fill('[placeholder="Search menu items..."]', 'Pizza');
  const items = await page.locator('[data-testid="menu-item"]').count();
  expect(items).toBeGreaterThan(0);
});
```

### CI/CD Integration

Add to GitHub Actions or similar:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm test
```

---

## Testing Schedule

### Daily (During Development)
- Run quick regression checklist
- Check console for errors

### Weekly
- Full functional test suite
- Performance spot checks

### Before Release
- Complete regression testing
- User acceptance testing
- Performance testing
- Cross-browser testing

---

*Quality is not an act, it is a habit.*
