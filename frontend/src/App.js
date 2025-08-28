import { useEffect, useState } from 'react';
import TeamsList from './components/TeamsList';
import PlayersList from './components/PlayersList';
import TradeBuilder from './components/TradeBuilder';
import { apiClient } from './lib/api-client';
import { Box, Card, CardHeader, CardContent, Tabs, Tab, Typography, CircularProgress } from '@mui/material';

function App() {
  const [tab, setTab] = useState(0);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [teamsData, playersData] = await Promise.all([
          apiClient.getTeams(),
          apiClient.getPlayers(),
        ]);
        setTeams(teamsData || []);
        setPlayers(playersData || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="background.default" p={4}>
      <Box maxWidth="900px" mx="auto">
        <Card sx={{ mb: 6 }}>
          <CardHeader
            title={
              <Typography variant="h3" align="center" fontWeight="bold">
                Trade Machine
              </Typography>
            }
          />
        </Card>
        <Card>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Teams" />
            <Tab label="Players" />
            <Tab label="Trade Builder" />
          </Tabs>
          <CardContent>
            {tab === 0 && <TeamsList teams={teams} />}
            {tab === 1 && <PlayersList players={players} teams={teams} />}
            {tab === 2 && <TradeBuilder teams={teams} players={players} />}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default App;