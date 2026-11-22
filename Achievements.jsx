import { useEffect, useState } from "react";
import { achievementsAPI } from "../services/api";

export default function Achievements({ userId }) {
    const [badges, setBadges] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAchievements() {
            try {
                const data = await achievementsAPI.get(userId);

                setBadges(data.badges || []);
                setCertificates(data.certificates || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            loadAchievements();
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
            padding: "22px",
            borderRadius: "15px",
            marginBottom: "18px",
            boxShadow: "0 4px 15px rgba(71,60,51,0.07)"
        }
    };

    if (loading) {
        return <div style={styles.page}>Loading achievements...</div>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1>Achievements & Certificates</h1>
                <p>Celebrate your learning milestones and accomplishments.</p>

                {error && (
                    <p style={{ color: "red" }}>{error}</p>
                )}

                <div style={styles.card}>
                    <h2>My Badges 🏅</h2>

                    <h3>{badges.length} Badges Earned</h3>

                    {badges.length === 0 ? (
                        <p>No badges earned yet. Keep learning!</p>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "15px"
                        }}>
                            {badges.map(badge => (
                                <div
                                    key={badge.id}
                                    style={{
                                        background: "#FEC868",
                                        padding: "20px",
                                        borderRadius: "12px"
                                    }}
                                >
                                    <h3>🏆 {badge.badge_name}</h3>
                                    <p>{badge.description}</p>
                                    <small>
                                        Awarded: {badge.awarded_at}
                                    </small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={styles.card}>
                    <h2>My Certificates 🎓</h2>

                    <h3>
                        {certificates.length} Certificates Earned
                    </h3>

                    {certificates.length === 0 ? (
                        <p>No certificates issued yet.</p>
                    ) : (
                        certificates.map(certificate => (
                            <div
                                key={certificate.id}
                                style={{
                                    background: "#FDA769",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    marginBottom: "15px"
                                }}
                            >
                                <h3>{certificate.course_name}</h3>

                                <p>
                                    Certificate Code:{" "}
                                    <strong>
                                        {certificate.certificate_code}
                                    </strong>
                                </p>

                                <p>
                                    Issued: {certificate.issued_at}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}