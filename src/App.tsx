import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home'
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import GameBoard from "./board/Board";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: "#eee",
            height: "100%",
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        homeButton: {}
    }),
);

const App: React.FunctionComponent = () => {
    const classes = useStyles();
    return (
        <HashRouter>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            XDean's Game Board
                        </Typography>
                        <IconButton className={classes.homeButton} color="inherit" aria-label="home">
                            <HomeIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route exact path="/">
                        <Redirect to={"/board"}/>
                    </Route>
                    <Route path="/board">
                        <GameBoard/>
                    </Route>
                </Switch>
            </div>
        </HashRouter>
    );
}

export default App