import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GameCard from "./GameCard";
import jgzq from "../jgzq/images/banner.png"
import lostCities from "../lost-cities/images/banner.jpg"
import {Route, Switch, useHistory, useRouteMatch} from "react-router";
import LCCreateView from "../lost-cities/create";
import {Box} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            height: "100%",
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
            overflow: "auto",
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

export default function GameBoard() {
    const classes = useStyles();
    const history = useHistory();
    const {path} = useRouteMatch();

    function back() {
        history.push("/board");
    }

    return (
        <Box className={classes.root}>
            <Grid container spacing={3}>
                <Grid item>
                    <GameCard name={"酒馆战棋模拟器"} desc={"炉石酒馆战棋单机模拟器"} link={"/jgzq"} image={jgzq}/>
                </Grid>
                <Grid item>
                    <GameCard name={"失落的城市"} desc={"双人桌面游戏"} image={lostCities} link={"/board/lc"}/>
                </Grid>
            </Grid>

            <Switch>
                <Route path={`${path}/lc`}>
                    <LCCreateView onClose={back}/>
                </Route>
            </Switch>
        </Box>
    );
}