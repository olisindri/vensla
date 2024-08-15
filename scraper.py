import httpx
import json
from bs4 import BeautifulSoup as bs

response = httpx.get("https://connections.swellgarfo.com/game/-NerJwhWkPOG6vpAhGEh")
soup = bs(response.text, "html.parser")
puzzle_raw = soup.find(id="__NEXT_DATA__")
puzzle_json = json.loads(puzzle_raw.text)

print(puzzle_json["props"]["pageProps"])