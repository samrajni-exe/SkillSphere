from flask import Flask
from flask_cors import CORS

# Person 1 routes
from app.routes.person1.auth import auth_bp
from app.routes.person1.profile import profile_bp
from app.routes.person1.courses import courses_bp
from app.routes.person1.dashboard import dashboard_bp

# Person 2 routes
from app.routes.person2.assessment import assessment_bp
from app.routes.person2.recommendations import recommendations_bp
from app.routes.person2.roadmap import roadmap_bp
from app.routes.person2.practice import practice_bp
from app.routes.person2.projects import projects_bp
from app.routes.person2.achievements import achievements_bp
from app.routes.person2.admin import admin_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Person 1
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(courses_bp, url_prefix="/api/courses")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    # Person 2
    app.register_blueprint(assessment_bp, url_prefix="/api/assessment")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
    app.register_blueprint(roadmap_bp, url_prefix="/api/roadmap")
    app.register_blueprint(practice_bp, url_prefix="/api/practice")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(achievements_bp, url_prefix="/api/achievements")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.route("/")
    def home():
        return {
            "message": "SkillSphere Backend is running!",
            "status": "success"
        }

    return app
