---
name: python-development
description: Comprehensive Python development skills covering FastAPI, Django, Flask, data/ML integration, and best practices. Use when building Python backends, APIs, data pipelines, or ML applications.
license: MIT
version: 1.0.0
---

# Python Development Skill

Production-ready Python development with modern frameworks and best practices.

## When to Use

- Building REST APIs with FastAPI or Flask
- Django web applications
- Data pipelines and ETL processes
- Machine learning integration
- Scripting and automation
- Python package development

## Supported Frameworks

### Web Frameworks
- **FastAPI** - Modern, high-performance API framework (recommended)
- **Django** - Full-stack web framework
- **Flask** - Lightweight micro-framework

### Data/ML
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Scikit-learn** - ML basics
- **PyTorch/TensorFlow** - Deep learning

### Testing
- **Pytest** - Primary testing framework
- **pytest-asyncio** - Async testing
- **pytest-cov** - Coverage

## FastAPI Quick Start

### Installation
```bash
pip install fastapi uvicorn
# OR
poetry add fastapi uvicorn
```

### Basic API
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="My API", version="1.0.0")

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str

users_db = []

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users")
async def get_users():
    return users_db

@app.post("/users")
async def create_user(user: User):
    user.id = len(users_db) + 1
    users_db.append(user)
    return user

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    for user in users_db:
        if user.id == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")
```

### Run Server
```bash
uvicorn main:app --reload --port 8000
```

## Django Quick Start

### Installation
```bash
pip install django
django-admin startproject myproject
cd myproject
python manage.py startapp api
```

### Basic View
```python
# api/views.py
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def hello(request):
    return JsonResponse({"message": "Hello Django!"})

# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello, name='hello'),
]
```

### Run Server
```bash
python manage.py runserver
```

## Pytest Testing

### Installation
```bash
pip install pytest pytest-asyncio pytest-cov
# OR
poetry add -D pytest pytest-asyncio pytest-cov
```

### Test Structure
```python
# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_user():
    response = client.post("/users", json={
        "name": "John",
        "email": "john@example.com"
    })
    assert response.status_code == 200
    assert response.json()["name"] == "John"

@pytest.mark.asyncio
async def test_async():
    # Async test example
    result = await some_async_function()
    assert result is not None
```

### Run Tests
```bash
# Run all tests
pytest

# With coverage
pytest --cov=main --cov-report=html

# Run specific file
pytest tests/test_api.py

# Run with markers
pytest -m "unit"
```

## Best Practices

### 1. Project Structure
```
project/
├── src/
│   ├── __init__.py
│   ├── main.py           # FastAPI app
│   ├── models.py         # Pydantic models
│   ├── routers/          # API routes
│   │   ├── __init__.py
│   │   └── users.py
│   └── services/         # Business logic
├── tests/
│   ├── __init__.py
│   ├── test_users.py
│   └── conftest.py      # Fixtures
├── pyproject.toml       # Poetry/pip metadata
└── .env                # Environment (gitignore)
```

### 2. Environment Management
```bash
# pip
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate    # Windows

# Poetry (recommended)
pip install poetry
poetry init
poetry add fastapi uvicorn
poetry add -D pytest pytest-asyncio
```

### 3. Type Hints
```python
from typing import List, Optional

def get_user_by_id(user_id: int) -> Optional[dict]:
    """Get user by ID with type hints."""
    for user in users:
        if user.id == user_id:
            return user
    return None

def process_items(items: List[str]) -> List[str]:
    """Process list of items."""
    return [item.upper() for item in items]
```

### 4. Async/Await
```python
import asyncio
import aiohttp
import asyncpg

async def fetch_data():
    async with aiohttp.ClientSession() as session:
        async with session.get('https://api.example.com/data') as resp:
            return await resp.json()

async def fetch_users():
    conn = await asyncpg.connect(host='localhost', database='users')
    users = await conn.fetch('SELECT * FROM users')
    await conn.close()
    return users

# Run multiple async tasks
async def main():
    results = await asyncio.gather(
        fetch_data(),
        fetch_users(),
    )
    return results
```

### 5. Error Handling
```python
from fastapi import HTTPException
from typing import Union

def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)}
    )
```

### 6. Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    logger.info(f"Fetching item {item_id}")
    if item_id not in items:
        logger.warning(f"Item {item_id} not found")
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]
```

### 7. Configuration
```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "My API"
    database_url: str = "postgresql://localhost/mydb"
    debug: bool = False
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

@app.get("/info")
async def info():
    settings = get_settings()
    return {"app": settings.app_name, "debug": settings.debug}
```

## Database Integration

### SQLAlchemy with FastAPI
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)

Base.metadata.create_all(bind=engine)

# Pydantic model
class UserCreate(BaseModel):
    name: str
    email: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        from_attributes = True

# CRUD
def get_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user: UserCreate):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

### PostgreSQL with asyncpg
```python
import asyncpg
import os

async def get_users():
    conn = await asyncpg.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=5432,
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "mydb")
    )
    
    users = await conn.fetch('SELECT id, name, email FROM users')
    await conn.close()
    return users
```

## CI/CD with GitHub Actions

```yaml
name: Python Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install poetry
          poetry install
          
      - name: Run tests
        run: poetry run pytest --cov=src
```

## Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- Django Docs: https://docs.djangoproject.com/
- Flask Docs: https://flask.palletsprojects.com/
- Pytest Docs: https://docs.pytest.org/
- Python.org: https://www.python.org/

## Integration

When working with Python projects:
1. Use `backend-development` skill for architecture guidance
2. Use `postgresql` skill for database integration
3. Use `test-automation` skill for E2E testing
4. Use this skill for Python-specific patterns and frameworks