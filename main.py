from typing import List
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models import Player, Player_Create, Player_Update, Team, Team_Create, Team_Update, Trade, Trade_Create, Trade_Update
from db.db import fetch_all_teams, fetch_team_by_id, get_db_connection, fetch_all_players

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

# Get all players by position
@app.get("/players/position/{position}")
def get_players_by_position(position:str):
    """Fetch all players by position."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM players WHERE position = ?", (position,))
    players = cursor.fetchall()
    conn.close()
    return [dict(player) for player in players]

# Get all team by conference
@app.get("/teams/conference/{conference}", response_model=list[Team])
def get_teams_by_conference(conference:str):
    """Fetch all teams by conference."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM teams WHERE TRIM(LOWER(conference)) = TRIM(LOWER(?))", (conference,))
    teams = cursor.fetchall()
    conn.close()
    return [dict(team) for team in teams]

# Get all teams by division
@app.get("/teams/conference/{conference}/division/{division}", response_model=list[Team])
def get_teams_by_conference_and_division(conference: str, division: str):
    """Fetch all teams by conference and division."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM teams WHERE TRIM(LOWER(conference)) = TRIM(LOWER(?)) AND TRIM(LOWER(division)) = TRIM(LOWER(?))",
        (conference, division)
    )
    teams = cursor.fetchall()
    conn.close()
    return [dict(team) for team in teams]


@app.get("/trades", response_model=List[Trade])
def get_all_trades():
    """Fetch all trades with their associated trade items."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trades")
    trades = cursor.fetchall()
    result = []
    for trade in trades:
        cursor.execute("SELECT * FROM trade_items WHERE trade_id = ?", (trade["trade_id"],))
        items = cursor.fetchall()
        trade_dict = dict(trade)
        trade_dict["items"] = [dict(item) for item in items]
        result.append(trade_dict)
    conn.close()
    return result

# Fetch a trade and its items by trade ID
@app.get("/trades/{trade_id}", response_model=Trade)
def get_trade_by_id(trade_id: int):
    """Fetch a trade and its items by trade ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trades WHERE trade_id = ?", (trade_id,))
    trade = cursor.fetchone()
    if not trade:
        conn.close()
        raise HTTPException(status_code=404, detail="Trade not found")
    cursor.execute("SELECT * FROM trade_items WHERE trade_id = ?", (trade_id,))
    items = cursor.fetchall()
    conn.close()
    trade_dict = dict(trade)
    trade_dict["items"] = [dict(item) for item in items]
    return trade_dict



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
    cursor.execute("SELECT * FROM teams WHERE team_id = ?", (team_id,))
    updated_team = cursor.fetchone()
    conn.close()
    return dict(updated_team) if updated_team else None


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
    cursor.execute("SELECT * FROM players WHERE player_id = ?", (player_id,))
    updated_player = cursor.fetchone()
    conn.close()
    return dict(updated_player) if updated_player else None


@app.put("/trades/{trade_id}", response_model=Trade)
def update_trade(trade_id: int, trade: Trade_Update):
    """Update a trade's status or notes."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trades WHERE trade_id = ?", (trade_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Trade not found")
    # Only allow updating status and notes for now
    cursor.execute(
        "UPDATE trades SET status = ?, notes = ? WHERE trade_id = ?",
        (trade.status or existing["status"], trade.notes or existing["notes"], trade_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM trades WHERE trade_id = ?", (trade_id,))
    updated = cursor.fetchone()
    cursor.execute("SELECT * FROM trade_items WHERE trade_id = ?", (trade_id,))
    items = cursor.fetchall()
    conn.close()
    trade_dict = dict(updated)
    trade_dict["items"] = [dict(item) for item in items]
    return trade_dict

# ==============================================================================
# POST ROUTES BELOW
# ==============================================================================


@app.post("/teams", response_model=Team)
def create_team(team: Team_Create):
    """Create a new team."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO teams (team_name, titles, mascot, location, venue, general_mgr, head_coach, division, conference, ownership, year_founded, salary_cap_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (team.team_name, team.titles, team.mascot, team.location, team.venue, team.general_mgr, team.head_coach, team.division, team.conference, team.ownership, team.year_founded, 100_000_000), 
    )
    conn.commit()
    team_id = cursor.lastrowid
    cursor.execute("SELECT * FROM teams WHERE team_id = ?", (team_id,))
    team = cursor.fetchone()
    conn.close()
    return dict(team) if team else None


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
    player_id = cursor.lastrowid
    cursor.execute("SELECT * FROM players WHERE player_id = ?", (player_id,))
    new_player = cursor.fetchone()
    conn.close()
    return dict(new_player) if new_player else None


# TRADE ROUTES BELOW
@app.post("/trades", response_model=Trade)
def create_trade(trade: Trade_Create = Body(...)):
    """Create a new trade with associated trade items, enforce salary cap, and update teams/players."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Calculate salary changes for each team
    team_salary_changes = {}
    for item in trade.items:
        # Subtract salary from from_team, add to_team
        team_salary_changes.setdefault(item.from_team_id, 0)
        team_salary_changes.setdefault(item.to_team_id, 0)
        team_salary_changes[item.from_team_id] -= item.salary
        team_salary_changes[item.to_team_id] += item.salary

    # 2. Check salary cap for all teams involved
    for team_id, change in team_salary_changes.items():
        cursor.execute("SELECT salary_cap_remaining FROM teams WHERE team_id = ?", (team_id,))
        row = cursor.fetchone()
        if row is None:
            conn.close()
            raise HTTPException(status_code=400, detail=f"Team {team_id} not found")
        new_cap = row["salary_cap_remaining"] - change
        if new_cap < 0 or new_cap > 100_000_000:
            conn.close()
            raise HTTPException(status_code=400, detail=f"Trade would exceed salary cap for team {team_id}")

    # 3. Insert trade
    cursor.execute(
        "INSERT INTO trades (date, status, notes) VALUES (?, ?, ?)",
        (trade.date.isoformat(), trade.status, getattr(trade, "notes", None))
    )
    trade_id = cursor.lastrowid
    items = []
    for item in (trade.items or []):
        cursor.execute(
            "INSERT INTO trade_items (trade_id, from_team_id, to_team_id, player_id, salary) VALUES (?, ?, ?, ?, ?)",
            (trade_id, item.from_team_id, item.to_team_id, item.player_id, item.salary)
        )
        items.append({
            "trade_item_id": cursor.lastrowid,
            "trade_id": trade_id,
            "from_team_id": item.from_team_id,
            "to_team_id": item.to_team_id,
            "player_id": item.player_id,
            "salary": item.salary
        })
        # 4. Update player's team_id
        cursor.execute(
            "UPDATE players SET team_id = ? WHERE player_id = ?",
            (item.to_team_id, item.player_id)
        )

    # 5. Update salary cap for each team
    for team_id, change in team_salary_changes.items():
        cursor.execute(
            "UPDATE teams SET salary_cap_remaining = salary_cap_remaining - ? WHERE team_id = ?",
            (change, team_id)
        )

    conn.commit()
    conn.close()
    return {
        "trade_id": trade_id,
        "date": trade.date,
        "status": trade.status,
        "notes": getattr(trade, "notes", None),
        "items": items
    }

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
    # Fetch player before deleting for return
    cursor.execute("SELECT * FROM players WHERE player_id = ?", (player_id,))
    player = cursor.fetchone()
    cursor.execute("DELETE FROM players WHERE player_id = ?", (player_id,))
    conn.commit()
    conn.close()
    return dict(player) if player else None


@app.delete("/trades/{trade_id}")
def delete_trade(trade_id: int):
    """Delete a trade and its items by trade ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM trade_items WHERE trade_id = ?", (trade_id,))
    cursor.execute("DELETE FROM trades WHERE trade_id = ?", (trade_id,))
    conn.commit()
    conn.close()
    return {"message": "Trade deleted successfully"}


# Comments for PR