# Fundraiser Configuration Guide

## Overview
All fundraiser-related numbers and settings are centralized in `fundraiser.ts`. This allows you to update values in one place and have them automatically reflect across the entire website.

## Location
`src/config/fundraiser.ts`

## How to Update Values

### To Update Any Numbers:
Open `src/config/fundraiser.ts` and modify the values in `FUNDRAISER_CONFIG`:

```typescript
export const FUNDRAISER_CONFIG = {
    amountRaised: 2.8,              // Amount raised from recent dinner (in millions)
    amountRaisedFromDinner: 2.8,    // Same as above
    totalRaised: 9,                  // Total raised so far (in millions)
    totalGoal: 29,                   // Total goal (in millions)
    launchDate: "September 2026",    // Expected launch date
    studentsEnrolled: 300,           // Number of students enrolled
    showTotalGoal: true,             // Set to false to hide goal across site
};
```

### To Hide the Total Goal Temporarily

**Option 1: Set `showTotalGoal` to `false`**
```typescript
showTotalGoal: false,  // This will hide the total goal everywhere
```

**Option 2: Set `totalGoal` to `null`**
```typescript
totalGoal: null,  // This will also hide the total goal
```

When the goal is hidden, the site will automatically:
- Show "Total Raised So Far" instead of "Total Goal"
- Hide progress percentages
- Display alternative messaging

### Example: Hiding $29M Goal

```typescript
export const FUNDRAISER_CONFIG = {
    amountRaised: 2.8,
    amountRaisedFromDinner: 2.8,
    totalRaised: 9,
    totalGoal: null,  // ← Set to null or update when correct figure is confirmed
    launchDate: "September 2026",
    studentsEnrolled: 300,
    showTotalGoal: false,  // ← Also set to false
};
```

## Where These Values Appear

The configuration is used in:
1. **FundraiserSuccess.astro** - Hero banner with amount raised and progress
2. **ImpactStats.astro** - Statistics counter section
3. **DualCTA.astro** - Donation call-to-action card
4. **CommunityMessage.astro** - Community message block

## Calculated Values

The configuration automatically calculates:
- **Progress Percentage**: `(totalRaised / totalGoal) * 100`
- **Progress Text**: Dynamic text based on whether goal is shown

## Important Notes

- All amounts are in **millions** (e.g., `2.8` = $2.8M)
- After updating values, the site needs to be rebuilt and redeployed
- No code changes are needed - just update the config file
- The same values will be used consistently across all pages

## Quick Reference

| Field | Current Value | Description |
|-------|---------------|-------------|
| `amountRaised` | 2.8M | From recent dinner |
| `totalRaised` | 9M | Total raised so far |
| `totalGoal` | 29M | Overall goal |
| `studentsEnrolled` | 300+ | Students across programs |
| `launchDate` | Sep 2026 | Target launch |
| `showTotalGoal` | true/false | Control visibility |
