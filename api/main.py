from fastapi import FastAPI, Body, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from db_utils import (fetch_one, fetch_all, insert_item,
                      delete_item, get_actors_for_movie)


class Actor(BaseModel):
    name: str = ""
    surname: str = ""

class Movie(BaseModel):
    title: str
    year: str
    director: str = ""
    description: str = ""
    actors: List[Actor]

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
def add_movie(movie: Movie):
    movie_id = insert_item('movie', ['title', 'director', 'year', 'description'],
                           [movie.title, movie.director, movie.year, movie.description])

    for actor in movie.actors or []:
        if not actor.name or not actor.surname:
            continue

        actor_id = insert_item('actor', ['name', 'surname'], [actor.name, actor.surname])

        insert_item('movie_actor_through', ['movie_id', 'actor_id'], [movie_id, actor_id])

    return {"message": "Movie added successfully!", "id": movie_id}

@app.delete('/movies/{movie_id}')
def delete_movie(movie_id: int):
    delete_item('movie', movie_id)

    return {"message": "Movie deleted successfully!"}

@app.get('/movies/{movie_id}/actors')
def get_actor_for_movie(movie_id: int):
    return get_actors_for_movie(movie_id)
