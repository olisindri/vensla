# Vensla

A proof of concept for a Connections-esque game, implemented using a Python backend to prevent puzzle solutions from being gleamed by inspecting the frontend in the browser.

To run, clone the repo and create a new virtualenv with your tool of choice to contain it. Run:

`pip install -r requirements.txt`

From the root folder, run the API server with:

`fastapi dev api.py`

The server should now be running on http://127.0.0.1:8000. It will read puzzles from vensl.json and look for a puzzle there with today's date. Add one to the file or change the date of the sample puzzle included so the API has something to serve.

The beginnings of a scraper for puzzles from connections.swellgarfo.com is included, it reads the puzzle data and displays it, but a function to save the actual data to vensl.json in the correct JSON structure is left as an implementation exercise for you, as is feeding it URLs for desired puzzles to scrape. Refer to the sample puzzle for the schema.

A rudimentary frontend is included, open framendi-test/index.html in a browser and it should display today's puzzle for solving if the server is running locally at http://127.0.0.1:8000.

Have fun!
