const API_BASE_URL = "https://skillsphere-api-2026.onrender.com/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
    }

    return data;
}

export const assessmentAPI = {
    getQuestions: (skill) =>
        apiRequest(`/assessment/questions${skill ? `?skill=${encodeURIComponent(skill)}` : ""}`),

    submit: (payload) =>
        apiRequest("/assessment/submit", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    getResults: (userId) =>
        apiRequest(`/assessment/results/${userId}`)
};

export const recommendationsAPI = {
    get: (userId) =>
        apiRequest(`/recommendations/${userId}`)
};

export const roadmapAPI = {
    get: (userId) =>
        apiRequest(`/roadmap/${userId}`),

    add: (payload) =>
        apiRequest("/roadmap", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    complete: (itemId) =>
        apiRequest(`/roadmap/${itemId}`, {
            method: "PATCH",
            body: JSON.stringify({ completed: true })
        })
};

export const practiceAPI = {
    getQuestions: (topic) =>
        apiRequest(`/practice/questions${topic ? `?topic=${encodeURIComponent(topic)}` : ""}`),

    submit: (payload) =>
        apiRequest("/practice/submit", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    getHistory: (userId) =>
        apiRequest(`/practice/history/${userId}`)
};

export const projectsAPI = {
    submit: (payload) =>
        apiRequest("/projects", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    get: (userId) =>
        apiRequest(`/projects/${userId}`)
};

export const achievementsAPI = {
    get: (userId) =>
        apiRequest(`/achievements/${userId}`),

    addBadge: (payload) =>
        apiRequest("/achievements/badges", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    addCertificate: (payload) =>
        apiRequest("/achievements/certificates", {
            method: "POST",
            body: JSON.stringify(payload)
        })
};

export const adminAPI = {
    getOverview: () =>
        apiRequest("/admin/overview"),

    getStudents: () =>
        apiRequest("/admin/students"),

    getReports: () =>
        apiRequest("/admin/reports")
};