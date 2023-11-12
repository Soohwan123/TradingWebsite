import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandshake } from '@fortawesome/free-solid-svg-icons'
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { Card, 
         CardContent, 
         TextField, 
         Typography,
} from "@mui/material";

import "../App.css";

const LoginComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <Card className="card" style={{ width: '40vw', 
                                            height: '50vh', 
                                            position: 'absolute', 
                                            top: '40%', 
                                            left: '50%', 
                                            transform: 'translate(-50%, -50%)', 
                                            minWidth: 350,
                                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", }}>

                <FontAwesomeIcon icon={faHandshake} style={{ color: theme.palette.primary.main, 
                                                            textAlign: "center", 
                                                            fontSize:90,
                                                            marginTop: 30 }}/> 
                <Typography variant="h3" align="center" style={{ fontWeight: "bold", color: "#454545" }}>
                    Login
                </Typography>
                <p></p>
                <p></p>
                <CardContent>
                    <TextField
                        placeholder="Enter your ID"
                    />

                    <p></p>
                    <TextField
                        placeholder="Enter your password"
                    />
                </CardContent>
            </Card>

        </ThemeProvider>
    );
};
export default LoginComponent;