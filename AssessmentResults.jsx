import { useEffect, useState } from "react";
import {
    assessmentAPI,
    recommendationsAPI
} from "../services/api";

export default function AssessmentResults({ userId }) {
    const [results, setResults] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [resultData, recommendationData] =
                    await Promise.all([
                        assessmentAPI.getResults(userId),
                        recommendationsAPI.get(userId)
                    ]);

                const resultList =
                    resultData.results || resultData.assessments || [];

                setResults(
                    Array.isArray(resultList)
                        ? resultList[0] || null
                        : resultList
                );

                setRecommendations(
                    recommendationData.recommendations || []
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            loadData();
        } else {
            setError("User ID is missing.");
            setLoading(false);
        }
    }, [userId]);

    const styles = {
        page: {
            minHeight: "100vh",
            background: "#F8F7F2",
            padding: "40px 20px",
            color: "#473C33",
            fontFamily: "Arial, sans-serif"
        },
        container: {
            maxWidth: "900px",
            margin: "auto"
        },
        card: {
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(71,60,51,0.07)"
        },
        badge: {
            background: "#FEC868",
            padding: "8px 15px",
            borderRadius: "20px",
            display: "inline-block",
            fontWeight: "bold"
        }
    };

    if (loading) {
        return <div style={styles.page}>Loading results...</div>;
    }

    if (error) {
        return (
            <div style={styles.page}>
                <h2>Unable to load results</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!results) {
        return (
            <div style={styles.page}>
                <h2>No assessment results yet.</h2>
                <p>Complete a skill assessment to view your performance.</p>
            </div>
        );
    }

    const score = Number(results.score ?? results.score_percent ?? 0);
    const correct = results.correct_answers ?? 0;
    const total = results.total_questions ?? 0;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1>Assessment Results</h1>
                <p>Track your performance and discover skills to improve.</p>

                <div style={styles.card}>
                    <h2>Your Overall Score</h2>
                    <h1 style={{ fontSize: "48px", color: "#473C33" }}>
                        {score}%
                    </h1>

                    <div style={{
                        height: "12px",
                        background: "#eee",
                        borderRadius: "10px"
                    }}>
                        <div style={{
                            height: "12px",
                            width: `${Math.min(100, Math.max(0, score))}%`,
                            background: "#ABC270",
                            borderRadius: "10px"
                        }} />
                    </div>

                    <p>
                        Correct Answers: {correct} / {total}
                    </p>

                    <span style={styles.badge}>
                        {score >= 80
                            ? "Excellent Performance"
                            : score >= 60
                                ? "Good Performance"
                                : score >= 40
                                    ? "Keep Practicing"
                                    : "Room for Improvement"}
                    </span>
                </div>

                <div style={styles.card}>
                    <h2>Skill Recommendations</h2>

                    {recommendations.length === 0 ? (
                        <p>No recommendations available yet.</p>
                    ) : (
                        recommendations.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    background: "#FDA769",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    marginBottom: "12px"
                                }}
                            >
                                <h3>{item.skill}</h3>
                                <p>
                                    Assessment Score: {item.skill_score}%
                                </p>
                                <p>{item.reason}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}