import os
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn

try:
    from algorithms import bubble_sort, selection_sort, insertion_sort
except ImportError:
    from sortlab.algorithms import bubble_sort, selection_sort, insertion_sort

app = FastAPI(title="SortLab API", description="Interactive Sorting Visualizer Backend")

# Enable CORS for browser access from file:// or other localhost ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALGORITHMS = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
}


class SortRequest(BaseModel):
    array: List[int]
    algorithm: str


class RaceRequest(BaseModel):
    array: List[int]
    algorithms: List[str]


@app.post("/sort")
def sort_endpoint(req: SortRequest) -> Dict[str, Any]:
    algo_key = req.algorithm.lower().strip()
    if algo_key not in ALGORITHMS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported algorithm '{req.algorithm}'. Supported algorithms: {list(ALGORITHMS.keys())}"
        )
    return ALGORITHMS[algo_key](req.array)


@app.post("/race")
def race_endpoint(req: RaceRequest) -> Dict[str, Any]:
    results = {}
    for algo in req.algorithms:
        algo_key = algo.lower().strip()
        if algo_key not in ALGORITHMS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported algorithm '{algo}'. Supported algorithms: {list(ALGORITHMS.keys())}"
            )
        results[algo] = ALGORITHMS[algo_key](req.array)
    return results


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# Check if static files are in current dir or in 'sortlab' subdir
STATIC_DIR = CURRENT_DIR if os.path.exists(os.path.join(CURRENT_DIR, "style.css")) else os.path.join(CURRENT_DIR, "sortlab")


@app.get("/")
def get_index():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "SortLab API is running. Access /docs for Swagger UI."}


@app.get("/style.css")
def get_style():
    style_path = os.path.join(STATIC_DIR, "style.css")
    if os.path.exists(style_path):
        return FileResponse(style_path, media_type="text/css")
    raise HTTPException(status_code=404, detail="style.css not found")


@app.get("/script.js")
def get_script():
    script_path = os.path.join(STATIC_DIR, "script.js")
    if os.path.exists(script_path):
        return FileResponse(script_path, media_type="application/javascript")
    raise HTTPException(status_code=404, detail="script.js not found")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
