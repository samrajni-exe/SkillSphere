from flask import Blueprint, request, jsonify
from app.person2_db import get_db, error_response
import uuid

achievements_bp = Blueprint("achievements", __name__)


# Get student achievements and certificates
@achievements_bp.get("/<int:user_id>")
def get_achievements(user_id):

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT id, badge_name, description, awarded_at
            FROM student_badges
            WHERE user_id = %s
            ORDER BY awarded_at DESC
        """, (user_id,))

        badges = cur.fetchall()

        cur.execute("""
            SELECT id, course_name, certificate_code, issued_at
            FROM certificates
            WHERE user_id = %s
            ORDER BY issued_at DESC
        """, (user_id,))

        certificates = cur.fetchall()

        return jsonify({
            "success": True,
            "badges": badges,
            "certificates": certificates
        })

    finally:
        cur.close()
        conn.close()


# Award a badge
@achievements_bp.post("/badges")
def award_badge():

    data = request.get_json(silent=True) or {}

    if not data.get("user_id") or not data.get("badge_name"):
        return error_response("user_id and badge_name are required")

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO student_badges
            (user_id, badge_name, description)
            VALUES (%s, %s, %s)
        """, (
            data["user_id"],
            data["badge_name"],
            data.get("description", "")
        ))

        badge_id = cur.lastrowid
        conn.commit()

        return jsonify({
            "success": True,
            "badge_id": badge_id
        }), 201

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()


# Issue a certificate
@achievements_bp.post("/certificates")
def issue_certificate():

    data = request.get_json(silent=True) or {}

    if not data.get("user_id") or not data.get("course_name"):
        return error_response(
            "user_id and course_name are required"
        )

    code = "SS-" + uuid.uuid4().hex[:12].upper()

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO certificates
            (user_id, course_name, certificate_code)
            VALUES (%s, %s, %s)
        """, (
            data["user_id"],
            data["course_name"],
            code
        ))

        certificate_id = cur.lastrowid
        conn.commit()

        return jsonify({
            "success": True,
            "certificate_id": certificate_id,
            "certificate_code": code
        }), 201

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()