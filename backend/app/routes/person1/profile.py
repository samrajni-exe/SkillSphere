
from flask import Blueprint, request, jsonify
from app.db import get_db_connection

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    connection = get_db_connection()
    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT u.id, u.name, u.email,
                   p.college, p.bio, p.phone, p.study_year
            FROM users u
            LEFT JOIN student_profiles p ON u.id = p.user_id
            WHERE u.id = %s
        """, (user_id,))

        profile = cursor.fetchone()

        if not profile:
            return jsonify({"message": "User not found"}), 404

        return jsonify(profile), 200

    finally:
        cursor.close()
        connection.close()


@profile_bp.route("/<int:user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json() or {}

    connection = get_db_connection()
    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor()

    try:
        cursor.execute(
            "SELECT id FROM users WHERE id = %s", (user_id,)
        )

        if not cursor.fetchone():
            return jsonify({"message": "User not found"}), 404

        cursor.execute("""
            INSERT INTO student_profiles
            (user_id, college, bio, phone, study_year)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
            college = VALUES(college),
            bio = VALUES(bio),
            phone = VALUES(phone),
            study_year = VALUES(study_year)
        """, (
            user_id,
            data.get("college"),
            data.get("bio"),
            data.get("phone"),
            data.get("study_year")
        ))

        connection.commit()
        return jsonify({"message": "Profile updated successfully!"}), 200

    except Exception as e:
        connection.rollback()
        return jsonify({"message": "Profile update failed"}), 500

    finally:
        cursor.close()
        connection.close()
