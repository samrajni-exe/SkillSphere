from flask import Blueprint, jsonify
from app.person2_db import get_db

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.get("/<int:user_id>")
def recommend_courses(user_id):
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT skill, skill_score
            FROM student_skills
            WHERE user_id = %s
            ORDER BY skill_score ASC, skill ASC
        """, (user_id,))

        skills = cur.fetchall()

        recommendations = [
            {
                "skill": row["skill"],
                "skill_score": float(row["skill_score"] or 0),
                "reason": "Improve this skill based on your assessment score."
            }
            for row in skills
        ]

        return jsonify({
            "success": True,
            "recommendations": recommendations
        })

    except Exception as e:
        conn.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

    finally:
        cur.close()
        conn.close()