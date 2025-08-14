

CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL,
    titles INTEGER NOT NULL,
    mascot TEXT NOT NULL,
    location TEXT NOT NULL,
    venue TEXT NOT NULL,
    general_mgr TEXT NOT NULL,
    head_coach TEXT NOT NULL,
    division TEXT NOT NULL,
    conference TEXT NOT NULL,
    ownership TEXT NOT NULL,
    year_founded INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    nationality TEXT NOT NULL,
    position TEXT NOT NULL,
    height TEXT NOT NULL,
    weight INTEGER NOT NULL,
    jersey_number INTEGER NOT NULL,
    contract_start_year INTEGER NOT NULL,
    contract_end_year INTEGER NOT NULL,
    salary INTEGER NOT NULL,
    college TEXT NOT NULL,
    draft_year INTEGER NOT NULL,
    experience INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);