import React, {createContext, useState} from 'react';
import {
    createMuiTheme,
    createStyles,
    makeStyles,
    MuiThemeProvider,
    Theme,
    ThemeProvider
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home'
import {Redirect, Route, Router, Switch, useParams} from "react-router-dom";
import GameBoard from "./board/Board";
import {createHashHistory} from "history";
import Jgzq from "./jgzq/Jgzq";
import LCBoardView from "./games/lost-cities-new/component/board";
import Chip from "@material-ui/core/Chip";
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import Box from "@material-ui/core/Box";
import {grey} from "@material-ui/core/colors";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {AppTheme} from "./theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: "#eee",
            height: "100%",
            overflow: "auto",
        },
        homeButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export const AppContext = createContext<{
    id: string,
}>({
    id: "a",
});

const App: React.FunctionComponent = () => {
    const history = createHashHistory();
    const classes = useStyles();

    const [ctx, setCtx] = useState({id: "a"});
    const [id, setId] = useState(ctx.id);

    function handleClick() {
        history.push("/board");
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
                                            onClick={handleClick}>
                                    <HomeIcon/>
                                </IconButton>
                                <Typography variant="h5" className={classes.title}>
                                    XDean的玩吧
                                </Typography>
                                <Switch>
                                    <Route path="/game/:game/:id" children={<ShareRoom/>}/>
                                </Switch>
                                <Typography style={{marginLeft: 15}}>
                                    {ctx.id}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        {ctx.id === "" ?
                            <Dialog open>
                                <DialogTitle>
                                    欢迎来到XDean的地盘
                                </DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="请输入你的名字"
                                        fullWidth
                                        onChange={e => setId(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button color="primary" onClick={() => {
                                        setCtx({...ctx, id: id})
                                    }}>
                                        确定
                                    </Button>
                                </DialogActions>
                            </Dialog> :
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