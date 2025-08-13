import sqlite3

def initialize_database(db_name="trade_machine.db"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Read schema from file (assuming schema.sql is in the same directory
    with open("schema.sql", "r") as schema_file:
        schema = schema_file.read()

    # Execute the schema to create tables
    cursor.executescript(schema)

    # Commit and close connection
    conn.commit()
    conn.close()

if __name__ == "__main__":
    initialize_database()