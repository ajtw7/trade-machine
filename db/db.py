"""Database utility functions for the trade machine application."""
import sqlite3

DATABASE = "trade_machine.db"

def get_db_connection():
    """Establish and return a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row # Enable dictionary-like row access
    return conn

def fetch_all_teams():
    """Fetch and return all teams from the database."""
    db_conn = get_db_connection() # Use the helper function to get a connection
    cursor = db_conn.cursor() # Create a cursor object
    cursor.execute("SELECT * FROM teams") # Execute a query
    all_teams = cursor.fetchall() # Fetch all results
    db_conn.close() # Close the connection
    return all_teams # Return the fetched data

def fetch_team_by_id(team_id):
    """Fetch and return a team by its ID from the database."""
    db_conn = get_db_connection()
    cursor = db_conn.cursor()
    cursor.execute("SELECT * FROM teams WHERE team_id = ?", (team_id,))
    single_team = cursor.fetchone()
    db_conn.close()
    return single_team



