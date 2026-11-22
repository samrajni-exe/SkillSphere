from flask import Blueprint, request, jsonify
from app.person2_db import get_db, error_response

roadmap_bp = Blueprint("roadmap", __name__)


# Get student's learning roadmap
@roadmap_bp.get("/<int:user_id>")
def get_roadmap(user_id):

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT id, user_id, title, description,
                   completed, created_at
            FROM roadmap_items
            WHERE user_id = %s
            ORDER BY created_at, id
        """, (user_id,))

        return jsonify({
            "success": True,
            "roadmap": cur.fetchall()
        })

    finally:
        cur.close()
        conn.close()


# Add a roadmap task
@roadmap_bp.post("/")
def add_roadmap_item():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    title = data.get("title")

    if not user_id or not title:
        return error_response("user_id and title are required")

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO roadmap_items
            (user_id, title, description)
            VALUES (%s, %s, %s)
        """, (
            user_id,
            title,
            data.get("description", "")
        ))

        item_id = cur.lastrowid
        conn.commit()

        return jsonify({
            "success": True,
            "id": item_id,
            "message": "Roadmap item added"
        }), 201

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()


# Mark roadmap task as completed
@roadmap_bp.patch("/<int:item_id>/complete")
def complete_roadmap_item(item_id):

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            UPDATE roadmap_items
            SET completed = 1
            WHERE id = %s
        """, (item_id,))

        if cur.rowcount == 0:
            return error_response("Roadmap item not found", 404)

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Roadmap item completed"
        })

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()