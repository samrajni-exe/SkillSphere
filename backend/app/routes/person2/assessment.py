from flask import Blueprint, request, jsonify
from app.person2_db import get_db, error_response

assessment_bp = Blueprint("assessment", __name__)


# Get assessment questions
@assessment_bp.get("/questions")
def get_questions():

    skill = request.args.get("skill")

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        if skill:
            cur.execute("""
                SELECT id, skill, question,
                       option_a, option_b, option_c, option_d
                FROM assessment_questions
                WHERE skill = %s AND active = 1
                ORDER BY id
            """, (skill,))
        else:
            cur.execute("""
                SELECT id, skill, question,
                       option_a, option_b, option_c, option_d
                FROM assessment_questions
                WHERE active = 1
                ORDER BY skill, id
            """)

        return jsonify({
            "success": True,
            "questions": cur.fetchall()
        })

    finally:
        cur.close()
        conn.close()


# Submit assessment answers
@assessment_bp.post("/submit")
def submit_assessment():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    answers = data.get("answers", [])

    if not user_id or not isinstance(answers, list) or not answers:
        return error_response(
            "user_id and a non-empty answers list are required"
        )

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        question_ids = [
            answer.get("question_id")
            for answer in answers
        ]

        if any(not qid for qid in question_ids):
            return error_response("Every answer needs question_id")

        placeholders = ",".join(["%s"] * len(question_ids))

        cur.execute(
            f"""
            SELECT id, skill, correct_option
            FROM assessment_questions
            WHERE id IN ({placeholders}) AND active = 1
            """,
            question_ids
        )

        questions = {
            q["id"]: q for q in cur.fetchall()
        }

        if len(questions) != len(set(question_ids)):
            return error_response("Invalid or inactive question IDs")

        if len(question_ids) != len(set(question_ids)):
            return error_response("Duplicate question IDs are not allowed")

        total = len(answers)
        score = 0
        skill_scores = {}

        for answer in answers:

            question = questions[answer["question_id"]]

            selected = str(
                answer.get("selected_option", "")
            ).upper()

            correct = selected == str(
                question["correct_option"]
            ).upper()

            score += int(correct)

            skill = question["skill"]

            if skill not in skill_scores:
                skill_scores[skill] = [0, 0]

            skill_scores[skill][0] += int(correct)
            skill_scores[skill][1] += 1

        percentage = round((score / total) * 100, 2)

        # Save assessment result
        cur.execute("""
            INSERT INTO assessment_results
            (user_id, total_questions, correct_answers, score)
            VALUES (%s, %s, %s, %s)
        """, (user_id, total, score, percentage))

        result_id = cur.lastrowid

        # Update student skill scores
        for skill, values in skill_scores.items():

            right, count = values

            skill_percentage = round(
                (right / count) * 100, 2
            )

            cur.execute("""
                SELECT id
                FROM student_skills
                WHERE user_id = %s AND skill = %s
                LIMIT 1
            """, (user_id, skill))

            existing = cur.fetchone()

            if existing:
                cur.execute("""
                    UPDATE student_skills
                    SET skill_score = %s
                    WHERE id = %s
                """, (skill_percentage, existing["id"]))

            else:
                cur.execute("""
                    INSERT INTO student_skills
                    (user_id, skill, skill_score)
                    VALUES (%s, %s, %s)
                """, (user_id, skill, skill_percentage))

        conn.commit()

        return jsonify({
            "success": True,
            "result_id": result_id,
            "correct": score,
            "total": total,
            "score_percent": percentage,
            "skill_breakdown": {
                skill: round(
                    values[0] / values[1] * 100, 2
                )
                for skill, values in skill_scores.items()
            }
        }), 201

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()


# Get previous assessment results
@assessment_bp.get("/results/<int:user_id>")
def assessment_history(user_id):

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    try:
        cur.execute("""
            SELECT id, total_questions,
                   correct_answers,
                   score AS score_percent,
                   created_at
            FROM assessment_results
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))

        return jsonify({
            "success": True,
            "results": cur.fetchall()
        })

    finally:
        cur.close()
        conn.close()