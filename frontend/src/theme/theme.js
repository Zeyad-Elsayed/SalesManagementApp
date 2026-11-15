import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#205b56' },
    secondary: { main: '#b96c35' },
    background: { default: '#f4f6f5', paper: '#ffffff' },
    text: { primary: '#182d2a', secondary: '#596b67' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.04em' },
    h2: { fontSize: '1.25rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default theme;
