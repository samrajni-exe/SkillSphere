import { useEffect, useState } from "react";
import { assessmentAPI } from "../../services/api";

export default function SkillAssessment({ userId }) {
    const [questions, setQuestions] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [answers, setAnswers] = useState({});
    const [current, setCurrent] = useState(0);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadQuestions() {
            try {
                const data = await assessmentAPI.getQuestions();

                const questionList = data.questions || [];
                setQuestions(questionList);

                const uniqueSkills = [
                    ...new Set(questionList.map(q => q.skill))
                ];

                setSkills(uniqueSkills);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadQuestions();
    }, []);

    const filteredQuestions = selectedSkill
        ? questions.filter(q => q.skill === selectedSkill)
        : questions;

    const question = filteredQuestions[current];

    function selectAnswer(option) {
        setAnswers(prev => ({
            ...prev,
            [question.id]: option
        }));
    }

    async function submitAssessment() {
        if (!userId) {
            setError("User ID is missing. Please connect your login system.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formattedAnswers = filteredQuestions.map(q => ({
                question_id: q.id,
                selected_option: answers[q.id]
            }));

            const data = await assessmentAPI.submit({
                user_id: Number(userId),
                answers: formattedAnswers
            });

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const styles = {
        page: {
            minHeight: "100vh",
            background: "#F8F7F2",
            padding: "40px 20px",
            color: "#473C33",
            fontFamily: "Arial, sans-serif"
        },
        card: {
            maxWidth: "750px",
            margin: "auto",
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(71,60,51,0.08)"
        },
        button: {
            background: "#ABC270",
            color: "#473C33",
            border: "none",
            padding: "12px 22px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
        },
        option: {
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "15px",
            margin: "12px 0",
            borderRadius: "9px",
            cursor: "pointer",
            fontSize: "15px"
        }
    };

    if (loading) {
        return <div style={styles.page}>Loading assessment...</div>;
    }

    if (error && questions.length === 0) {
        return <div style={styles.page}>Error: {error}</div>;
    }

    if (result) {
        return (
            <div style={styles.page}>
                <div style={styles.card}>
                    <h1>Assessment Completed!</h1>
                    <h2>Your Score: {result.score}%</h2>
                    <p>
                        Correct answers: {result.correct_answers} / {result.total_questions}
                    </p>
                    <button
                        style={styles.button}
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1>Skill Assessment</h1>
                <p>Discover your strengths and improve your skills.</p>

                <label>Select Skill</label>
                <select
                    value={selectedSkill}
                    onChange={e => {
                        setSelectedSkill(e.target.value);
                        setCurrent(0);
                        setAnswers({});
                        setError("");
                    }}
                    style={{ padding: "12px", margin: "12px 0 25px", width: "100%" }}
                >
                    <option value="">All Skills</option>
                    {skills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>

                {filteredQuestions.length === 0 ? (
                    <p>No questions available for this skill.</p>
                ) : (
                    <>
                        <p>
                            Question {current + 1} of {filteredQuestions.length}
                        </p>

                        <div style={{
                            height: "8px",
                            background: "#eee",
                            borderRadius: "10px",
                            marginBottom: "25px"
                        }}>
                            <div style={{
                                height: "8px",
                                width: `${((current + 1) / filteredQuestions.length) * 100}%`,
                                background: "#ABC270",
                                borderRadius: "10px"
                            }} />
                        </div>

                        <h3>{question.question}</h3>

                        {["a", "b", "c", "d"].map(option => {
                            const key = `option_${option}`;
                            const isSelected = answers[question.id] === option.toUpperCase();

                            return (
                                <button
                                    key={option}
                                    style={{
                                        ...styles.option,
                                        background: isSelected ? "#FEC868" : "#F8F7F2",
                                        border: isSelected
                                            ? "2px solid #473C33"
                                            : "1px solid #ddd"
                                    }}
                                    onClick={() => selectAnswer(option.toUpperCase())}
                                >
                                    {option.toUpperCase()}. {question[key]}
                                </button>
                            );
                        })}

                        {error && <p style={{ color: "red" }}>{error}</p>}

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

                            {current < filteredQuestions.length - 1 ? (
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
                                    disabled={Object.keys(answers).filter(id =>
                                        filteredQuestions.some(q => String(q.id) === id)
                                    ).length !== filteredQuestions.length}
                                    onClick={submitAssessment}
                                >
                                    Submit Assessment
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}