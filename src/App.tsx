import React, {createContext, useRef, useState} from 'react';
import {createMuiTheme, createStyles, makeStyles, Theme, ThemeProvider} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import {Redirect, Route, Router, Switch, useParams} from "react-router-dom";
import GameBoard from "./board/Board";
import {createHashHistory} from "history";
import Jgzq from "./jgzq/Jgzq";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import {grey} from "@material-ui/core/colors";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Popover, TextField} from "@material-ui/core";
import {AppTheme} from "./theme";
import LCMainView from "./games/lost-cities-new/lostcities";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#eee",
            height: "100%",
        },
        homeButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        contentRoot: {
            flexGrow: 1,
            height: 0,
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
                                    <Route path="/game/:game/:id" children={<ShareRoom/>}/>
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
                        {ctx.id === "" ?
                            <Dialog open>
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
                            </Dialog> :
                            <Box className={classes.contentRoot}>
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
                                    <Route path="/game/lc/:id" children={<LCMainView/>}/>
                                    <Route path="*">
                                        <Redirect to={"/board"}/>
                                    </Route>
                                </Switch>
                            </Box>
                        }
                    </Box>
                </Router>
            </AppContext.Provider>
        </ThemeProvider>
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
        <Chip
            label={`房间号: ${id}`}
            clickable
            style={{color: grey[300], borderColor: grey[300]}}
            variant="outlined"
        />
    )
}

export default App