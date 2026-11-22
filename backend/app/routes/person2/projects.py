from flask import Blueprint, request, jsonify
from app.person2_db import get_db, error_response

projects_bp = Blueprint("projects", __name__)


# Submit a project
@projects_bp.post("/")
def submit_project():

    data = request.get_json(silent=True) or {}

    if not data.get("user_id") or not data.get("title"):
        return error_response(
            "user_id and title are required"
        )

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO project_submissions
            (user_id, title, description, project_url)
            VALUES (%s, %s, %s, %s)
        """, (
            data["user_id"],
            data["title"],
            data.get("description", ""),
            data.get("project_url")
        ))

        project_id = cur.lastrowid
        conn.commit()

        return jsonify({
            "success": True,
            "project_id": project_id,
            "status": "Pending"
        }), 201

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()


# Get student's submitted projects
@projects_bp.get("/<int:user_id>")
def list_projects(user_id):

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT id, user_id, title, description,
                   project_url, status, submitted_at
            FROM project_submissions
            WHERE user_id = %s
            ORDER BY submitted_at DESC
        """, (user_id,))

        return jsonify({
            "success": True,
            "projects": cur.fetchall()
        })

    finally:
        cur.close()
        conn.close()