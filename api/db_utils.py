import sqlite3
from typing import Any, List, Dict
from contextlib import contextmanager
from fastapi import HTTPException


DB_PATH = 'movies-extended.db'

@contextmanager
def get_db_cursor():
    db = sqlite3.connect(DB_PATH)
    cursor = db.cursor()
    try:
        yield db, cursor
        db.commit()
    finally:
        db.close()


def fetch_one(table: str, item_id: int) -> tuple:
    with get_db_cursor() as (db, cursor):
        result = cursor.execute(f"SELECT * FROM {table} WHERE id = ?", (item_id,)).fetchone()
    return result


def fetch_all(table: str) -> List[Dict[str, Any]]:
    with get_db_cursor() as (db, cursor):
        cursor.execute(f"SELECT * FROM {table}")
        results = cursor.fetchall()
    return results


def insert_item(table: str, fields: List[str], values: List[Any]) -> int:
    placeholders = ", ".join(["?"] * len(fields))
    with get_db_cursor() as (db, cursor):
        cursor.execute(f"INSERT INTO {table} ({', '.join(fields)}) VALUES ({placeholders})", tuple(values))
        return cursor.lastrowid


def update_item(table: str, item_id: int, updates: Dict[str, Any]):
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    fields = [f"{key} = ?" for key in updates.keys()]
    values = list(updates.values()) + [item_id]

    with get_db_cursor() as (db, cursor):
        cursor.execute(f"UPDATE {table} SET {', '.join(fields)} WHERE id = ?", tuple(values))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail=f"{table.capitalize()} not found")


def delete_item(table: str, item_id: int):
    with get_db_cursor() as (db, cursor):
        cursor.execute(f"DELETE FROM {table} WHERE id = ?", (item_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail=f"{table.capitalize()} not found")


def delete_all_items(table: str) -> int:
    with get_db_cursor() as (db, cursor):
        cursor.execute(f"DELETE FROM {table}")
        return cursor.rowcount


def get_actors_for_movie(movie_id: int) -> list[dict]:
    movie = fetch_one('movie', movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    with get_db_cursor() as (db, cursor):
        actors = cursor.execute(
            "SELECT name, surname FROM actor a "
            "JOIN movie_actor_through atm ON a.id = atm.actor_id "
            "WHERE atm.movie_id = ?", (movie_id,)
        ).fetchall()

    if not actors:
        return []

    return [{"name": name, "surname": surname} for name, surname in actors]
