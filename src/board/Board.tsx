import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GameCard from "./GameCard";
import jgzq from "../jgzq/images/banner.png"
import lostCities from "../lost-cities/images/banner.jpg"
import LCCreateView from "../games/lost-cities-new/component/create";
import {Box, Dialog} from "@material-ui/core";
import LCHelpView from "../games/lost-cities-new/component/help";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
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
    const [item, setItem] = useState("");

    function back() {
        setItem("")
    }

    let dialogContent = function () {
        switch (item) {
            case "lc":
                return <LCCreateView onCancel={back}/>
        }
    }();

    return <Box className={classes.root}>
        <Grid container spacing={3}>
            <Grid item>
                <GameCard name={"酒馆战棋模拟器"} desc={"炉石酒馆战棋单机模拟器"} image={jgzq}/>
            </Grid>
            <Grid item>
                <GameCard name={"失落的城市"} desc={"双人桌面游戏"} image={lostCities} onPlay={() => setItem("lc")}
                          help={<LCHelpView/>}/>
            </Grid>
        </Grid>

        {dialogContent && (
            <Dialog open onClose={back}>
                {dialogContent}
            </Dialog>
        )}
    </Box>;
}