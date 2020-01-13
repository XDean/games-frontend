import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import {Redirect, Route, Router, Switch} from "react-router-dom";
import GameBoard from "./board/Board";
import {createHashHistory} from "history";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: "#eee",
            height: "100%",
        },
        homeButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

const App: React.FunctionComponent = () => {
    const history = createHashHistory();
    const classes = useStyles();

    function handleClick() {
        history.push("/board");
    }

    return (
        <Router history={history}>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge={"start"} className={classes.homeButton} color="inherit" aria-label="home"
                                    onClick={handleClick}>
                            <HomeIcon/>
                        </IconButton>
                        <Typography variant="h5" className={classes.title}>
                            XDean's Game Board
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route exact path="/">
                        <Redirect to={"/board"}/>
                    </Route>
                    <Route path="/board">
                        <GameBoard/>
                    </Route>
                    <Route path="*">
                        <Redirect to={"/board"}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App