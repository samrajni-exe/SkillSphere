
from flask import Blueprint, jsonify, request
from app.db import get_db_connection

courses_bp = Blueprint("courses", __name__)


# GET ALL COURSES
@courses_bp.route("/", methods=["GET"])
def get_courses():
    connection = get_db_connection()

    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id, title, description, category, level, duration
            FROM courses
            ORDER BY id
        """)

        return jsonify(cursor.fetchall()), 200

    finally:
        cursor.close()
        connection.close()


# GET SINGLE COURSE
@courses_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    connection = get_db_connection()

    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id, title, description, category, level, duration
            FROM courses
            WHERE id = %s
        """, (course_id,))

        course = cursor.fetchone()

        if not course:
            return jsonify({"message": "Course not found"}), 404

        return jsonify(course), 200

    finally:
        cursor.close()
        connection.close()


# CHECK ENROLLMENT STATUS
@courses_bp.route("/<int:course_id>/enrollment-status", methods=["GET"])
def check_enrollment(course_id):
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    connection = get_db_connection()

    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id
            FROM enrollments
            WHERE user_id = %s AND course_id = %s
        """, (user_id, course_id))

        enrollment = cursor.fetchone()

        return jsonify({
            "enrolled": enrollment is not None
        }), 200

    finally:
        cursor.close()
        connection.close()


# GET COURSE LESSONS - ENROLLED STUDENTS ONLY
@courses_bp.route("/<int:course_id>/lessons", methods=["GET"])
def get_lessons(course_id):
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"message": "Login and enrolment required"}), 401

    connection = get_db_connection()

    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT id
            FROM enrollments
            WHERE user_id = %s AND course_id = %s
        """, (user_id, course_id))

        if not cursor.fetchone():
            return jsonify({
                "message": "Please enrol to access lessons"
            }), 403

        cursor.execute("""
            SELECT id, course_id, title, content, lesson_order
            FROM lessons
            WHERE course_id = %s
            ORDER BY lesson_order
        """, (course_id,))

        return jsonify(cursor.fetchall()), 200

    finally:
        cursor.close()
        connection.close()


# ENROL IN COURSE
@courses_bp.route("/<int:course_id>/enroll", methods=["POST"])
def enroll_course(course_id):
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    connection = get_db_connection()

    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id FROM users WHERE id = %s",
            (user_id,)
        )

        if not cursor.fetchone():
            return jsonify({"message": "User not found"}), 404

        cursor.execute(
            "SELECT id FROM courses WHERE id = %s",
            (course_id,)
        )

        if not cursor.fetchone():
            return jsonify({"message": "Course not found"}), 404

        cursor.execute("""
            SELECT id
            FROM enrollments
            WHERE user_id = %s AND course_id = %s
        """, (user_id, course_id))

        if cursor.fetchone():
            return jsonify({
                "message": "You are already enrolled in this course."
            }), 200

        cursor.execute("""
            INSERT INTO enrollments (user_id, course_id)
            VALUES (%s, %s)
        """, (user_id, course_id))

        connection.commit()

        return jsonify({
            "message": "Successfully enrolled in the course!"
        }), 201

    except Exception as error:
        connection.rollback()
        print("ENROLLMENT ERROR:", error)

        return jsonify({
            "message": "Enrolment failed"
        }), 500

    finally:
        cursor.close()
        connection.close()


# GET ALL COURSES ENROLLED BY A STUDENT
@courses_bp.route("/student/<int:user_id>/enrolled", methods=["GET"])
def get_enrolled_courses(user_id):
    connection = get_db_connection()

    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT c.id, c.title, c.description,
                   c.category, c.level, c.duration
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = %s
            ORDER BY e.id DESC
        """, (user_id,))

        return jsonify(cursor.fetchall()), 200

    finally:
        cursor.close()
        connection.close()

