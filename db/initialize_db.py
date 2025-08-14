import sqlite3

def initialize_database(db_name="trade_machine.db"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Read schema from file (assuming schema.sql is in the same directory
    with open("db/schema.sql", "r") as schema_file:
        schema = schema_file.read()

    # Step 2: Read and execute the NFL data file to populate the database
    with open("db/nfl_teams.sql", "r") as data_file:
        nfl_data = data_file.read()
        cursor.executescript(nfl_data)

    # Execute the schema to create tables
    cursor.executescript(schema)

    # Commit and close connection
    conn.commit()
    conn.close()
    print(f"Database '{db_name}' initialized with schema and NFL data.")

if __name__ == "__main__":
    initialize_database()