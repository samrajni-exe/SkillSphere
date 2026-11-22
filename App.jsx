import { useState } from "react";

import SkillAssessment from "./pages/SkillAssessment";
import AssessmentResults from "./pages/AssessmentResults";
import LearningRoadmap from "./pages/LearningRoadmap";
import PracticeZone from "./pages/PracticeZone";
import ProjectSubmission from "./pages/ProjectSubmission";
import Achievements from "./pages/Achievements";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const [activePage, setActivePage] = useState("assessment");

    const userId = 1;

    const pages = {
        assessment: <SkillAssessment userId={userId} />,
        results: <AssessmentResults userId={userId} />,
        roadmap: <LearningRoadmap userId={userId} />,
        practice: <PracticeZone userId={userId} />,
        projects: <ProjectSubmission userId={userId} />,
        achievements: <Achievements userId={userId} />,
        admin: <AdminDashboard />
    };

    return (
        <div>
            <nav style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "15px",
                background: "#473C33"
            }}>
                {[
                    ["assessment", "Assessment"],
                    ["results", "Results"],
                    ["roadmap", "Roadmap"],
                    ["practice", "Practice"],
                    ["projects", "Projects"],
                    ["achievements", "Achievements"],
                    ["admin", "Admin"]
                ].map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActivePage(key)}
                        style={{
                            padding: "10px 15px",
                            border: "none",
                            borderRadius: "7px",
                            cursor: "pointer",
                            background: activePage === key
                                ? "#ABC270"
                                : "#FFFFFF",
                            color: "#473C33"
                        }}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {pages[activePage]}
        </div>
    );
}

export default App;