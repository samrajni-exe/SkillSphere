from flask import Blueprint, jsonify
from app.person2_db import get_db

admin_bp = Blueprint("admin", __name__)


# Admin dashboard overview
@admin_bp.get("/overview")
def admin_overview():
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        queries = {
            "total_students": """
                SELECT COUNT(DISTINCT user_id) AS total
                FROM (
                    SELECT user_id FROM assessment_results
                    UNION
                    SELECT user_id FROM practice_attempts
                    UNION
                    SELECT user_id FROM project_submissions
                    UNION
                    SELECT user_id FROM student_badges
                    UNION
                    SELECT user_id FROM certificates
                    UNION
                    SELECT user_id FROM student_skills
                ) AS students
            """,
            "total_assessments": """
                SELECT COUNT(*) AS total FROM assessment_results
            """,
            "total_practice_attempts": """
                SELECT COUNT(*) AS total FROM practice_attempts
            """,
            "total_projects": """
                SELECT COUNT(*) AS total FROM project_submissions
            """,
            "pending_projects": """
                SELECT COUNT(*) AS total
                FROM project_submissions
                WHERE status = 'Pending'
            """,
            "total_certificates": """
                SELECT COUNT(*) AS total FROM certificates
            """
        }

        result = {}

        for key, query in queries.items():
            cur.execute(query)
            result[key] = cur.fetchone()["total"]

        return jsonify({
            "success": True,
            "overview": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# Student management list
@admin_bp.get("/students")
def get_students():
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT
                students.user_id,
                COALESCE(assessments.total_assessments, 0)
                    AS total_assessments,
                COALESCE(practice.total_attempts, 0)
                    AS total_practice_attempts,
                COALESCE(projects.total_projects, 0)
                    AS total_projects,
                COALESCE(badges.total_badges, 0)
                    AS total_badges,
                COALESCE(certificates.total_certificates, 0)
                    AS total_certificates
            FROM (
                SELECT user_id FROM assessment_results
                UNION
                SELECT user_id FROM practice_attempts
                UNION
                SELECT user_id FROM project_submissions
                UNION
                SELECT user_id FROM student_badges
                UNION
                SELECT user_id FROM certificates
                UNION
                SELECT user_id FROM student_skills
            ) AS students

            LEFT JOIN (
                SELECT user_id, COUNT(*) AS total_assessments
                FROM assessment_results
                GROUP BY user_id
            ) AS assessments
            ON students.user_id = assessments.user_id

            LEFT JOIN (
                SELECT user_id, COUNT(*) AS total_attempts
                FROM practice_attempts
                GROUP BY user_id
            ) AS practice
            ON students.user_id = practice.user_id

            LEFT JOIN (
                SELECT user_id, COUNT(*) AS total_projects
                FROM project_submissions
                GROUP BY user_id
            ) AS projects
            ON students.user_id = projects.user_id

            LEFT JOIN (
                SELECT user_id, COUNT(*) AS total_badges
                FROM student_badges
                GROUP BY user_id
            ) AS badges
            ON students.user_id = badges.user_id

            LEFT JOIN (
                SELECT user_id, COUNT(*) AS total_certificates
                FROM certificates
                GROUP BY user_id
            ) AS certificates
            ON students.user_id = certificates.user_id

            ORDER BY students.user_id
        """)

        students = cur.fetchall()

        return jsonify({
            "success": True,
            "students": students
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()


# Student performance report
@admin_bp.get("/reports")
def admin_reports():
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT
                user_id,
                COUNT(*) AS total_assessments,
                ROUND(AVG(score), 2) AS average_score,
                MAX(score) AS highest_score
            FROM assessment_results
            GROUP BY user_id
            ORDER BY average_score DESC
        """)

        assessment_reports = cur.fetchall()

        cur.execute("""
            SELECT
                user_id,
                COUNT(*) AS total_attempts,
                ROUND(AVG(score), 2) AS average_score
            FROM practice_attempts
            GROUP BY user_id
            ORDER BY average_score DESC
        """)

        practice_reports = cur.fetchall()

        cur.execute("""
            SELECT
                status,
                COUNT(*) AS total_projects
            FROM project_submissions
            GROUP BY status
        """)

        project_reports = cur.fetchall()

        return jsonify({
            "success": True,
            "assessment_reports": assessment_reports,
            "practice_reports": practice_reports,
            "project_reports": project_reports
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()