import sqlite3
import os

def initialize_database(db_name="trade_machine.db"):
    try:
        # Establish database connection
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        # Get the absolute path of the current script directory
        script_dir = os.path.dirname(os.path.abspath(__file__))

        # Step 1: Read and execute the schema file to create tables
        schema_path = os.path.join(script_dir, "schema.sql")
        with open(schema_path, "r") as schema_file:
            schema = schema_file.read()
        cursor.executescript(schema)

        # Step 2: Read and execute the NFL teams data file to populate the database
        teams_path = os.path.join(script_dir, "nfl_teams.sql")
        with open(teams_path, "r") as teams_file:
            nfl_teams_data = teams_file.read()
        cursor.executescript(nfl_teams_data)

        # Step 3: Read and execute the NFL players data file to populate the database
        players_path = os.path.join(script_dir, "nfl_players.sql")
        with open(players_path, "r") as players_file:
            nfl_players_data = players_file.read()
        cursor.executescript(nfl_players_data)

        # Commit changes and close connection
        conn.commit()
        conn.close()
        print(f"Database '{db_name}' initialized successfully with schema, NFL teams, and NFL players data.")

    except sqlite3.Error as e:
        print(f"An error occurred while initializing the database: {e}")
    except FileNotFoundError as e:
        print(f"File not found: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    initialize_database()