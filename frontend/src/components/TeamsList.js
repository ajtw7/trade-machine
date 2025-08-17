import React, { useEffect, useState } from 'react';
import { fetchTeams } from '../api/teams_api';

const TeamsList = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const data = await fetchTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    getTeams();
  }, []);

  return (
    <div>
      <h1>Teams</h1>
      <ul>
        {teams.map((team) => (
          <li key={team.team_id}>{team.team_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsList;