import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Button, Grid} from "@material-ui/core";
import {LCBoard} from "../model/board";
import {LCCard, LCCardColor} from "../model/card";
import LCSquareView from "./square";

const useStyles = makeStyles({
    root: {},
    left: {
        float: "right",
        display: "flex",
        justifyContent: "center",
        overflow: "auto",

    },
    center: {
        padding: "3px 7px",
        margin: "5px 7px",
        minWidth: 0,
    },
    right: {
        float: "left",
        display: "flex",
        justifyContent: "center",
        overflow: "auto",
    },
});

type LCColorBoardProp = {
    board: LCBoard
    color: LCCardColor
    rightSeat: number,
    onClickDrop?: () => void
}

const LCColorBoardView: React.FunctionComponent<LCColorBoardProp> = (props) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.root} justify={"center"} alignItems={"center"} wrap={"nowrap"}>
            <Grid item xs={5}>
                <Box className={classes.left}>
                    <LCSquareView card={new LCCard(4 + 12 * props.color)}/>
                    <LCSquareView card={new LCCard(3 + 12 * props.color)}/>
                    <LCSquareView card={new LCCard(2 + 12 * props.color)}/>
                </Box>
            </Grid>
            <Grid item>
                <Button className={classes.center}>
                    <LCSquareView card={new LCCard(1 + 12 * props.color)}/>
                </Button>
            </Grid>
            <Grid item xs={5}>
                <Box className={classes.right}>
                    <LCSquareView card={new LCCard(2 + 12 * props.color)}/>
                    <LCSquareView card={new LCCard(3 + 12 * props.color)}/>
                    <LCSquareView card={new LCCard(4 + 12 * props.color)}/>
                </Box>
            </Grid>
        </Grid>
    )
};

export default LCColorBoardView;