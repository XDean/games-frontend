import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button, Grid} from "@material-ui/core";
import {LCBoard} from "../model/board";
import {useStateByProp} from "../../../util/property";
import {LCCard, LCCardColors} from "../model/card";
import LCSquareView from "./square";
import {AppTheme} from "../../../theme";

const useStyles = makeStyles<typeof AppTheme>((theme) => createStyles({
    root: {
        display: "grid",
        height: "100%",
        gridAutoFlow: "column",
        gridTemplateColumns: "repeat(5 20%)",
        gridTemplateRows: "1fr auto 1fr",
        justifyItems: "center"
    },
    other: {
        overflow: "auto",
        ...theme.hideScrollBar,
    },
    my: {
        overflow: "auto",
        ...theme.hideScrollBar,
    },
    drop: {
        margin: "5px 0",
        padding: "3px 5px",
        [theme.breakpoints.down('sm')]: {
            minWidth: 40,
        },
        [theme.breakpoints.up('lg')]: {
            minWidth: 60,
        },
    }
}));

type LCColorBoardProp = {
    board: LCBoard
    mySeat: number,
    onClickDrop?: () => void
}

const LCColorBoardView: React.FunctionComponent<LCColorBoardProp> = (props) => {
    const classes = useStyles();
    const board = useStateByProp(props.board.board)[0];
    return (
        <Grid className={classes.root}>
            {LCCardColors.map(color => (
                <React.Fragment key={color}>
                    <Box className={classes.other}>
                        {board[1 - props.mySeat][color].map((card, i) => (
                            <LCSquareView key={i} card={card}/>
                        ))}
                    </Box>
                    <Button className={classes.drop}>
                        <LCSquareView card={new LCCard(1 + 12 * color)}/>
                    </Button>
                    <Box className={classes.my}>
                        {board[props.mySeat][color].map((card, i) => (
                            <LCSquareView key={i} card={card}/>
                        ))}
                    </Box>
                </React.Fragment>
            ))}
        </Grid>
    );
};

export default LCColorBoardView;