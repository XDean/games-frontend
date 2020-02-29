import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Box} from "@material-ui/core";
import games from "../games/games";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
        },
    }),
);

export default function GameBoard() {
    const classes = useStyles();

    return <Box className={classes.root}>
        <Grid container spacing={3}>
            {games.map(g => (
                <Grid item key={g.id}>
                    <g.boardCard/>
                </Grid>
            ))}
        </Grid>
    </Box>;
}