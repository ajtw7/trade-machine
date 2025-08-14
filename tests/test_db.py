from db.db import fetch_all_teams, fetch_team_by_id
import os

def print_teams(teams):
    print("Teams:", [dict(team) for team in teams])

def test_fetch_all_teams():
    teams = fetch_all_teams()
    print_teams(teams)

def test_fetch_team_by_id(team_id):
    team = fetch_team_by_id(team_id)
    print("Team:", [dict(team)])

def main():
    print("Current Working Directory:", os.getcwd())
    print("Testing fetch_all_teams:")
    test_fetch_all_teams()
    print("\nTesting fetch_team_by_id:")
    test_fetch_team_by_id(1)  # Replace 1 with a valid team_id

if __name__ == "__main__":
    main()
