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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Adjust these fields to match your Player model
const PLAYER_FIELDS = [
  { name: 'first_name', label: 'First Name', required: true },
  { name: 'last_name', label: 'Last Name', required: true },
  { name: 'position', label: 'Position', required: true },
  { name: 'jersey_number', label: 'Jersey Number', required: true },
  { name: 'team_id', label: 'Team', required: true, type: 'select' },
  // Add more fields as needed
];

export default function PlayersList({ players: playersProp = [], teams = [] }) {
  const [players, setPlayers] = useState(playersProp || []);
  const [loading, setLoading] = useState(!playersProp.length);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Add Player Modal State
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(
    PLAYER_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

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

  useEffect(() => {
    if (!playersProp.length) load();
  }, [playersProp]);

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

  // Add Player Handlers
  const handleAddOpen = () => {
    setAddForm(PLAYER_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    setAddError('');
    setAddOpen(true);
  };
  const handleAddClose = () => setAddOpen(false);

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddSubmitting(true);
    setAddError('');
    // Validate required fields
    for (const field of PLAYER_FIELDS) {
      if (field.required && !addForm[field.name].toString().trim()) {
        setAddError(`"${field.label}" is required.`);
        setAddSubmitting(false);
        return;
      }
    }
    try {
      await apiClient.createPlayer({
        ...addForm,
        jersey_number: addForm.jersey_number ? Number(addForm.jersey_number) : undefined,
        team_id: addForm.team_id ? Number(addForm.team_id) : undefined,
      });
      setAddOpen(false);
      await load();
    } catch (err) {
      setAddError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to add player.'
      );
    } finally {
      setAddSubmitting(false);
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
        <Button variant="contained" onClick={handleAddOpen}>
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

      {/* Add Player Modal */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Player</DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent sx={{ minWidth: 320 }}>
            {PLAYER_FIELDS.map((field) =>
              field.type === 'select' ? (
                <TextField
                  key={field.name}
                  select
                  margin="dense"
                  label={field.label + (field.required ? ' *' : '')}
                  name={field.name}
                  value={addForm[field.name]}
                  onChange={handleAddChange}
                  fullWidth
                  required={field.required}
                >
                  {teams.map((team) => (
                    <MenuItem key={team.team_id || team.id} value={team.team_id || team.id}>
                      {team.team_name || team.name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  key={field.name}
                  margin="dense"
                  label={field.label + (field.required ? ' *' : '')}
                  name={field.name}
                  value={addForm[field.name]}
                  onChange={handleAddChange}
                  fullWidth
                  required={field.required}
                  type={field.name === 'jersey_number' ? 'number' : 'text'}
                />
              )
            )}
            {addError && (
              <Typography color="error" variant="body2" mt={1}>
                {addError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} disabled={addSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={addSubmitting}>
              {addSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}