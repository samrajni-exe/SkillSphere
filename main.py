from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from app.routes.assessment import assessment_bp
from app.routes.recommendations import recommendations_bp
from app.routes.roadmap import roadmap_bp
from app.routes.practice import practice_bp
from app.routes.projects import projects_bp
from app.routes.achievements import achievements_bp
from app.routes.admin import admin_bp


load_dotenv()

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173"
])


# Register API routes

app.register_blueprint(assessment_bp, url_prefix="/api/assessment")
app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
app.register_blueprint(roadmap_bp, url_prefix="/api/roadmap")
app.register_blueprint(practice_bp, url_prefix="/api/practice")
app.register_blueprint(projects_bp, url_prefix="/api/projects")
app.register_blueprint(achievements_bp, url_prefix="/api/achievements")
app.register_blueprint(admin_bp, url_prefix="/api/admin")


@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "SkillSphere Backend is Running!"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "success": True,
        "status": "healthy"
    })


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )