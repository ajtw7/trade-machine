import sqlite3

DATABASE = "trade_machine.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row # Enable dictionary-like row access
    return conn

def fetch_all_teams():
    conn = get_db_connection() # Use the helper function to get a connection
    cursor = conn.cursor() # Create a cursor object
    cursor.execute("SELECT * FROM teams") # Execute a query
    teams = cursor.fetchall() # Fetch all results
    conn.close() # Close the connection
    return teams # Return the fetched data

def fetch_team_by_id(team_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM teams WHERE team_id = ?", (team_id,))
    team = cursor.fetchone()
    conn.close()
    return team