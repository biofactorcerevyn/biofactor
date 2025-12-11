# Sales & Marketing Reports - Visual Guide

## Page Layout Wireframe

```
┌────────────────────────────────────────────────────────────────────────┐
│ 📄 Sales & Marketing Reports                                           │
│ Analyze sales performance and marketing metrics                        │
└────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ┌──────────────────┐   ┌─────────────────────────────────────────────┐ │
│  │  🔽 FILTERS      │   │  💰 Total Revenue      📊 Total Orders      │ │
│  │  ┌────────────────┤   │  ₹5,00,000 L            450 Orders          │ │
│  │  │ Report Type    │   │  ▲ 15%                 ▼ -5%               │ │
│  │  │ ∨ Sales Overv. │   │                                             │ │
│  │  │                │   │  👥 New Customers                           │ │
│  │  ├────────────────┤   │  850 Customers                              │ │
│  │  │ Date Range     │   │  ▲ 22%                                      │ │
│  │  │ ∨ Last 30 Days │   │                                             │ │
│  │  │                │   │  🎯 Conversion Rate      [📥 Export CSV]    │ │
│  │  ├────────────────┤   │  42.50%                 [🖨️  Print / PDF]  │ │
│  │  │ Group By       │   └─────────────────────────────────────────────┘ │
│  │  │ ∨ By Date      │                                                   │
│  │  │                │   ┌─────────────────────────────────────────────┐ │
│  │  ├────────────────┤   │ 📈 Revenue & Orders Trend                   │ │
│  │  │ [Apply Filters]│   │                                             │ │
│  │  │                │   │        ╱╲        ╱╲    ╱╲                 │ │
│  │  └────────────────┘   │       ╱  ╲      ╱  ╲  ╱  ╲              │ │
│  │                       │      ╱    ╲    ╱    ╲╱    ╲            │ │
│  │                       │     ╱      ╲  ╱                        │ │
│  │                       │    ╱        ╲╱                          │ │
│  │                       │                                         │ │
│  │                       │   Jan  Feb  Mar  Apr  May  Jun         │ │
│  │                       │   ─ Revenue  ─ Orders                  │ │
│  │                       └─────────────────────────────────────────┘ │
│  │                                                                   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │
│  │  │ Report Details                                               │ │
│  │  ├─────────────────────────────────────────────────────────────┤ │
│  │  │ Date  │ Region │ Dealer      │ Orders │ Revenue    │ Status  │ │
│  │  ├─────────────────────────────────────────────────────────────┤ │
│  │  │ Dec 1 │ North  │ Dealer 45   │ 12     │ ₹2,50,000  │ ✓ Done  │ │
│  │  │ Dec 2 │ South  │ Dealer 23   │ 8      │ ₹1,85,000  │ ⏳ Pend │ │
│  │  │ Dec 3 │ East   │ Dealer 67   │ 15     │ ₹3,40,000  │ → Prog  │ │
│  │  │ Dec 4 │ West   │ Dealer 12   │ 10     │ ₹2,10,000  │ ✓ Done  │ │
│  │  │ Dec 5 │ Central│ Dealer 89   │ 13     │ ₹2,80,000  │ ⏳ Pend │ │
│  │  │                                                               │ │
│  │  │ Showing 1-5 of 125 results    [◄ Previous] Page 1 [Next ►]  │ │
│  │  └─────────────────────────────────────────────────────────────┘ │
│  │                                                                   │
│  └───────────────────────────────────────────────────────────────────┘
│
```

## Color Usage

### Green Primary (Brand Color)
- Filter sidebar border: `border-l-primary`
- All buttons: `bg-primary hover:bg-primary/90`
- Icons in headers: `text-primary`
- Active states and accents

### Blue Secondary (Department Color)
- Chart accent line: Chart color in trends
- Department-specific badges

### White/Light Backgrounds
- Cards: `bg-card`
- Input fields: `bg-background`
- Hover states: `hover:bg-secondary`

---

## Component States

### Loading State
```
KPI Cards: Skeleton placeholders (animated pulse)
Chart: Skeleton rectangle
Table: Loading spinner "Loading data..."
Buttons: Disabled state
```

### Empty State
```
Chart: 📊 Icon + "No data available" message
Table: Empty message "No report data available..."
```

### Filter States
```
Active: Green button highlight
Hover: Darker green background
Disabled: Reduced opacity, pointer-events-none
```

---

## Responsive Breakpoints

### Mobile (<768px)
```
Filter Sidebar → Stacked above content
KPI Cards → 1 column (vertical stack)
Chart → Full width, height adjusted
Table → Horizontal scroll enabled
Buttons → Full width stacked
```

### Tablet (768px-1024px)
```
Filter Sidebar → 1 column (takes ~25% width)
Content → 3 columns
KPI Cards → 2x2 grid (when space allows)
Chart → Responsive height
Table → Full responsive
```

### Desktop (>1024px)
```
Filter Sidebar → Fixed 1 column (lg:col-span-1)
Content → Flexible (lg:col-span-3)
KPI Cards → 3 columns
Chart → Optimal 400px height
Table → Full with horizontal scroll on overflow
```

---

## Interactive Elements

### Buttons
```
Primary Style:
bg-primary hover:bg-primary/90 text-primary-foreground
├─ Export CSV (with Download icon)
└─ Print / PDF (with Printer icon)

Secondary Style:
bg-outline border-border hover:bg-secondary
├─ Pagination Previous
└─ Pagination Next

Ghost Style:
hover:bg-secondary rounded-md
└─ Reset Filters (X icon)
```

### Form Elements
```
Selects:
- Report Type
- Date Range
- Group By

Custom Date Inputs:
- Start Date (date picker)
- End Date (date picker)

Search/Text:
- Searchable inputs (if needed)
```

### Table Interactions
```
Row Hover: bg-secondary/20 (subtle highlight)
Pagination: Previous/Next buttons with chevron icons
Row Count: "Showing X to Y of Z results"
```

---

## Data Display Format

### KPI Cards
```
Title: "Total Revenue"
Value: "₹5,00,000" (formatted currency)
Change: "▲ 15%" (green/red icon + percentage)
Label: "vs last period"
Icon: Dollar sign / Users / Target
```

### Chart
```
Type: Line, Area, or Bar (based on report type)
X-Axis: Date or category
Y-Axis: Numerical values
Legend: Data key names
Tooltip: Hover for details
Colors: Green primary, Blue secondary
```

### Table Rows
```
Date: Formatted as "dd MMM yyyy"
Region: Plain text
Dealer: Plain text
Orders: Numerical
Revenue: Formatted as "₹XX,XXX"
Status: Badge with color (✓ Done, ⏳ Pending, → In Progress)
Conversion Rate: Formatted as "XX.XX%"
```

---

## User Journey

```
1. Open Reports Page
   ↓
2. View Default Data (Last 30 days, Sales Overview)
   ├─ See KPI Summary
   ├─ View Trend Chart
   └─ Browse Table Data
   ↓
3. Apply Filters
   ├─ Select Report Type
   ├─ Choose Date Range
   ├─ Set Group By
   └─ Click Apply
   ↓
4. View Filtered Results
   ├─ KPIs update
   ├─ Chart refreshes
   └─ Table shows new data
   ↓
5. Export Data
   ├─ Click Export CSV → Download .csv file
   └─ Click Print/PDF → Browser print dialog
```

---

## Accessibility Features

- ✓ Semantic HTML (buttons, tables, forms)
- ✓ Color contrast compliant
- ✓ Keyboard navigation support
- ✓ ARIA labels where needed
- ✓ Form labels properly associated
- ✓ Icon + text for buttons
- ✓ Loading states announced
- ✓ Focus states visible

---

## Animation & Micro-interactions

```
Loading: Pulse animation on skeleton
Fade In: Cards fade in on page load
Hover: Subtle background color transition
Active: Border/background color change
Print: Browser print dialog
Pagination: Smooth scroll to table on page change
```

---

## Browser Compatibility

- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Generated:** December 9, 2025
**Component Version:** 1.0
**Status:** Production Ready ✅
