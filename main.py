from fastapi import FastAPI, HTTPException
from models import Team
from db.db import fetch_all_teams, fetch_team_by_id, get_db_connection
import sqlite3

app = FastAPI()

# Master Table: Teams

@app.get("/teams")
def get_all_teams():
    """Fetch all teams."""
    teams = fetch_all_teams()
    return [dict(team) for team in teams]

@app.get("/teams/{team_id}")
def get_team_by_id(team_id: int):
    """Fetch a team by its ID."""
    team = fetch_team_by_id(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return dict(team)

@app.post("/teams")
def create_team(team: Team):
    """Create a new team."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO teams (team_name, titles, mascot, location, venue, general_mgr, head_coach, division, conference, ownership, year_founded) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (team.team_name, team.titles, team.mascot, team.location, team.venue, team.general_mgr, team.head_coach, team.division, team.conference, team.ownership, team.year_founded),
    )
    conn.commit()
    conn.close()
    return {"message": "Team created successfully"}

# @app.put("/teams/{team_id}")
# def update_team(team_id: int, team: Team):
#     """Update an existing team."""
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute(
#         "UPDATE teams SET team_name = ?, titles = ?, mascot = ?, location = ?, venue = ?, general_mgr = ?, head_coach = ?, division = ?, conference = ?, ownership = ?, year_founded = ? WHERE team_id = ?",
#         (team.team_name, team.titles, team.mascot, team.location, team.venue, team.general_mgr, team.head_coach, team.division, team.conference, team.ownership, team.year_founded, team_id),
#     )
#     conn.commit()
#     conn.close()
#     return {"message": "Team updated successfully"}

# @app.delete("/teams/{team_id}")
# def delete_team(team_id: int):
#     """Delete a team by its ID."""
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute("DELETE FROM teams WHERE team_id = ?", (team_id,))
#     conn.commit()
#     conn.close()
#     return {"message": "Team deleted successfully"}

# # Detail Table: Players

# @app.get("/players")
# def get_all_players():
#     """Fetch all players."""
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM players")
#     players = cursor.fetchall()
#     conn.close()
#     return [dict(player) for player in players]

# @app.get("/players/{player_id}")
# def get_player_by_id(player_id: int):
#     """Fetch a player by their ID."""
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM players WHERE player_id = ?", (player_id,))
#     player = cursor.fetchone()
#     conn.close()
#     if player is None:
#         raise HTTPException(status_code=404, detail="Player not found")
#     return dict(player)

# @app.post("/players")
# def create_player(player: Player):
#     """Create a new player."""
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute(
#         "INSERT INTO players (team_id, first_name, last_name, birth_date, nationality, position, height, weight, jersey_number, contract_start_year, contract_end_year, salary, college, draft_year, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
#         (player.team_id, player.first_name, player.last_name, player.birth_date, player.nationality, player.position, player.height, player.weight, player.jersey_number, player.contract_start_year, player.contract_end_year, player.salary, player.college, player.draft_year, player.experience),
#     )
#     conn.commit()
#     conn.close()
#     return {"message": "Player created successfully"}

# @app.put("/players/{player_id}")
# def update_player(player_id: int, player: Player):
#     """Update an existing player."""
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute(
#         "UPDATE players SET team_id = ?, first_name = ?, last_name = ?, birth_date = ?, nationality = ?, position = ?, height = ?, weight = ?, jersey_number = ?, contract_start_year = ?, contract_end_year = ?, salary = ?, college = ?, draft_year = ?, experience = ? WHERE player_id = ?",
#         (player.team_id, player.first_name, player.last_name, player.birth_date, player.nationality, player.position, player.height, player.weight, player.jersey_number, player.contract_start_year, player.contract_end_year, player.salary, player.college, player.draft_year, player.experience, player_id),
#     )
#     conn.commit()
#     conn.close()
#     return {"message": "Player updated successfully"}

# @app.delete("/players/{player_id}")
# def delete_player(player_id: int):
#     """Delete a player by their ID."""
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute("DELETE FROM players WHERE player_id = ?", (player_id,))
#     conn.commit()
#     conn.close()
#     return {"message": "Player deleted successfully"}