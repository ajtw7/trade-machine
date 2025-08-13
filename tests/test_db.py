from ..db import fetch_all_teams, fetch_team_by_id

def test_fetch_all_teams():
    teams = fetch_all_teams()
    print("All Teams:", teams)
    # assert teams is not None
    # assert len(teams) > 0
    # for team in teams:
    #     assert "team_id" in team
    #     assert "name" in team

def test_fetch_team_by_id():
    team_id = 1  # Replace with an actual team_id from your database
    team = fetch_team_by_id(team_id)
    print(f"Team with ID {team_id}:", team)

if __name__ == "__main__":
    print("Testing fetch_all_teams:")
    test_fetch_all_teams()

    print("\nTesting fetch_team_by_id:")
    test_fetch_team_by_id()


