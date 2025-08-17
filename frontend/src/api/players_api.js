import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Root URL of the backend API

// Fetch all players
export const fetchPlayers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/players`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

// Fetch a player by ID
export const fetchPlayerById = async (playerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/players/${playerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player with ID ${playerId}:`, error);
    throw error;
  }
};