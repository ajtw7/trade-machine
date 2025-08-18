const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // Teams
  getTeams() {
    return this.request("/teams");
  }

  getTeam(id) {
    return this.request(`/teams/${id}`);
  }

  createTeam(team) {
    return this.request("/teams", {
      method: "POST",
      body: JSON.stringify(team),
    });
  }

  updateTeam(id, team) {
    return this.request(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(team),
    });
  }

  deleteTeam(id) {
    return this.request(`/teams/${id}`, {
      method: "DELETE",
    });
  }

  // Players
  getPlayers() {
    return this.request("/players");
  }

  getPlayer(id) {
    return this.request(`/players/${id}`);
  }

  createPlayer(player) {
    return this.request("/players", {
      method: "POST",
      body: JSON.stringify(player),
    });
  }

  updatePlayer(id, player) {
    return this.request(`/players/${id}`, {
      method: "PUT",
      body: JSON.stringify(player),
    });
  }

  deletePlayer(id) {
    return this.request(`/players/${id}`, {
      method: "DELETE",
    });
  }

  // Trades with localStorage fallback
  async getTrades() {
    try {
      return await this.request("/trades");
    } catch (e) {
      const trades = localStorage.getItem("trades");
      return trades ? JSON.parse(trades) : [];
    }
  }

  async createTrade(trade) {
    try {
      return await this.request("/trades", {
        method: "POST",
        body: JSON.stringify(trade),
      });
    } catch (e) {
      const existing = await this.getTrades();
      const newTrade = {
        ...trade,
        trade_id: Date.now(),
        created_at: new Date().toISOString(),
      };
      const updated = [newTrade, ...existing];
      localStorage.setItem("trades", JSON.stringify(updated));
      return newTrade;
    }
  }
}

export const apiClient = new ApiClient();