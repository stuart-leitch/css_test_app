# CSS Test Calculator - Functional Specification

## Overview

A mobile-first web application that helps swimmers calculate their Critical Swim Speed (CSS) using the standard 200m/400m time trial method.

---

## What is CSS?

Critical Swim Speed is the theoretical swimming pace that can be maintained continuously without exhaustion. It is calculated from two time trials:
- A **200m** maximal effort swim
- A **400m** maximal effort swim (after rest)

**Formula:**
```
CSS (per 100m) = (400m time - 200m time) ÷ 2
```

---

## Features

### 1. CSS Calculator Tab

Manual entry of trial times to calculate CSS.

#### Inputs
| Field | Format | Examples |
|-------|--------|----------|
| 200m Time | MM:SS, MM:SS.s, or total seconds | `3:28`, `3:28.5`, or `208.5` |
| 400m Time | MM:SS, MM:SS.s, or total seconds | `7:20`, `7:20.25`, or `440.25` |

#### Behaviour
- Times can be entered flexibly (MM:SS format or plain seconds)
- Input is parsed and validated on blur (when user leaves the field)
- Each trial displays a breakdown immediately after input:
  - Total seconds
  - Time in MM:SS format
  - Pace per 100m
- CSS result appears automatically when both valid times are entered
- "Start Again" button clears all inputs and results

#### Validation Rules
| Rule | Error Message |
|------|---------------|
| 400m time must be greater than 200m time | "400m time must be greater than 200m time" |
| 400m pace/100m cannot be faster than 200m pace/100m | "400m pace cannot be faster than 200m pace" |
| Invalid MM:SS (seconds ≥ 60) rejected | Input not accepted |

---

### 2. CSS Timer Tab

Live stopwatch for timing trials in real-time.

#### Workflow
1. **200m Trial**
   - User taps "Start" to begin timer
   - Timer displays elapsed time in `M:SS.s` format
   - User taps "Stop" to record time
   - Breakdown displays (seconds, MM:SS, pace/100m)

2. **400m Trial** (appears after 200m complete)
   - Same process as 200m trial

3. **CSS Result**
   - Automatically calculated and displayed after both trials complete
   - Shows CSS pace per 100m in MM:SS format

4. **Reset**
   - "Start Again" button resets both trials and results

---

## Output Format

All pace values are displayed as **MM:SS per 100m** (e.g., `1:52/100`).

### Trial Breakdown
When times include fractional seconds, the breakdown displays them:

| Metric | Whole Seconds | Fractional Seconds |
|--------|---------------|--------------------|
| Seconds | `208 sec` | `208.5 sec` |
| Time | `3:28` | `3:28.5` |
| Pace | `1:44/100` | `1:44.3/100` |

### CSS Result
Prominently displayed in large format with label "Critical Swim Speed (CSS)".

---

## Technical Notes

### Responsive Design
- Optimised for mobile browsers (iPhone SE and up)
- Touch-friendly buttons and inputs
- Numeric keyboard triggered on mobile

### Browser Support
- Modern browsers (Chrome, Safari, Firefox, Edge)
- No server required (static files only)

---

## Example Calculation

| Input | Value |
|-------|-------|
| 200m time | 4:00 (240 seconds) |
| 400m time | 8:20 (500 seconds) |

| Output | Calculation | Result |
|--------|-------------|--------|
| 200m pace | 240 ÷ 2 | 2:00/100 |
| 400m pace | 500 ÷ 4 | 2:05/100 |
| **CSS** | (500 - 240) ÷ 2 | **2:10/100** |
