from fastapi import FastAPI, Body, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
from db_utils import (fetch_one, fetch_all, insert_item, update_item,
                      delete_item, delete_all_items, get_actors_for_movie)


class Movie(BaseModel):
    title: str
    year: str
    actors: str

app = FastAPI()

app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
   return FileResponse("../ui/build/index.html")

@app.get('/movies')
def get_movies():
    movies = fetch_all('movie')

    return [{'id': movie[0], 'title': movie[1], 'director': movie[2],
             'year': movie[3], 'description': movie[4]} for movie in movies]


@app.get('/movies/{movie_id}')
def get_movie(movie_id: int):
    movie = fetch_one('movie', movie_id)

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return {'id': movie[0], 'title': movie[1], 'director': movie[2], 'year': movie[3], 'description': movie[4]}


@app.post('/movies')
def add_movie(params: dict[str, Any]):
    required_fields = ['title', 'director', 'year', 'description']
    missing = [f for f in required_fields if f not in params]

    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing)}")

    movie_id = insert_item('movie', required_fields, [params[f] for f in required_fields])

    return {"message": "Movie added successfully!", "id": movie_id}


@app.put('/movies/{movie_id}')
def update_movie(movie_id: int, params: dict[str, Any]):
    updates = {k: v for k, v in params.items() if k in ['title', 'director', 'year', 'description']}

    update_item('movie', movie_id, updates)

    return {"message": "Movie updated successfully!"}


@app.delete('/movies/{movie_id}')
def delete_movie(movie_id: int):
    delete_item('movie', movie_id)

    return {"message": "Movie deleted successfully!"}


@app.delete('/movies')
def delete_all_movies():
    count = delete_all_items('movie')

    return {"message": "All movies deleted successfully!", "deleted_count": count}

@app.get('/movies/{movie_id}/actors')
def get_actor_for_movie(movie_id: int):
    return get_actors_for_movie(movie_id)
