CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL UNIQUE, -- Enforce unique team names
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
    height TEXT,
    weight INTEGER,
    jersey_number INTEGER NOT NULL,
    contract_start_year INTEGER NOT NULL,
    contract_end_year INTEGER NOT NULL,
    salary INTEGER NOT NULL,
    college TEXT NOT NULL,
    draft_year INTEGER NOT NULL,
    experience INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    UNIQUE(team_id, first_name, last_name) -- Prevent duplicate players on the same team
);


-- Table to record each trade event -- 
CREATE TABLE IF NOT EXISTS trades (
    trade_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes TEXT
);

-- Table to record each item (player movement) in a trade, supporting multi-team/multi-player trades
CREATE TABLE IF NOT EXISTS trade_items (
    trade_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    trade_id INTEGER NOT NULL,
    from_team_id INTEGER NOT NULL,
    to_team_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    salary INTEGER NOT NULL, -- snapshot of player's salary at trade time
    FOREIGN KEY (trade_id) REFERENCES trades(trade_id),
    FOREIGN KEY (from_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (to_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);