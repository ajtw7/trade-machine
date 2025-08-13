
from pydantic import BaseModel, Field
from typing import Optional


class Team(BaseModel):
    team_id: Optional[int] = Field(default=None, description="The unique identifier for the team")
    team_name: str = Field(..., description="The name of the team")
    mascot: str = Field(..., description="The mascot of the team")
    location: str = Field(..., description="The location of the team")
    venue: str = Field(..., description="The venue of the team")
    general_mgr: str = Field(..., description="The general manager of the team")
    head_coach: str = Field(..., description="The head coach of the team")
    titles: int = Field(..., description="The number of titles won by the team")
    division: str = Field(..., description="The division of the team")
    conference: str = Field(..., description="The conference of the team")
    ownership: str = Field(..., description="The ownership of the team")
    year_founded: int = Field(..., description="The year the team was founded")


class Player(BaseModel):
    player_id: Optional[int] = Field(default=None, description="The unique identifier for the player")
    team_id: int = Field(..., description="The identifier of the team the player belongs to")
    first_name: str = Field(..., description="The first name of the player")
    last_name: str = Field(..., description="The last name of the player")
    birth_date: str = Field(..., description="The birth date of the player in YYYY-MM-DD format")
    nationality: str = Field(..., description="The nationality of the player")
    position: str = Field(..., description="The position of the player")
    height: str = Field(..., description="The height of the player")
    weight: int = Field(..., description="The weight of the player in pounds")
    jersey_number: int = Field(..., description="The jersey number of the player")
    contract_start_year: int = Field(..., description="The contract start year of the player")
    contract_end_year: int = Field(..., description="The contract end year of the player")
    salary: int = Field(..., description="The salary of the player")
    college: str = Field(..., description="The college the player attended")
    draft_year: int = Field(..., description="The draft year of the player")
    experience: int = Field(..., description="The number of years of experience the player has")



