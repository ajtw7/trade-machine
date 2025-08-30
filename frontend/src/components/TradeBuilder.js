import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Paper,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { apiClient } from '../lib/api-client';

export default function TradeBuilder({ teams = [], players = [] }) {
  const [tradeData, setTradeData] = useState({
    team1_id: '',
    team2_id: '',
    player1_id: '',
    player2_id: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getPlayersForTeam = (teamId) => {
    if (!teamId) return [];
    return players.filter((player) => player.team_id === Number.parseInt(teamId));
  };

  const getTeamName = (teamId) => {
    if (!teamId) return '';
    const team = teams.find((t) => (t.id ?? t.team_id) === Number.parseInt(teamId));
    return team
      ? `${team.city || ''} ${team.name || team.team_name || ''}`.trim()
      : '';
  };

  const getPlayerName = (playerId) => {
    if (!playerId) return '';
    const player = players.find((p) => (p.id ?? p.player_id) === Number.parseInt(playerId));
    return player
      ? `${player.name || `${player.first_name} ${player.last_name}`} (${player.position})`
      : '';
  };

  const handleChange = (field, value) => {
    setTradeData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'team1_id' ? { player1_id: '' } : {}),
      ...(field === 'team2_id' ? { player2_id: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!tradeData.team1_id || !tradeData.team2_id) {
      setError('Please select both teams');
      return;
    }
    if (tradeData.team1_id === tradeData.team2_id) {
      setError('Please select two different teams');
      return;
    }
    if (!tradeData.player1_id || !tradeData.player2_id) {
      setError('Please select one player from each team');
      return;
    }

    setSubmitting(true);
    try {
      // Build the payload as expected by your backend
      const payload = {
        date: new Date().toISOString().slice(0, 10),
        status: "completed",
        notes: "",
        items: [
          {
            from_team_id: Number(tradeData.team1_id),
            to_team_id: Number(tradeData.team2_id),
            player_id: Number(tradeData.player1_id),
            salary: Number(
              players.find(
                (p) => String(p.player_id ?? p.id) === tradeData.player1_id
              )?.salary ?? 0
            ),
          },
          {
            from_team_id: Number(tradeData.team2_id),
            to_team_id: Number(tradeData.team1_id),
            player_id: Number(tradeData.player2_id),
            salary: Number(
              players.find(
                (p) => String(p.player_id ?? p.id) === tradeData.player2_id
              )?.salary ?? 0
            ),
          },
        ],
      };

      // POST to your backend
      await apiClient.createTrade(payload);
      setSuccess("Trade submitted successfully!");
      setTradeData({
        team1_id: "",
        team2_id: "",
        player1_id: "",
        player2_id: "",
      });
    } catch (e) {
      setError(e.message || "Failed to submit trade");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5">Trade Builder</Typography>}
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            alignItems="center"
            justifyContent="center"
            mb={4}
          >
            {/* Team 1 */}
            <Stack spacing={2} flex={1}>
              <FormControl fullWidth>
                <InputLabel id="team1-label">Team 1</InputLabel>
                <Select
                  labelId="team1-label"
                  value={tradeData.team1_id}
                  label="Team 1"
                  onChange={(e) => handleChange('team1_id', e.target.value)}
                >
                  {teams
                    .filter((team) => team && (team.id !== undefined || team.team_id !== undefined))
                    .map((team) => {
                      const id = team.id ?? team.team_id;
                      const name = `${team.city || ''} ${team.name || team.team_name || ''}`.trim();
                      return (
                        <MenuItem
                          key={id}
                          value={id.toString()}
                          disabled={id.toString() === tradeData.team2_id}
                        >
                          {name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={!tradeData.team1_id}>
                <InputLabel id="player1-label">Player from Team 1</InputLabel>
                <Select
                  labelId="player1-label"
                  value={tradeData.player1_id}
                  label="Player from Team 1"
                  onChange={(e) => handleChange('player1_id', e.target.value)}
                >
                  {getPlayersForTeam(tradeData.team1_id).map((player) => {
                    const id = player.id ?? player.player_id;
                    const name = player.name || `${player.first_name} ${player.last_name}`;
                    return (
                      <MenuItem key={id} value={id.toString()}>
                        {name} ({player.position})
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {tradeData.team1_id && tradeData.player1_id && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography fontWeight="bold">{getTeamName(tradeData.team1_id)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trading: {getPlayerName(tradeData.player1_id)}
                  </Typography>
                </Paper>
              )}
            </Stack>

            {/* Trade Arrow */}
            <Box display="flex" alignItems="center" justifyContent="center">
              <SwapHorizIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Box>

            {/* Team 2 */}
            <Stack spacing={2} flex={1}>
              <FormControl fullWidth>
                <InputLabel id="team2-label">Team 2</InputLabel>
                <Select
                  labelId="team2-label"
                  value={tradeData.team2_id}
                  label="Team 2"
                  onChange={(e) => handleChange('team2_id', e.target.value)}
                >
                  {teams
                    .filter((team) => team && (team.id !== undefined || team.team_id !== undefined))
                    .map((team) => {
                      const id = team.id ?? team.team_id;
                      const name = `${team.city || ''} ${team.name || team.team_name || ''}`.trim();
                      return (
                        <MenuItem
                          key={id}
                          value={id.toString()}
                          disabled={id.toString() === tradeData.team1_id}
                        >
                          {name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={!tradeData.team2_id}>
                <InputLabel id="player2-label">Player from Team 2</InputLabel>
                <Select
                  labelId="player2-label"
                  value={tradeData.player2_id}
                  label="Player from Team 2"
                  onChange={(e) => handleChange('player2_id', e.target.value)}
                >
                  {getPlayersForTeam(tradeData.team2_id).map((player) => {
                    const id = player.id ?? player.player_id;
                    const name = player.name || `${player.first_name} ${player.last_name}`;
                    return (
                      <MenuItem key={id} value={id.toString()}>
                        {name} ({player.position})
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {tradeData.team2_id && tradeData.player2_id && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography fontWeight="bold">{getTeamName(tradeData.team2_id)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trading: {getPlayerName(tradeData.player2_id)}
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Stack>

          {error && (
            <Typography color="error" align="center" mb={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" align="center" mb={2}>
              {success}
            </Typography>
          )}

          <Box display="flex" justifyContent="center" pt={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={
                submitting ||
                !tradeData.team1_id ||
                !tradeData.team2_id ||
                !tradeData.player1_id ||
                !tradeData.player2_id
              }
            >
              {submitting ? 'Submitting...' : 'Submit Trade'}
            </Button>
          </Box>
        </form>

        {teams.length === 0 && (
          <Typography align="center" py={4} color="text.secondary">
            No teams available. Please add teams first to create trades.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}