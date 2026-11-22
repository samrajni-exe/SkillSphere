import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

function AdminDashboard() {
    const [overview, setOverview] = useState({});
    const [students, setStudents] = useState([]);
    const [reports, setReports] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const [overviewData, studentsData, reportsData] =
                await Promise.all([
                    adminAPI.getOverview(),
                    adminAPI.getStudents(),
                    adminAPI.getReports()
                ]);

            setOverview(overviewData.overview || overviewData);
            setStudents(studentsData.students || []);
            setReports(reportsData.reports || reportsData);
        } catch (err) {
            setError("Unable to load dashboard. Check whether the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        background: "#FFFFFF",
        padding: "22px",
        borderRadius: "14px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.06)"
    };

    const stats = [
        {
            title: "Total Students",
            value: overview.total_students ?? 0,
            color: "#ABC270"
        },
        {
            title: "Assessments",
            value: overview.total_assessments ?? 0,
            color: "#FEC868"
        },
        {
            title: "Practice Attempts",
            value: overview.total_practice_attempts ?? 0,
            color: "#FDA769"
        },
        {
            title: "Project Submissions",
            value: overview.total_projects ?? 0,
            color: "#ABC270"
        },
        {
            title: "Pending Projects",
            value: overview.pending_projects ?? 0,
            color: "#FEC868"
        },
        {
            title: "Certificates",
            value: overview.total_certificates ?? 0,
            color: "#FDA769"
        }
    ];

    if (loading) {
        return <p style={{ padding: "30px" }}>Loading admin dashboard...</p>;
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#F8F7F2",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            color: "#473C33"
        }}>

            {/* Sidebar */}
            <aside style={{
                width: "220px",
                background: "#473C33",
                color: "white",
                padding: "30px 20px"
            }}>
                <h2 style={{ color: "#ABC270" }}>SkillSphere</h2>
                <p style={{ color: "#FEC868", marginBottom: "40px" }}>
                    Admin Panel
                </p>

                {["Dashboard", "Students", "Reports"].map((item) => (
                    <div key={item} style={{
                        padding: "13px",
                        marginBottom: "12px",
                        borderRadius: "8px",
                        background: item === "Dashboard"
                            ? "#ABC270"
                            : "transparent",
                        color: item === "Dashboard"
                            ? "#473C33"
                            : "white"
                    }}>
                        {item}
                    </div>
                ))}
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: "35px",
                overflowX: "auto"
            }}>

                <h1 style={{ marginBottom: "8px" }}>
                    Admin Dashboard
                </h1>

                <p style={{ color: "#777", marginBottom: "30px" }}>
                    Monitor students, learning activities and performance.
                </p>

                {error && (
                    <p style={{ color: "red", marginBottom: "20px" }}>
                        {error}
                    </p>
                )}

                {/* Statistics */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "18px",
                    marginBottom: "35px"
                }}>
                    {stats.map((stat) => (
                        <div key={stat.title} style={cardStyle}>
                            <div style={{
                                width: "42px",
                                height: "6px",
                                background: stat.color,
                                borderRadius: "5px",
                                marginBottom: "15px"
                            }} />

                            <p style={{ color: "#777", margin: "0 0 10px" }}>
                                {stat.title}
                            </p>

                            <h2 style={{ margin: 0, fontSize: "28px" }}>
                                {stat.value}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* Students Table */}
                <section style={{ ...cardStyle, marginBottom: "30px" }}>
                    <h2>Student Management</h2>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "20px",
                            minWidth: "550px"
                        }}>
                            <thead>
                                <tr style={{ background: "#F8F7F2" }}>
                                    {[
                                        "Student ID",
                                        "Assessments",
                                        "Practice Attempts",
                                        "Projects"
                                    ].map((heading) => (
                                        <th key={heading} style={{
                                            padding: "14px",
                                            textAlign: "left"
                                        }}>
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {students.length > 0 ? students.map((student) => (
                                    <tr key={student.user_id}>
                                        <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                                            {student.user_id}
                                        </td>
                                        <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                                            {student.total_assessments ?? 0}
                                        </td>
                                        <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                                            {student.practice_attempts ?? 0}
                                        </td>
                                        <td style={{ padding: "14px", borderBottom: "1px solid #eee" }}>
                                            {student.total_projects ?? 0}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" style={{ padding: "20px" }}>
                                            No student records available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Reports */}
                <section style={cardStyle}>
                    <h2>Performance Reports</h2>

                    <pre style={{
                        background: "#F8F7F2",
                        padding: "18px",
                        borderRadius: "10px",
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        fontSize: "13px"
                    }}>
                        {JSON.stringify(reports, null, 2)}
                    </pre>
                </section>

            </main>
        </div>
    );
}

export default AdminDashboard;