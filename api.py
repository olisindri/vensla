import json
from datetime import date
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from functools import cache

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@cache
def get_puzzle(publish_date=None):
    publish_date = publish_date or date.today().isoformat()
    puzzle = None
    with open("vensl.json", "r") as json_file:
        full_json = json.load(json_file)
        for entry in full_json:
            if entry["date"] == publish_date:
                puzzle = entry
                break
    if puzzle:
        words = []
        for set in puzzle["sets"]:
            words.extend(set["words"])
        puzzle["words"] = words
        return puzzle
    else:
        return None

@app.get("/date/{date}")
def get_date(date):
    puzzle = get_puzzle(date)
    if puzzle:
        return {
            "date": puzzle["date"],
            "words": sorted(puzzle["words"])
        }
    else:
        raise HTTPException(status_code=404, detail="No puzzle found for this date.")

@app.get("/today")
async def today():
    return get_date(date.today().isoformat())

@app.get("/check")
async def check(w: list[str] = Query(None), date: str = None):
    if not w:
        raise HTTPException(status_code=400, detail="No words specified.")
    guess = set(w)
    puzzle = get_puzzle(date)
    if len(guess) != 4:
        raise HTTPException(status_code=400, detail="Incorrect number of unique words, should be 4.")
    if all(word in puzzle["words"] for word in guess):
        results = []
        for word_set in puzzle["sets"]:
            difference = set(word_set["words"]) - guess
            if len(difference) == 0:
                return {
                    "correct": True,
                    "result": "Rétt!",
                    "set": word_set
                }
            results.append(difference)
        best_guess = min(results, key=len)
        return {
            "correct": False,
            "result": "Munar einum!" if len(best_guess) == 1 else "Rangt"
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid words.")

@app.post("/stats")
async def save_stats():
    pass
