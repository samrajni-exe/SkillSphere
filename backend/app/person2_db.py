import os
import mysql.connector
from mysql.connector import pooling
from flask import jsonify

_pool = None


def get_pool():
    global _pool

    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="skillsphere_pool",
            pool_size=5,
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "skillsphere"),
            autocommit=False,
            use_pure=True
        )

    return _pool


def get_db():
    return get_pool().get_connection()


def error_response(message, status=400):
    return jsonify({
        "success": False,
        "error": message
    }), status