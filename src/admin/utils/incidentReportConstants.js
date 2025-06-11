export const incidentTypes = [
    "Accident",
    "Crime",
    "Fire",
    "Medical Emergency",
    "Natural Disaster",
    "Public Disturbance",
    "Infrastructure Issue",
    "Environmental Hazard",
    "Traffic Incident",
    "Domestic Violence",
    "Theft/Robbery",
    "Vandalism",
    "Noise Complaint",
    "Animal Related",
    "Drug Related",
    "Other",
];

export const statuses = [
    "Pending",
    "Under Investigation",
    "In Progress",
    "Resolved",
    "Closed",
    "Rejected",
];

export const severities = ["Low", "Medium", "High", "Critical"];

export const priorities = ["Low", "Normal", "High", "Urgent"];

export const departments = [
    "Barangay Security",
    "Police",
    "Fire Department",
    "Medical Services",
    "Public Works",
    "Environmental Office",
    "Social Services",
    "Traffic Management",
    "Other",
];

export const relationships = [
    "Victim",
    "Witness",
    "Concerned Citizen",
    "Official",
    "Anonymous",
];

export const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
};

export const getStatusColor = (status) => {
    switch (status) {
        case "Pending":
            return "bg-yellow-500";
        case "Under Investigation":
            return "bg-blue-500";
        case "In Progress":
            return "bg-purple-500";
        case "Resolved":
            return "bg-green-500";
        case "Closed":
            return "bg-gray-500";
        case "Rejected":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

export const getSeverityColor = (severity) => {
    switch (severity) {
        case "Low":
            return "bg-green-500";
        case "Medium":
            return "bg-yellow-500";
        case "High":
            return "bg-orange-500";
        case "Critical":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

export const getPriorityColor = (priority) => {
    switch (priority) {
        case "Urgent":
            return "bg-red-500";
        case "High":
            return "bg-orange-500";
        case "Normal":
            return "bg-blue-500";
        case "Low":
            return "bg-gray-500";
        default:
            return "bg-gray-500";
    }
};
