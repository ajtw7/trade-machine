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
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

// Adjust these fields to match your Player model (see schema.sql)
const PLAYER_FIELDS = [
  { name: 'team_id', label: 'Team', required: true, type: 'select' },
  { name: 'first_name', label: 'First Name', required: true },
  { name: 'last_name', label: 'Last Name', required: true },
  { name: 'birth_date', label: 'Birth Date', required: true },
  { name: 'nationality', label: 'Nationality', required: true },
  { name: 'position', label: 'Position', required: true },
  { name: 'height', label: 'Height', required: false },
  { name: 'weight', label: 'Weight', required: false, type: 'number' },
  { name: 'jersey_number', label: 'Jersey Number', required: true, type: 'number' },
  { name: 'contract_start_year', label: 'Contract Start Year', required: true, type: 'number' },
  { name: 'contract_end_year', label: 'Contract End Year', required: true, type: 'number' },
  { name: 'salary', label: 'Salary', required: true, type: 'number' },
  { name: 'college', label: 'College', required: true },
  { name: 'draft_year', label: 'Draft Year', required: true, type: 'number' },
  { name: 'experience', label: 'Experience', required: true, type: 'number' },
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

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    try {
      await apiClient.deletePlayer(id);
      await load();
      showSnackbar('Player deleted successfully!', 'success');
    } catch (e) {
      showSnackbar('Failed to delete player.', 'error');
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

  // Edit Player Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(
    PLAYER_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [editId, setEditId] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddSubmitting(true);
    setAddError('');
    // Validate required fields
    for (const field of PLAYER_FIELDS) {
      if (field.required && !String(addForm[field.name]).trim()) {
        setAddError(`"${field.label}" is required.`);
        setAddSubmitting(false);
        return;
      }
    }
    try {
      await apiClient.createPlayer({
        ...addForm,
        team_id: addForm.team_id ? Number(addForm.team_id) : undefined,
        weight: addForm.weight ? Number(addForm.weight) : undefined,
        jersey_number: addForm.jersey_number ? Number(addForm.jersey_number) : undefined,
        contract_start_year: addForm.contract_start_year ? Number(addForm.contract_start_year) : undefined,
        contract_end_year: addForm.contract_end_year ? Number(addForm.contract_end_year) : undefined,
        salary: addForm.salary ? Number(addForm.salary) : undefined,
        draft_year: addForm.draft_year ? Number(addForm.draft_year) : undefined,
        experience: addForm.experience ? Number(addForm.experience) : undefined,
      });
      setAddOpen(false);
      await load();
      showSnackbar('Player created successfully!', 'success');
    } catch (err) {
      setAddError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to add player.'
      );
      showSnackbar('Failed to add player.', 'error');
    } finally {
      setAddSubmitting(false);
    }
  };

  // Edit Player Handlers
  const handleEditOpen = (player) => {
    setEditForm(player);
    setEditId(player.player_id);
    setEditError('');
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError('');
    for (const field of PLAYER_FIELDS) {
      if (field.required && !String(editForm[field.name]).trim()) {
        setEditError(`"${field.label}" is required.`);
        setEditSubmitting(false);
        return;
      }
    }
    try {
      await apiClient.updatePlayer(editId, {
        ...editForm,
        team_id: editForm.team_id ? Number(editForm.team_id) : undefined,
        weight: editForm.weight ? Number(editForm.weight) : undefined,
        jersey_number: editForm.jersey_number ? Number(editForm.jersey_number) : undefined,
        contract_start_year: editForm.contract_start_year ? Number(editForm.contract_start_year) : undefined,
        contract_end_year: editForm.contract_end_year ? Number(editForm.contract_end_year) : undefined,
        salary: editForm.salary ? Number(editForm.salary) : undefined,
        draft_year: editForm.draft_year ? Number(editForm.draft_year) : undefined,
        experience: editForm.experience ? Number(editForm.experience) : undefined,
      });
      setEditOpen(false);
      await load();
      showSnackbar('Player updated successfully!', 'success');
    } catch (err) {
      setEditError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update player.'
      );
      showSnackbar('Failed to update player.', 'error');
    } finally {
      setEditSubmitting(false);
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
                  onClick={() => handleEditOpen(p)}
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
                  label={field.label}
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
                  label={field.label}
                  name={field.name}
                  value={addForm[field.name]}
                  onChange={handleAddChange}
                  fullWidth
                  required={field.required}
                  type={field.type === 'number' ? 'number' : 'text'}
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

      {/* Edit Player Modal */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Player</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ minWidth: 320 }}>
            {PLAYER_FIELDS.map((field) =>
              field.type === 'select' ? (
                <TextField
                  key={field.name}
                  select
                  margin="dense"
                  label={field.label}
                  name={field.name}
                  value={editForm[field.name]}
                  onChange={handleEditChange}
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
                  label={field.label}
                  name={field.name}
                  value={editForm[field.name]}
                  onChange={handleEditChange}
                  fullWidth
                  required={field.required}
                  type={field.type === 'number' ? 'number' : 'text'}
                />
              )
            )}
            {editError && (
              <Typography color="error" variant="body2" mt={1}>
                {editError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} disabled={editSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={editSubmitting}>
              {editSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}