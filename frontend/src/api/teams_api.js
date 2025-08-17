import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Replace with your backend URL

// Fetch all teams
export const fetchTeams = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/teams`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// Fetch a team by ID
export const fetchTeamById = async (teamId) => {
  try {
    const response = await axios.get(`${BASE_URL}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team with ID ${teamId}:`, error);
    throw error;
  }
};