import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GameCard from "./GameCard";
import jgzq from "../jgzq/images/banner.png"
import lostCities from "../lost-cities/images/banner.jpg"

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

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                    <GameCard name={"酒馆战棋模拟器"} desc={"炉石酒馆战棋单机模拟器"} link={"aaa"} image={jgzq}/>
                </Grid>
                <Grid item xs={6} sm={4} md={3} lg={2}>
                    <GameCard name={"失落的城市"} desc={"双人桌面游戏"} image={lostCities}/>
                </Grid>
            </Grid>
        </div>
    );
}