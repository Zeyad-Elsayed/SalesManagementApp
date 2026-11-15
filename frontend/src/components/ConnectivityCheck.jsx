import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';

export default function ConnectivityCheck() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function checkConnection() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/projects', { signal: AbortSignal.timeout(10000) });
      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}. Check the backend logs.`);
      }
      const payload = await response.json();
      if (!Array.isArray(payload.data)) {
        throw new Error('The API returned an unexpected response: expected a data array.');
      }
      setResult({ status: response.status, payload });
    } catch (requestError) {
      setError(requestError.name === 'TimeoutError'
        ? 'The request timed out. Check that the backend and database are running.'
        : requestError.message || 'Unable to reach the API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h2">Connection check</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Run a read-only request to verify the frontend can reach the existing API.
          </Typography>
        </Box>
        <Button variant="contained" onClick={checkConnection} disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SyncOutlinedIcon />}
          sx={{ alignSelf: 'flex-start' }}>
          {loading ? 'Checking connection…' : 'Test API connection'}
        </Button>
        <Box aria-live="polite" aria-busy={loading}>
          {!loading && !result && !error && (
            <Typography variant="body2" color="text.secondary">Ready to test. No request has been sent.</Typography>
          )}
          {loading && <Typography variant="body2">Requesting /api/projects…</Typography>}
          {error && <Alert severity="error">{error}</Alert>}
          {result && (
            <Stack spacing={2}>
              <Alert severity="success">
                HTTP {result.status} · API connected · {result.payload.data.length} projects received.
              </Alert>
              <Box component="pre" aria-label="API JSON response" sx={{ m: 0, p: 2, bgcolor: 'background.default', borderRadius: 1, overflow: 'auto', maxHeight: 220, fontSize: '0.8rem' }}>
                {JSON.stringify(result.payload, null, 2)}
              </Box>
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
