import { useEffect, useState } from 'react';
import { fetchPlayers } from '../api/players_api';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadPlayers = async () => {
      try {
        const data = await fetchPlayers();
        if (mounted) setPlayers(data);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPlayers();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>Error loading players.</div>;

  return (
    <div className="panelContent">
      <h2>Players</h2>
      <ul>
        {players.map((p) => (
          <li key={p.player_id}>
            {p.first_name} {p.last_name} — {p.position} — #{p.jersey_number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersList;
