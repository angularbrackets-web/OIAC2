/**
 * Fundraiser Configuration
 * Central location for all fundraiser-related numbers and settings
 * Update these values as needed - they will automatically reflect across the entire site
 */

export const FUNDRAISER_CONFIG = {
    // Amounts
    amountRaised: 2.8, // in millions
    amountRaisedFromDinner: 2.8, // in millions
    totalRaised: 9, // in millions (total so far including previous amounts)
    totalGoal: null, // in millions - SET TO null TO HIDE (temporarily hidden pending confirmation)

    // Dates
    launchDate: "September 2026",

    // Students
    studentsEnrolled: 300,

    // Calculated values
    get progressPercentage() {
        if (this.totalGoal === null) return null;
        return Math.round((this.totalRaised / this.totalGoal) * 100);
    },

    get progressText() {
        if (this.totalGoal === null) {
            return `$${this.totalRaised}M raised so far, Alhamdulillah`;
        }
        return `$${this.totalRaised}M of $${this.totalGoal}M goal`;
    },

    // Motivational Messaging (used when goal is hidden)
    motivationalMessages: {
        // Hero banner - Inspirational & community-focused
        hero: "Together, we're building a future for our children",

        // Stats section - Factual & encouraging
        stats: "Every donation brings us closer to our vision",

        // CTA section - Action-oriented
        cta: "Your support makes the difference",

        // Bottom/Footer - Progress acknowledgment
        progress: "Help us complete this legacy for generations to come",
    },

    // Display settings
    showTotalGoal: false, // Set to false to hide total goal across the site
};

/**
 * Helper function to format amount display
 */
export function formatAmount(amount: number): string {
    return `$${amount}M`;
}

/**
 * Helper function to check if we should show total goal
 */
export function shouldShowTotalGoal(): boolean {
    return FUNDRAISER_CONFIG.showTotalGoal && FUNDRAISER_CONFIG.totalGoal !== null;
}
