import React, { useState } from 'react';
import TeamsList from './components/TeamsList';
import PlayersList from './components/PlayersList';
import { Box, Card, CardHeader, CardContent, Tabs, Tab, Typography } from '@mui/material';

function App() {
  const [tab, setTab] = useState(0);

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
            {/* Add more tabs as needed */}
          </Tabs>
          <CardContent>
            {tab === 0 && <TeamsList />}
            {tab === 1 && <PlayersList />}
            {/* Add more tab panels as needed */}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default App;