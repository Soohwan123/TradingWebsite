import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandshake } from '@fortawesome/free-solid-svg-icons'
import { Routes, Route, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import {
    Toolbar,
    AppBar,
    Menu,
    MenuItem,
    IconButton,
    Typography,
    Link
} from "@mui/material";
import LoginComponent from "./components/LoginComponent";
import MainpageComponent from "./components/MainpageComponent";

const Footer = () => {
    return (
      <AppBar position="fixed" style={{ top: "auto", bottom: 0, backgroundColor: '#686A6C' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6" color="inherit" style={{ fontSize: 14, textAlign: 'right' }}>
             &copy;HES Software Company
          </Typography>
        </Toolbar>
      </AppBar>
    );
};


const styles = {
    toolbar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    typography: {
        marginRight: '5rem'
    }
  };
  
  const App = () => {
    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <ThemeProvider theme={theme}>
            <AppBar>
                <Toolbar style={styles.toolbar}>

                    <Typography component={NavLink} to="/" variant="h6" color="inherit" textAlign={"left"} style={{fontSize:27, ...styles.typography}}>
                        <FontAwesomeIcon  icon={faHandshake} /> sprinTCompass
                    </Typography>
   
                    <div className="menu-items">
                        <MenuItem style={{fontWeight: 'bold'}} component={NavLink} to="/home">
                        Home
                        </MenuItem>
                        <MenuItem style={{fontWeight: 'bold'}} component={NavLink} to="/login">
                        Login
                        </MenuItem>
                    </div>

                    <IconButton
                        id="menubtn"
                        onClick={handleClick}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem component={NavLink} to="/home" onClick={handleClose}>
                        Home
                        </MenuItem>
                        <MenuItem component={NavLink} to="/login" onClick={handleClose}>
                        Login
                        </MenuItem>
                    </Menu>
                </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<MainpageComponent />} />
          <Route path="/home" element={<MainpageComponent />} />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
  
        <Footer />
      </ThemeProvider>
    );
};
  
export default App;
