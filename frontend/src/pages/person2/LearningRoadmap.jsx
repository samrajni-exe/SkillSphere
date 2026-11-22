import { useEffect, useState } from "react";
import { roadmapAPI } from "../../services/api";

export default function LearningRoadmap({ userId }) {
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRoadmap() {
            try {
                const data = await roadmapAPI.get(userId);
                setRoadmap(data.roadmap || data.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            loadRoadmap();
        } else {
            setError("User ID is missing.");
            setLoading(false);
        }
    }, [userId]);

    async function toggleComplete(item) {
        if (item.completed) return;

        try {
            await roadmapAPI.complete(item.id);

            setRoadmap(prev =>
                prev.map(task =>
                    task.id === item.id
                        ? { ...task, completed: 1 }
                        : task
                )
            );
        } catch (err) {
            setError(err.message);
        }
    }

    const completed = roadmap.filter(
        item => Number(item.completed) === 1
    ).length;

    const progress = roadmap.length
        ? Math.round((completed / roadmap.length) * 100)
        : 0;

    const styles = {
        page: {
            minHeight: "100vh",
            background: "#F8F7F2",
            padding: "40px 20px",
            color: "#473C33",
            fontFamily: "Arial, sans-serif"
        },
        container: {
            maxWidth: "850px",
            margin: "auto"
        },
        card: {
            background: "white",
            padding: "22px",
            borderRadius: "14px",
            marginBottom: "18px",
            boxShadow: "0 4px 15px rgba(71,60,51,0.07)"
        },
        button: {
            background: "#ABC270",
            color: "#473C33",
            border: "none",
            padding: "11px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
        }
    };

    if (loading) {
        return <div style={styles.page}>Loading roadmap...</div>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1>My Learning Roadmap</h1>
                <p>Follow your learning journey one step at a time.</p>

                <div style={styles.card}>
                    <h2>Overall Progress</h2>

                    <h1>{progress}%</h1>

                    <div style={{
                        height: "12px",
                        background: "#eee",
                        borderRadius: "10px"
                    }}>
                        <div style={{
                            height: "12px",
                            width: `${progress}%`,
                            background: "#FEC868",
                            borderRadius: "10px"
                        }} />
                    </div>

                    <p>
                        {completed} of {roadmap.length} tasks completed
                    </p>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {roadmap.length === 0 ? (
                    <div style={styles.card}>
                        <h3>Your roadmap is empty.</h3>
                        <p>Your learning tasks will appear here.</p>
                    </div>
                ) : (
                    roadmap.map((item, index) => (
                        <div key={item.id} style={{
                            ...styles.card,
                            borderLeft: `6px solid ${
                                Number(item.completed) === 1
                                    ? "#ABC270"
                                    : "#FDA769"
                            }`
                        }}>
                            <h3>
                                {index + 1}. {item.title}
                            </h3>

                            <p>{item.description}</p>

                            <p>
                                Status: {
                                    Number(item.completed) === 1
                                        ? "Completed"
                                        : "Pending"
                                }
                            </p>

                            {Number(item.completed) !== 1 && (
                                <button
                                    style={styles.button}
                                    onClick={() => toggleComplete(item)}
                                >
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}