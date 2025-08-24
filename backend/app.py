from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# -------------------------
# CORS setup
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://queue-app-1-uywr.onrender.com", "http://localhost:3000"],   # Use ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

queue = []

# -------------------------
# Database setup
# -------------------------
DB_FILE = "queue.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# -------------------------
# Helper functions
# -------------------------
def get_queue_list():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT name FROM queue ORDER BY id ASC")
    rows = [row[0] for row in c.fetchall()]
    conn.close()
    return rows

def add_name_to_db(name: str):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO queue (name) VALUES (?)", (name,))
    conn.commit()
    conn.close()

def remove_first_from_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT id, name FROM queue ORDER BY id ASC LIMIT 1")
    row = c.fetchone()
    if row:
        c.execute("DELETE FROM queue WHERE id=?", (row[0],))
        conn.commit()
        conn.close()
        return row[1]
    conn.close()
    return None

def clear_queue_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("DELETE FROM queue")
    conn.commit()
    conn.close()

# -------------------------
# Models
# -------------------------
class NameItem(BaseModel):
    name: str

# -------------------------
# API Endpoints
# -------------------------
@app.get("/queue")
def get_queue():
    return {"queue": get_queue_list()}

@app.post("/queue")
def add_name(item: NameItem):
    if not item.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty")
    add_name_to_db(item.name.strip())
    return {"queue": get_queue_list()}

@app.delete("/queue")
def remove_name():
    removed = remove_first_from_db()
    if removed is None:
        raise HTTPException(status_code=400, detail="Queue is empty")
    return {"removed": removed, "queue": get_queue_list()}

@app.delete("/queue/clear")
def clear_queue():
    clear_queue_db()
    return {"queue": []}
