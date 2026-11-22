import { useEffect, useState } from "react";
import { projectsAPI } from "../services/api";

export default function ProjectSubmission({ userId }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        project_url: ""
    });

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadProjects() {
        try {
            const data = await projectsAPI.get(userId);
            setProjects(data.projects || []);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        if (userId) loadProjects();
    }, [userId]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!userId) {
            setError("User ID is missing.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            await projectsAPI.submit({
                user_id: Number(userId),
                ...form
            });

            setMessage("Project submitted successfully!");

            setForm({
                title: "",
                description: "",
                project_url: ""
            });

            await loadProjects();

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
        input: {
            width: "100%",
            padding: "12px",
            margin: "10px 0 18px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxSizing: "border-box"
        },
        button: {
            background: "#ABC270",
            color: "#473C33",
            border: "none",
            padding: "12px 22px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1>Project Submission</h1>
                <p>Showcase your skills through practical projects.</p>

                <div style={styles.card}>
                    <h2>Submit Your Project</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Project Title</label>
                        <input
                            style={styles.input}
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter project title"
                            required
                        />

                        <label>Description</label>
                        <textarea
                            style={styles.input}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe your project"
                            rows="4"
                        />

                        <label>Project URL</label>
                        <input
                            style={styles.input}
                            type="url"
                            name="project_url"
                            value={form.project_url}
                            onChange={handleChange}
                            placeholder="https://github.com/..."
                        />

                        <button
                            style={styles.button}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Project"}
                        </button>
                    </form>

                    {message && (
                        <p style={{ color: "green" }}>{message}</p>
                    )}

                    {error && (
                        <p style={{ color: "red" }}>{error}</p>
                    )}
                </div>

                <div style={styles.card}>
                    <h2>My Submissions</h2>

                    {projects.length === 0 ? (
                        <p>No projects submitted yet.</p>
                    ) : (
                        projects.map(project => (
                            <div
                                key={project.id}
                                style={{
                                    background: "#FEC868",
                                    padding: "18px",
                                    borderRadius: "10px",
                                    marginBottom: "15px"
                                }}
                            >
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>

                                {project.project_url && (
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Project
                                    </a>
                                )}

                                <p>
                                    Status: {project.status}
                                </p>

                                <small>
                                    Submitted: {project.submitted_at}
                                </small>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}