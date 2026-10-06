.PHONY: dev seed test backend frontend install

install:
	@echo "Installing backend dependencies..."
	pip install fastapi uvicorn pydantic chromadb sentence-transformers sqlite3 pytest pytest-asyncio anthropic openai requests
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

seed:
	python backend/seed_data.py

test:
	python -m pytest backend/tests/

backend:
	python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

frontend:
	cd frontend && npm run dev

dev: seed
	@echo "Starting FixFinder Backend & Frontend..."
	python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &
	cd frontend && npm run dev
