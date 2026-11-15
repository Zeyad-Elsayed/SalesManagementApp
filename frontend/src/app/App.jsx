import { Box, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import ConnectivityCheck from '../components/ConnectivityCheck.jsx';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';

export default function App() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, sm: 10 } }}>
      <Stack spacing={4}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <ApartmentOutlinedIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="overline" sx={{ letterSpacing: '0.16em', fontWeight: 700 }}>
            SALES MANAGEMENT APP
          </Typography>
        </Stack>
        <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderColor: 'divider' }}>
          <Stack spacing={3}>
            <Box>
              <Chip icon={<CheckCircleOutlinedIcon />} label="Frontend setup ready" color="primary" variant="outlined" sx={{ mb: 3 }} />
              <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                Sales Management
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 560 }}>
                The frontend workspace is ready. React and Material UI are rendering with a shared theme.
              </Typography>
            </Box>
            <Divider />
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Chip label="React + JavaScript" size="small" />
              <Chip label="Vite" size="small" />
              <Chip label="Material UI" size="small" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Environment setup only. Business screens will be added in a later stage.
            </Typography>
          </Stack>
        </Paper>
        <ConnectivityCheck />
        <Typography variant="caption" color="text.secondary">
          Sales Management · Frontend infrastructure
        </Typography>
      </Stack>
    </Container>
  );
}
