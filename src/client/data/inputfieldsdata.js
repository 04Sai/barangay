
// Gender options
export const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
];

// Civil status options
export const civilStatusOptions = [
    { value: "", label: "Select Status" },
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" }
];

// Month options for birthday
export const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
];

// Function to check if a year is a leap year
export const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

// Function to get number of days in a month
export const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    const daysInMonth = {
        "01": 31,
        "02": isLeapYear(parseInt(year)) ? 29 : 28,
        "03": 31,
        "04": 30,
        "05": 31,
        "06": 30,
        "07": 31,
        "08": 31,
        "09": 30,
        "10": 31,
        "11": 30,
        "12": 31,
    };
    return daysInMonth[month] || 31;
};

// Generate years array (from current year to 100 years ago)
export const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => ({
        value: String(currentYear - i),
        label: String(currentYear - i),
    }));
};

// Generate days array based on month and year
export const generateDays = (month, year) => {
    const maxDays = getDaysInMonth(month, year);
    return Array.from({ length: maxDays }, (_, i) => ({
        value: String(i + 1).padStart(2, "0"),
        label: String(i + 1),
    }));
};