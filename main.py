from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Player, Player_Create, Player_Update, Team, Team_Create, Team_Update
from db.db import fetch_all_teams, fetch_team_by_id, get_db_connection, fetch_all_players, fetch_player_by_id
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; will change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)



# ==============================================================================
# GET ROUTES BELOW
# ==============================================================================

# Main Table: Teams
@app.get("/teams", response_model=list[Team])
def get_all_teams():
    """Fetch all teams."""
    teams = fetch_all_teams()
    return [dict(team) for team in teams]

# Fetch team by ID
@app.get("/teams/{team_id}", response_model=Team)
def get_team_by_id(team_id: int):
    """Fetch a team by its ID."""
    team = fetch_team_by_id(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return dict(team)

# Fetch all players for a specific team
@app.get("/teams/{team_id}/players")
def get_players_for_team(team_id: int):
    """Fetch all players for a specific team."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM players WHERE team_id = ?", (team_id,))
    players = cursor.fetchall()
    conn.close()
    return [dict(player) for player in players]

# Sub Table: Players
@app.get("/players")
def get_all_players():
    """Fetch all players."""
    players = fetch_all_players()
    return [dict(player) for player in players]

# Fetch player by ID
@app.get("/players/{player_id}")
def get_player_by_id(player_id: int):
    """Fetch a player by their ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM players WHERE player_id = ?", (player_id,))
    player = cursor.fetchone()
    conn.close()
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return dict(player)

# Fetch team for a specific player
@app.get("/players/{player_id}/team")
def get_player_team(player_id: int):
    """Fetch the team for a specific player."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT t.* FROM teams t
        JOIN players p ON t.team_id = p.team_id
        WHERE p.player_id = ?
        """, (player_id,))
    team = cursor.fetchone()
    conn.close()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return dict(team)



# ==============================================================================
# PUT ROUTES BELOW
# ==============================================================================

@app.put("/teams/{team_id}" , response_model=Team)
def update_team(team_id: int, team: Team_Update):
    """Update an existing team."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE teams SET team_name = ?, titles = ?, mascot = ?, location = ?, venue = ?, general_mgr = ?, head_coach = ?, division = ?, conference = ?, ownership = ?, year_founded = ? WHERE team_id = ?",
        (team.team_name, team.titles, team.mascot, team.location, team.venue, team.general_mgr, team.head_coach, team.division, team.conference, team.ownership, team.year_founded, team_id),
    )
    conn.commit()
    conn.close()
    return {"message": "Team updated successfully"}


@app.put("/players/{player_id}" , response_model=Player)
def update_player(player_id: int, player: Player_Update):
    """Update an existing player."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE players SET team_id = ?, first_name = ?, last_name = ?, birth_date = ?, nationality = ?, position = ?, height = ?, weight = ?, jersey_number = ?, contract_start_year = ?, contract_end_year = ?, salary = ?, college = ?, draft_year = ?, experience = ? WHERE player_id = ?",
        (player.team_id, player.first_name, player.last_name, player.birth_date, player.nationality, player.position, player.height, player.weight, player.jersey_number, player.contract_start_year, player.contract_end_year, player.salary, player.college, player.draft_year, player.experience, player_id),
    )
    conn.commit()
    conn.close()
    return {"message": "Player updated successfully"}


# ==============================================================================
# POST ROUTES BELOW
# ==============================================================================


@app.post("/teams", response_model=Team)
def create_team(team: Team_Create):
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


@app.post("/players" , response_model=Player)
def create_player(player: Player_Create):
    """Create a new player."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO players (team_id, first_name, last_name, birth_date, nationality, position, height, weight, jersey_number, contract_start_year, contract_end_year, salary, college, draft_year, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (player.team_id, player.first_name, player.last_name, player.birth_date, player.nationality, player.position, player.height, player.weight, player.jersey_number, player.contract_start_year, player.contract_end_year, player.salary, player.college, player.draft_year, player.experience),
    )
    conn.commit()
    conn.close()
    return {"message": "Player created successfully"}

# ==============================================================================
# DELETE ROUTES BELOW
# ==============================================================================

@app.delete("/teams/{team_id}")
def delete_team(team_id: int):
    """Delete a team by its ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM teams WHERE team_id = ?", (team_id,))
    conn.commit()
    conn.close()
    return {"message": "Team deleted successfully"}


@app.delete("/players/{player_id}")
def delete_player(player_id: int):
    """Delete a player by their ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM players WHERE player_id = ?", (player_id,))
    conn.commit()
    conn.close()
    return {"message": "Player deleted successfully"}