import sqlite3
import json
import os
from datetime import datetime
from .config import DB_PATH, DEFAULT_SIMILARITY_THRESHOLD, DEFAULT_AUTO_ESCALATE, DEFAULT_THEME, DEFAULT_LOCAL_ONLY

def get_db_connection():
  os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
  conn = sqlite3.connect(DB_PATH)
  conn.row_factory = sqlite3.Row
  return conn

def init_db():
  conn = get_db_connection()
  cursor = conn.cursor()

  # Settings table
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  """)

  # Default settings inserts
  cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('similarity_threshold', ?)", (str(DEFAULT_SIMILARITY_THRESHOLD),))
  cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('auto_escalate', ?)", (str(DEFAULT_AUTO_ESCALATE).lower(),))
  cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', ?)", (DEFAULT_THEME,))
  cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('local_only', ?)", (str(DEFAULT_LOCAL_ONLY).lower(),))

  # Activity Log table
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      agent_name TEXT,
      complaint_text TEXT,
      building TEXT,
      equipment_type TEXT,
      diagnosed_cause TEXT,
      urgency TEXT,
      similarity_score REAL,
      cited_case_ids TEXT,
      status TEXT
    )
  """)

  conn.commit()
  conn.close()

def get_settings():
  conn = get_db_connection()
  cursor = conn.cursor()
  cursor.execute("SELECT key, value FROM settings")
  rows = cursor.fetchall()
  conn.close()

  settings = {
    "similarity_threshold": DEFAULT_SIMILARITY_THRESHOLD,
    "auto_escalate": DEFAULT_AUTO_ESCALATE,
    "theme": DEFAULT_THEME,
    "local_only": DEFAULT_LOCAL_ONLY
  }

  for row in rows:
    k, v = row["key"], row["value"]
    if k == "similarity_threshold":
      settings[k] = float(v)
    elif k in ("auto_escalate", "local_only"):
      settings[k] = v.lower() == "true"
    else:
      settings[k] = v

  return settings

def update_settings(new_settings):
  conn = get_db_connection()
  cursor = conn.cursor()
  for k, v in new_settings.items():
    cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (k, str(v)))
  conn.commit()
  conn.close()
  return get_settings()

def log_agent_activity(agent_name, complaint_text, building, equipment_type, cause, urgency, score, cited_cases, status="Completed"):
  conn = get_db_connection()
  cursor = conn.cursor()
  now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  cited_str = json.dumps(cited_cases) if isinstance(cited_cases, list) else str(cited_cases)

  cursor.execute("""
    INSERT INTO activity_log (timestamp, agent_name, complaint_text, building, equipment_type, diagnosed_cause, urgency, similarity_score, cited_case_ids, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  """, (now, agent_name, complaint_text, building, equipment_type, cause, urgency, score, cited_str, status))
  conn.commit()
  conn.close()

def get_activity_logs(limit=50):
  conn = get_db_connection()
  cursor = conn.cursor()
  cursor.execute("SELECT * FROM activity_log ORDER BY id DESC LIMIT ?", (limit,))
  rows = cursor.fetchall()
  conn.close()
  return [dict(row) for row in rows]
