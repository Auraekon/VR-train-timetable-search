import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import styles from './Header.css';
import text from 'texts/fi';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#689f38',
    },
    secondary: pink,
  },
});

export default () => {
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className="mk" style={styles.headerText}>
              {text['header.mainPage']}
            </Typography>
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    </div>
  );
};