import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../contexts/auth.context';
import theme from '../theme/theme';

const Header = () => {

    const { logout } = useAuth();


    const onLogout = () => {
        logout();
        window.location.reload(); // Rafraîchir la page
    }

  return (
    <AppBar position="static" style={{ backgroundColor: theme.palette.background.default, padding: '20px' }}>
      <Toolbar>
        <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
Netflex        </Typography>
        <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={onLogout}>
          Déconnexion
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
