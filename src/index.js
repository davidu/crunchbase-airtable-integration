import React from "react";
import { render } from "react-dom";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from "./app";
import "./styles/main.scss";

const Main = () => {
    return (
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <App />
        </MuiThemeProvider>
    );
}

render(<Main />, document.getElementById('root'));