import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box, Button, Grid} from "@material-ui/core";
import {EmptyBoard, LCBoard} from "../model/board";
import {LCCard, LCCardColor} from "../model/card";
import LCSquareView from "./square";
import {useStateByProp} from "../../../util/property";

const useStyles = makeStyles({
    root: {},
    leftRightContainer: {
        overflowX: "auto",
    },
    leftRightBox: {
        display: "flex",
        justifyContent: "center",
        padding: "5px 0",
    },
    left: {
        float: "right",

    },
    center: {
        padding: "3px 7px",
        margin: "5px 7px",
        minWidth: 0,
    },
    right: {
        float: "left",
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
    const board = useStateByProp(props.board.board, EmptyBoard)[0];
    return (
        <Grid container className={classes.root} justify={"center"} alignItems={"center"} wrap={"nowrap"}>
            <Grid item xs={5} className={classes.leftRightContainer}>
                <Box className={classes.left + " " + classes.leftRightBox}>
                    {board[1-props.rightSeat][props.color].reverse().map((c, i) => (
                        <LCSquareView key={i} card={c}/>
                    ))}
                </Box>
            </Grid>
            <Grid item>
                <Button className={classes.center}>
                    <LCSquareView card={new LCCard(1 + 12 * props.color)}/>
                </Button>
            </Grid>
            <Grid item xs={5} className={classes.leftRightContainer}>
                <Box className={classes.right + " " + classes.leftRightBox}>
                    {board[props.rightSeat][props.color].map((c, i) => (
                        <LCSquareView key={i} card={c}/>
                    ))}
                </Box>
            </Grid>
        </Grid>
    )
};

export default LCColorBoardView;