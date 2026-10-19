"""
SortLab backend — Day 1, Step 3
Just a basic FastAPI server to confirm everything is working.
Sorting logic will go into algorithms.py and get wired in later.
"""

from fastapi import FastAPI

app = FastAPI(title="SortLab API")


@app.get("/")
def read_root():
    """
    Basic health-check route.
    If this returns JSON when you visit http://127.0.0.1:8000/
    your backend is running correctly.
    """
    return {"status": "ok", "message": "SortLab backend is running 🔥"}