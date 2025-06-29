/**
 * Common form styles for consistent styling across admin components
 */
export const dropdownStyles = {
    // For the select element
    select: "w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",

    // For option elements
    option: {
        backgroundColor: "#1e3a8a", // dark blue background
        color: "white",             // white text
        padding: "8px 12px"         // some padding
    }
};

/**
 * Common container styles for admin sections
 */
export const containerStyles = {
    // Main container for admin sections
    mainContainer: "backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 min-h-[600px]",

    // For inner content areas
    contentContainer: "min-h-[600px]",

    // For sub-sections within main content areas
    cardContainer: "backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-4 min-h-[300px]",

    // For the dashboard stat cards
    statCard: "backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-5 min-h-[120px]"
};
