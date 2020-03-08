import React, {createContext, useRef, useState} from 'react';
import {createStyles, makeStyles, Theme, ThemeProvider} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import {Redirect, Route, Router, Switch} from "react-router-dom";
import GameBoard from "./board/board";
import {createHashHistory} from "history";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import {grey} from "@material-ui/core/colors";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Popover, TextField} from "@material-ui/core";
import {AppTheme} from "./theme";
import games from "./games/games";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "100%",
            display: "grid",
            gridTemplateColumns: "100%",
            gridTemplateRows: "auto 1fr",
        },
        homeButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        contentRoot: {
            backgroundColor: "#f9f6f3",
            overflow: "auto",
        }
    }),
);

export type AppContextType = {
    id: string
}

let AppDefaultContext = {
    id: (window.localStorage.getItem("user_id") || ""),
};

export const AppContext = createContext<AppContextType>(AppDefaultContext);

const App: React.FunctionComponent = () => {
    const history = createHashHistory();
    const classes = useStyles();

    const idRef = useRef<HTMLInputElement>();
    const [ctx, setCtx] = useState<AppContextType>(AppDefaultContext);
    const [idAnchor, setIdAnchor] = useState<HTMLElement | null>(null);

    function goHome() {
        history.push("/");
    }

    function submitId() {
        let id = idRef.current!.value;
        window.localStorage.setItem("user_id", id);
        setCtx({...ctx, id: id})
    }

    function exit() {
        setIdAnchor(null);
        window.localStorage.removeItem("user_id");
        setCtx({...ctx, id: ""});
        goHome();
    }

    function inputNameDialog() {
        return <Dialog open>
            <DialogTitle>
                欢迎来到XDean的玩吧
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    inputRef={idRef}
                    margin="dense"
                    label="请输入你的名字"
                    fullWidth
                    onKeyPress={e => {
                        if (e.key === "Enter") {
                            submitId();
                            e.preventDefault();
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={submitId}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>;
    }

    function board() {
        return <Box className={classes.contentRoot}>
            <Switch>
                <Route exact path="/">
                    <Redirect to={"/board"}/>
                </Route>
                <Route path="/board">
                    <GameBoard/>
                </Route>
                {games.map(g => (
                    <Route key={g.id} path={`/game/${g.id}`}>
                        <g.mainNode/>
                    </Route>
                ))}
                <Route path="*">
                    <Redirect to={"/board"}/>
                </Route>
            </Switch>
        </Box>;
    }

    return (
        <ThemeProvider theme={AppTheme}>
            <AppContext.Provider value={ctx}>
                <Router history={history}>
                    <Box className={classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton edge={"start"} className={classes.homeButton} color="inherit"
                                            aria-label="home"
                                            onClick={goHome}>
                                    <HomeIcon/>
                                </IconButton>
                                <Typography variant="h5" className={classes.title}>
                                    XDean的玩吧
                                </Typography>
                                <Switch>
                                    {games.map(g => (
                                        g.headerNode &&
                                        <Route key={g.id} path={`/game/${g.id}`}>
                                            <g.headerNode/>
                                        </Route>
                                    ))}
                                </Switch>
                                {ctx.id && <Chip
                                    label={ctx.id}
                                    clickable
                                    style={{marginLeft: 15, color: grey[300], borderColor: grey[300]}}
                                    variant="outlined"
                                    onClick={e => setIdAnchor(e.currentTarget)}
                                />}
                                <Popover
                                    anchorEl={idAnchor}
                                    keepMounted
                                    open={Boolean(idAnchor)}
                                    onClose={() => setIdAnchor(null)}
                                    elevation={0}
                                    anchorOrigin={{vertical: 'bottom', horizontal: 'center',}}
                                    transformOrigin={{vertical: 'top', horizontal: 'center',}}
                                >
                                    <Button variant={"text"} onClick={exit}>退出</Button>
                                </Popover>

                            </Toolbar>
                        </AppBar>
                        {board()}
                    </Box>
                    {ctx.id === "" && inputNameDialog()}
                </Router>
            </AppContext.Provider>
        </ThemeProvider>
    );
};

export default App