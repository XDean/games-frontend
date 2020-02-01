import React from 'react';
import {createMuiTheme, createStyles, makeStyles, MuiThemeProvider, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import {Redirect, Route, Router, Switch, useParams} from "react-router-dom";
import GameBoard from "./board/Board";
import {createHashHistory} from "history";
import Jgzq from "./jgzq/Jgzq";
import Global from "./global";
import LCBoardView from "./lost-cities/component/board";
import Chip from "@material-ui/core/Chip";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import Box from "@material-ui/core/Box";
import {grey} from "@material-ui/core/colors";

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
            <Box className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge={"start"} className={classes.homeButton} color="inherit" aria-label="home"
                                    onClick={handleClick}>
                            <HomeIcon/>
                        </IconButton>
                        <Typography variant="h5" className={classes.title}>
                            XDean的玩吧
                        </Typography>
                        <Switch>
                            <Route path="/game/:game/:id" children={<ShareRoom/>}/>
                        </Switch>
                        <Typography style={{marginLeft:15}}>
                            {Global.id}
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
                    <Route path="/jgzq">
                        <Jgzq/>
                    </Route>
                    <Route path="/game/lc/:id" children={<LCBoardView/>}/>
                    <Route path="*">
                        <Redirect to={"/board"}/>
                    </Route>
                </Switch>
            </Box>
        </Router>
    );
};

const theme = createMuiTheme({
        palette: {
            primary: {
                main: grey[300],
            }
        }
    },
);

function ShareRoom() {
    const {id} = useParams();
    return (
        <MuiThemeProvider theme={theme}>
            <Chip
                label={`房间号: ${id}`}
                clickable
                color={"primary"}
                variant="outlined"
                onDelete={() => {
                }}
                deleteIcon={<ShareOutlinedIcon/>}
            />
        </MuiThemeProvider>
    )
}

export default App