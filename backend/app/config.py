import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_DIR = os.path.join(DATA_DIR, "chroma_db")
DB_PATH = os.path.join(DATA_DIR, "fixfinder.db")
SYNTHETIC_DATA_PATH = os.path.join(DATA_DIR, "synthetic_cases.json")

# Default settings
DEFAULT_SIMILARITY_THRESHOLD = 0.30
DEFAULT_AUTO_ESCALATE = True
DEFAULT_THEME = "dark"
DEFAULT_LOCAL_ONLY = True

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
