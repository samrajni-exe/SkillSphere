
from flask import Blueprint, request, jsonify
from app.db import get_db_connection
from app.services.person1.auth_service import hash_password, verify_password

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"message": "All fields are required"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, hash_password(password))
        )
        connection.commit()
        return jsonify({"message": "Account created successfully!"}), 201

    except Exception:
        connection.rollback()
        return jsonify({"message": "Email already exists or signup failed"}), 409

    finally:
        cursor.close()
        connection.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user or not verify_password(password, user["password"]):
            return jsonify({"message": "Invalid email or password"}), 401

        return jsonify({
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }), 200

    finally:
        cursor.close()
        connection.close()
