from flask import Blueprint, request, jsonify
from app.person2_db import get_db, error_response

practice_bp = Blueprint("practice", __name__)


# Get practice questions
@practice_bp.get("/questions")
def practice_questions():

    topic = request.args.get("topic")

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        if topic:
            cur.execute("""
                SELECT id, topic, question,
                       option_a, option_b, option_c, option_d
                FROM practice_questions
                WHERE topic = %s AND active = 1
                ORDER BY id
            """, (topic,))
        else:
            cur.execute("""
                SELECT id, topic, question,
                       option_a, option_b, option_c, option_d
                FROM practice_questions
                WHERE active = 1
                ORDER BY topic, id
            """)

        return jsonify({
            "success": True,
            "questions": cur.fetchall()
        })

    finally:
        cur.close()
        conn.close()


# Submit practice answers
@practice_bp.post("/submit")
def submit_practice():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    answers = data.get("answers", [])

    if not user_id or not isinstance(answers, list) or not answers:
        return error_response("user_id and answers are required")

    if any(not isinstance(answer, dict) for answer in answers):
        return error_response("Each answer must be an object")

    question_ids = [answer.get("question_id") for answer in answers]

    if any(not qid for qid in question_ids):
        return error_response("Each answer needs question_id")

    if len(question_ids) != len(set(question_ids)):
        return error_response("Duplicate question IDs are not allowed")

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        placeholders = ",".join(["%s"] * len(question_ids))

        cur.execute(
            f"""
            SELECT id, correct_option, topic
            FROM practice_questions
            WHERE id IN ({placeholders}) AND active = 1
            """,
            question_ids
        )

        questions = {
            q["id"]: q for q in cur.fetchall()
        }

        if len(questions) != len(question_ids):
            return error_response("Invalid or inactive question IDs")

        correct = 0

        for answer in answers:
            question = questions[answer["question_id"]]

            if (
                str(answer.get("selected_option", "")).upper()
                == str(question["correct_option"]).upper()
            ):
                correct += 1

        total = len(answers)
        percentage = round((correct / total) * 100, 2)

        topics = {q["topic"] for q in questions.values()}
        topic = next(iter(topics)) if len(topics) == 1 else "Mixed"

        cur.execute("""
            INSERT INTO practice_attempts
            (user_id, topic, total_questions, correct_answers, score)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, topic, total, correct, percentage))

        attempt_id = cur.lastrowid
        conn.commit()

        return jsonify({
            "success": True,
            "attempt_id": attempt_id,
            "correct": correct,
            "total": total,
            "score_percent": percentage
        }), 201

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()


# Get practice history
@practice_bp.get("/history/<int:user_id>")
def practice_history(user_id):

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT id, user_id, topic, total_questions,
                   correct_answers, score,
                   attempted_at
            FROM practice_attempts
            WHERE user_id = %s
            ORDER BY attempted_at DESC
        """, (user_id,))

        return jsonify({
            "success": True,
            "attempts": cur.fetchall()
        })

    finally:
        cur.close()
        conn.close()