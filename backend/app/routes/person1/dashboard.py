
from flask import Blueprint, jsonify
from app.db import get_db_connection

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/<int:user_id>", methods=["GET"])
def get_dashboard(user_id):
    connection = get_db_connection()

    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, name, email FROM users WHERE id = %s",
            (user_id,)
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "User not found"}), 404

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM enrollments
            WHERE user_id = %s
        """, (user_id,))
        enrolled = cursor.fetchone()["total"]

        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM lesson_progress
            WHERE user_id = %s AND completed = TRUE
        """, (user_id,))
        completed = cursor.fetchone()["total"]

        return jsonify({
            "student": user,
            "enrolled_courses": enrolled,
            "completed_lessons": completed
        }), 200

    finally:
        cursor.close()
        connection.close()
