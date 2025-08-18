import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PlayersList() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getPlayers();
      setPlayers(data || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStartConfirm = (id) => setConfirmingId(id);
  const handleCancelConfirm = () => setConfirmingId(null);

  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    try {
      await apiClient.deletePlayer(id);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setConfirmingId(null);
    }
  };

  if (loading) {
    return (
      <Box className="panelContent" display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box className="panelContent" p={2}>
        <Typography color="error">Error loading players.</Typography>
      </Box>
    );
  }

  return (
    <Box className="panelContent" p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Players</Typography>
        <Button variant="contained" onClick={() => {/* open add modal (implement later) */}}>
          Add
        </Button>
      </Box>
      <List>
        {players.map((p) => (
          <ListItem
            key={p.player_id}
            divider
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => {/* open edit modal */}}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                {confirmingId === p.player_id ? (
                  <>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleConfirmDelete(p.player_id)}
                      disabled={deleting}
                      variant="outlined"
                    >
                      {deleting ? 'Deleting...' : 'Yes'}
                    </Button>
                    <Button
                      size="small"
                      onClick={handleCancelConfirm}
                      disabled={deleting}
                      variant="outlined"
                    >
                      No
                    </Button>
                  </>
                ) : (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    onClick={() => handleStartConfirm(p.player_id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
            }
          >
            <ListItemText
              primary={`${p.first_name} ${p.last_name} — ${p.position} — #${p.jersey_number}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}