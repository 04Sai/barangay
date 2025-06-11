/**
 * Common form styles for consistent styling across admin components
 */
export const dropdownStyles = {
    // For the select element
    select: "w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",

    // For option elements (these are harder to style with CSS, 
    // but we can use this for reference in inline styles)
    option: {
        backgroundColor: "#1e3a8a", // dark blue background
        color: "white",             // white text
        padding: "8px 12px"         // some padding
    }
};
