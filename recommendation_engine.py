def generate_recommendations(courses, student_skills):
    """
    Recommends courses based on the student's skill scores.

    Lower skill scores receive higher priority.
    """

    recommendations = []

    for course in courses:
        course_subject = course.get("subject", "")

        skill_score = student_skills.get(
            course_subject,
            0
        )

        recommendations.append({
            "course_id": course.get("id"),
            "title": course.get("title"),
            "subject": course_subject,
            "level": course.get("level"),
            "description": course.get("description"),
            "skill_score": skill_score
        })

    recommendations.sort(
        key=lambda item: item["skill_score"]
    )

    return recommendations