import { useEffect, useState } from "react";
import { practiceAPI } from "../../services/api";

export default function PracticeZone({ userId }) {
    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [answers, setAnswers] = useState({});
    const [current, setCurrent] = useState(0);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadQuestions();
    }, []);

    async function loadQuestions(topic = "") {
        try {
            setLoading(true);
            setError("");

            const data = await practiceAPI.getQuestions(topic);
            const list = data.questions || [];

            setQuestions(list);

            setTopics([
                ...new Set(list.map(q => q.topic).filter(Boolean))
            ]);

            setAnswers({});
            setCurrent(0);
            setResult(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadHistory() {
        try {
            const data = await practiceAPI.getHistory(userId);
            setHistory(data.history || data.attempts || []);
            setShowHistory(true);
        } catch (err) {
            setError(err.message);
        }
    }

    async function submitPractice() {
        if (!userId) {
            setError("User ID is missing.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formattedAnswers = questions.map(q => ({
                question_id: q.id,
                selected_option: answers[q.id]
            }));

            const data = await practiceAPI.submit({
                user_id: Number(userId),
                topic: selectedTopic || null,
                answers: formattedAnswers
            });

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const question = questions[current];

    const completed = Object.keys(answers).length;
    const progress = questions.length
        ? (completed / questions.length) * 100
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
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(71,60,51,0.07)"
        },
        button: {
            background: "#ABC270",
            color: "#473C33",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
        },
        option: {
            display: "block",
            width: "100%",
            padding: "15px",
            margin: "12px 0",
            textAlign: "left",
            borderRadius: "9px",
            cursor: "pointer",
            fontSize: "15px"
        }
    };

    if (loading) {
        return <div style={styles.page}>Loading Practice Zone...</div>;
    }

    if (result) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.card}>
                        <h1>Practice Completed!</h1>

                        <h2>
                            Score: {result.score}%
                        </h2>

                        <p>
                            Correct Answers: {result.correct_answers} /
                            {" "}{result.total_questions}
                        </p>

                        <button
                            style={styles.button}
                            onClick={() => {
                                setResult(null);
                                setAnswers({});
                                setCurrent(0);
                            }}
                        >
                            Practice Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error && questions.length === 0) {
        return (
            <div style={styles.page}>
                <h2>Unable to load Practice Zone</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <h1>Practice Zone</h1>
                <p>Practice regularly and improve your skills.</p>

                <div style={styles.card}>
                    <button
                        style={styles.button}
                        onClick={loadHistory}
                    >
                        View Practice History
                    </button>

                    {showHistory && (
                        <div>
                            <h2>Practice History</h2>

                            {history.length === 0 ? (
                                <p>No previous attempts found.</p>
                            ) : (
                                history.map(item => (
                                    <div key={item.id}>
                                        <p>
                                            Topic: {item.topic || "General"}
                                        </p>
                                        <p>
                                            Score: {item.score}%
                                        </p>
                                        <p>
                                            Date: {item.attempted_at}
                                        </p>
                                        <hr />
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div style={styles.card}>
                    <h3>Select Practice Topic</h3>

                    <select
                        value={selectedTopic}
                        onChange={e => {
                            const topic = e.target.value;
                            setSelectedTopic(topic);
                            loadQuestions(topic);
                        }}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px"
                        }}
                    >
                        <option value="">All Topics</option>

                        {topics.map(topic => (
                            <option key={topic} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {questions.length === 0 ? (
                    <div style={styles.card}>
                        <h3>No practice questions available.</h3>
                    </div>
                ) : (
                    <div style={styles.card}>
                        <p>
                            Question {current + 1} of {questions.length}
                        </p>

                        <div style={{
                            height: "9px",
                            background: "#eee",
                            borderRadius: "10px"
                        }}>
                            <div style={{
                                height: "9px",
                                width: `${progress}%`,
                                background: "#FEC868",
                                borderRadius: "10px"
                            }} />
                        </div>

                        <h3 style={{ marginTop: "25px" }}>
                            {question.question}
                        </h3>

                        {["a", "b", "c", "d"].map(option => {
                            const key = `option_${option}`;
                            const selected =
                                answers[question.id] === option.toUpperCase();

                            return (
                                <button
                                    key={option}
                                    style={{
                                        ...styles.option,
                                        background: selected
                                            ? "#FEC868"
                                            : "#F8F7F2",
                                        border: selected
                                            ? "2px solid #473C33"
                                            : "1px solid #ddd"
                                    }}
                                    onClick={() =>
                                        setAnswers(prev => ({
                                            ...prev,
                                            [question.id]: option.toUpperCase()
                                        }))
                                    }
                                >
                                    {option.toUpperCase()}. {question[key]}
                                </button>
                            );
                        })}

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "25px"
                        }}>
                            <button
                                style={styles.button}
                                disabled={current === 0}
                                onClick={() => setCurrent(current - 1)}
                            >
                                Previous
                            </button>

                            {current < questions.length - 1 ? (
                                <button
                                    style={styles.button}
                                    disabled={!answers[question.id]}
                                    onClick={() => setCurrent(current + 1)}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    style={styles.button}
                                    disabled={completed !== questions.length}
                                    onClick={submitPractice}
                                >
                                    Submit Practice
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}