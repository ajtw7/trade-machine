import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api-client';

// Adjust these fields to match your Team model
const TEAM_FIELDS = [
  { name: 'team_name', label: 'Team Name', required: true },
  { name: 'titles', label: 'Titles', required: true },
  { name: 'mascot', label: 'Mascot', required: true },
  { name: 'location', label: 'Location', required: true },
  { name: 'venue', label: 'Venue', required: true },
  { name: 'general_mgr', label: 'General Manager', required: true },
  { name: 'head_coach', label: 'Head Coach', required: true },
  { name: 'division', label: 'Division', required: true },
  { name: 'conference', label: 'Conference', required: true },
  { name: 'ownership', label: 'Ownership', required: true },
  { name: 'year_founded', label: 'Year Founded', required: false },
];

export default function TeamsList({ teams: teamsProp }) {
  const [teams, setTeams] = useState(teamsProp || []);
  const [loading, setLoading] = useState(!teamsProp);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Add Team Modal State
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(
    TEAM_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit Team Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(
    TEAM_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [editId, setEditId] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getTeams();
      setTeams(data || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!teamsProp) load();
  }, [teamsProp]);

  const handleStartConfirm = (id) => setConfirmingId(id);
  const handleCancelConfirm = () => setConfirmingId(null);

  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    try {
      await apiClient.deleteTeam(id);
      await load();
      showSnackbar('Team deleted successfully!', 'success');
    } catch (e) {
      showSnackbar('Failed to delete team.', 'error');
      console.error(e);
    } finally {
      setDeleting(false);
      setConfirmingId(null);
    }
  };

  // Add Team Handlers
  const handleAddOpen = () => {
    setAddForm(TEAM_FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
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
    for (const field of TEAM_FIELDS) {
      if (field.required && !String(addForm[field.name]).trim()) {
        setAddError(`"${field.label}" is required.`);
        setAddSubmitting(false);
        return;
      }
    }
    try {
      await apiClient.createTeam({
        ...addForm,
        titles: addForm.titles ? Number(addForm.titles) : 0,
        year_founded: addForm.year_founded ? Number(addForm.year_founded) : 0,
      });
      setAddOpen(false);
      await load();
      showSnackbar('Team created successfully!', 'success');
    } catch (err) {
      setAddError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to add team.'
      );
      showSnackbar('Failed to add team.', 'error');
    } finally {
      setAddSubmitting(false);
    }
  };

  // Edit Team Handlers
  const handleEditOpen = (team) => {
    setEditForm(team);
    setEditId(team.team_id); // <-- Set the editId here!
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
    // Validate required fields
    for (const field of TEAM_FIELDS) {
      if (field.required && !String(editForm[field.name]).trim()) {
        setEditError(`"${field.label}" is required.`);
        setEditSubmitting(false);
        return;
      }
    }
    try {
      await apiClient.updateTeam(editId, {
        ...editForm,
        titles: editForm.titles ? Number(editForm.titles) : 0,
        year_founded: editForm.year_founded ? Number(editForm.year_founded) : 0,
      });
      setEditOpen(false);
      await load();
      showSnackbar('Team updated successfully!', 'success');
    } catch (err) {
      setEditError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update team.'
      );
      showSnackbar('Failed to update team.', 'error');
    } finally {
      setEditSubmitting(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
        <Typography color="error">Error loading teams.</Typography>
      </Box>
    );
  }

  return (
    <Box className="panelContent" p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Teams</Typography>
        <Button variant="contained" onClick={handleAddOpen}>
          Add
        </Button>
      </Box>
      <List>
        {teams.map((t) => (
          <ListItem
            key={t.team_id}
            divider
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditOpen(t)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                {confirmingId === t.team_id ? (
                  <>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleConfirmDelete(t.team_id)}
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
                    onClick={() => handleStartConfirm(t.team_id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
            }
          >
            <ListItemText primary={t.team_name} />
          </ListItem>
        ))}
      </List>

      {/* Add Team Modal */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Team</DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent sx={{ minWidth: 320 }}>
            {TEAM_FIELDS.map((field) => (
              <TextField
                key={field.name}
                margin="dense"
                label={
                  field.label
                }
                name={field.name}
                value={addForm[field.name]}
                onChange={handleAddChange}
                fullWidth
                required={field.required}
                type={field.name === 'founded' ? 'number' : 'text'}
              />
            ))}
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

      {/* Edit Team Modal */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Team</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ minWidth: 320 }}>
            {TEAM_FIELDS.map((field) => (
              <TextField
                key={field.name}
                margin="dense"
                label={
                  field.label
                }
                name={field.name}
                value={editForm[field.name]}
                onChange={handleEditChange}
                fullWidth
                required={field.required}
                type={field.name === 'founded' ? 'number' : 'text'}
              />
            ))}
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