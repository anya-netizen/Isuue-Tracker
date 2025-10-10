# 🎯 Dynamic Priority System - Complete Guide

## Overview

Your Customer Success Dashboard now features an **intelligent, automatic priority system** that:
- ✅ Calculates priority based on multiple factors
- ✅ Shows how long tickets have been open
- ✅ Automatically escalates priority as tickets age
- ✅ Highlights urgent items with visual indicators

## 🔢 Priority Calculation System

### Base Priority Scores
```
CRITICAL: 100 points
HIGH:      75 points
MEDIUM:    50 points
LOW:       25 points
```

### Time-Based Auto-Escalation

The system **automatically adds points** based on how long the ticket has been open:

| Days Open | Points Added | Escalation Level |
|-----------|-------------|------------------|
| 0-3 days  | +0 points   | 🆕 Recent |
| 4-7 days  | +5 points   | 📅 Open |
| 8-14 days | +10 points  | ⏰ Aging |
| 15-21 days| +20 points  | ⚠️ Overdue |
| 22-30 days| +30 points  | 🔥 URGENT |
| 31+ days  | +40 points  | 🚨 CRITICAL |

### Keyword Detection

**High Priority Keywords (+15 points each):**
- critical, urgent, failure, down, outage
- breach, security, data loss
- revenue, compliance, patient safety
- billing, HIPAA, lawsuit, emergency, crash

**Medium Priority Keywords (+5 points each):**
- issue, problem, error, bug
- delay, slow, missing, incorrect
- discrepancy, timeout

### Category Multipliers

Issues in critical categories get their score **multiplied**:

| Category | Multiplier | Impact |
|----------|-----------|---------|
| Security | 1.6x | Highest |
| Compliance | 1.5x | Very High |
| Billing | 1.4x | High |
| Patient | 1.4x | High |
| Data | 1.3x | Medium-High |
| Technical | 1.2x | Medium |

### Final Priority Assignment

After all calculations:

| Total Score | Priority Level | Visual Indicator |
|-------------|---------------|------------------|
| 150+ points | **CRITICAL** | 🔴 Red pulsing badge |
| 100-149 points | **HIGH** | 🟠 Orange badge |
| 60-99 points | **MEDIUM** | 🟡 Yellow badge |
| 0-59 points | **LOW** | 🔵 Blue badge |

## 📊 Visual Indicators

### Priority Badge
Shows current priority with color coding:
- **CRITICAL**: Red background, white text, **pulsing animation**
- **HIGH**: Red background, dark red text
- **MEDIUM**: Yellow background, dark yellow text
- **LOW**: Blue background, dark blue text

### Time Since Opened
Shows exact time since ticket creation:
```
Examples:
- "Opened 2 hours ago"
- "Opened 5 days ago"
- "Opened 45 days ago"
```

### Urgency Indicator
Dynamic emoji-based status:
- 🆕 **Recent** - 0-7 days (Green)
- 📅 **Open** - 8-14 days (Blue)
- ⏰ **Aging** - 15-21 days (Yellow)
- ⚠️ **Overdue** - 22-30 days (Orange)
- 🔥 **URGENT** - 31+ days (Red)

### Days Open Counter
Color-coded badge showing exact days:
```
Background Color Logic:
- Green:  0-7 days
- Yellow: 8-14 days
- Orange: 15-30 days
- Red:    31+ days
```

### Priority Score
Shows the calculated numeric score:
```
Example: "Priority Score: 127"
```

### Original Priority Indicator
If priority changed, shows original:
```
HIGH PRIORITY (was MEDIUM)
```

## 🚨 Escalation Alert

When a ticket reaches **CRITICAL** status (150+ points), a **red alert banner** appears at the top:

```
┌────────────────────────────────────────────────────────┐
│ 🚨 PRIORITY ESCALATION ALERT                           │
│                                                         │
│ This issue has been open for 55 days and has          │
│ auto-escalated to CRITICAL priority.                   │
│ Immediate action required!                             │
└────────────────────────────────────────────────────────┘
```

Features:
- ✅ Red gradient background
- ✅ Pulsing alert icon
- ✅ Shows exact days open
- ✅ Cannot be dismissed (forces attention)

## 📈 Example Calculations

### Example 1: API Integration Failure
```
Base Priority: HIGH (75 points)
Days Open: 55 days (+40 points)
Keywords: "failure" (+15), "sync" (0)
Category: Integration/Technical (×1.2)

Calculation: (75 + 40 + 15) × 1.2 = 156 points
Final Priority: CRITICAL 🔴
Status: 🔥 URGENT
```

### Example 2: Patient Record Issue
```
Base Priority: MEDIUM (50 points)
Days Open: 22 days (+30 points)
Keywords: "discrepancy" (+5), "patient" (0)
Category: Data Quality (×1.3)

Calculation: (50 + 30 + 5) × 1.3 = 110.5 points
Final Priority: HIGH 🟠
Status: ⚠️ Overdue
```

### Example 3: Recent Bug Report
```
Base Priority: LOW (25 points)
Days Open: 2 days (+0 points)
Keywords: "bug" (+5), "slow" (+5)
Category: General (×1.0)

Calculation: (25 + 0 + 5 + 5) × 1.0 = 35 points
Final Priority: LOW 🔵
Status: 🆕 Recent
```

## 🎨 What You'll See

### In the Issue Header:

```
┌─────────────────────────────────────────────────────┐
│ API Integration Failure                              │
│                                                      │
│ Patient data sync failing with external systems     │
│                                                      │
│ [CRITICAL PRIORITY] (was HIGH)                      │
│ [🕐 Opened 55 days ago]                             │
│ [🔥 URGENT]                                         │
│ [📅 55 days open]                                   │
│                                                      │
│ Source: System  Category: Integration               │
│ Priority Score: 156                                  │
└─────────────────────────────────────────────────────┘
```

## 🔄 Real-Time Updates

The priority system calculates **every time** you:
1. Open an issue
2. View the Issue Resolution Panel
3. Refresh the page

This means priorities are **always current** based on:
- Current date/time
- Time since issue creation
- Issue content and category

## 🎯 Benefits

### For Managers
✅ **Automatic Prioritization**: No manual priority updates needed
✅ **Clear Visibility**: Instantly see which issues need attention
✅ **Time Tracking**: Know exactly how long issues have been open
✅ **Escalation Alerts**: Critical items stand out immediately

### For Support Teams
✅ **Fair Workload**: Older tickets automatically get higher priority
✅ **No Forgotten Tickets**: Aging issues become more visible over time
✅ **Data-Driven**: Priority based on objective factors
✅ **Visual Clarity**: Color coding and emojis make scanning easy

### For Compliance
✅ **Audit Trail**: Priority score shows calculation methodology
✅ **Time Accountability**: Clear record of how long issues remain open
✅ **Objective System**: Removes human bias from prioritization
✅ **SLA Tracking**: Easy to spot tickets approaching/exceeding SLAs

## 🛠️ How to Use

1. **Open any issue** in the dashboard
2. **Look at the priority badge** - it now shows dynamic priority
3. **Check "Days Open"** - see how long it's been unresolved
4. **Watch for escalation alerts** - red banner means critical
5. **See priority score** - understand the calculation

## 📝 Configuration

The system uses these settings (can be customized):

```javascript
// Time thresholds (in days)
Recent:   0-7 days
Open:     8-14 days
Aging:    15-21 days
Overdue:  22-30 days
Urgent:   31+ days

// Priority score thresholds
Critical: 150+ points
High:     100-149 points
Medium:   60-99 points
Low:      0-59 points

// Category multipliers
Security:    1.6x
Compliance:  1.5x
Billing:     1.4x
Patient:     1.4x
Data:        1.3x
Technical:   1.2x
```

## 🚀 Testing

We've updated issue **tech-001** to be 55+ days old to demonstrate escalation:
- **Original Priority**: HIGH
- **Current Priority**: CRITICAL (auto-escalated)
- **Days Open**: 55 days
- **Status**: 🔥 URGENT with red alert banner

Open this issue to see the full escalation system in action!

## 💡 Pro Tips

1. **Check Daily**: Priority changes daily as tickets age
2. **Watch for Red**: Pulsing red badges = immediate action needed
3. **Use Filters**: Sort by priority score to find highest-priority items
4. **Track Trends**: Monitor how many tickets reach "Overdue" status
5. **Set Goals**: Aim to resolve all tickets before they hit 30 days

---

**Ready to see it in action?**
1. Start the dashboard: `npm run dev`
2. Navigate to Issues section
3. Click on "API Integration Failure"
4. See the dynamic priority system!

🎊 Enjoy your intelligent, auto-escalating priority system!

