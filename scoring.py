def calculate_score(total_questions, correct_answers):
    if total_questions <= 0:
        return 0

    score = (correct_answers / total_questions) * 100
    return round(score, 2)


def calculate_skill_breakdown(answers):
    """
    Calculates the score for each skill.

    Expected format:
    [
        {"skill": "Python", "is_correct": True},
        {"skill": "Python", "is_correct": False},
        {"skill": "SQL", "is_correct": True}
    ]
    """

    skills = {}

    for answer in answers:
        skill = answer.get("skill", "General")

        if skill not in skills:
            skills[skill] = {
                "total": 0,
                "correct": 0
            }

        skills[skill]["total"] += 1

        if answer.get("is_correct"):
            skills[skill]["correct"] += 1

    result = {}

    for skill, data in skills.items():
        result[skill] = calculate_score(
            data["total"],
            data["correct"]
        )

    return result