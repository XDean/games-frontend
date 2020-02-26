import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button, Grid} from "@material-ui/core";
import {LCGame} from "../model/board";
import {useStateByProp} from "../../../util/property";
import {LCCard, LCCardColors} from "../model/card";
import LCSquareView from "./square";
import {AppTheme} from "../../../theme";
import {LCTheme} from "../theme";

const useStyles = makeStyles<typeof AppTheme & typeof LCTheme>((theme) => createStyles({
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
        alignSelf: "end",
        padding: 3,
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
    },
    selectedDrawType: {
        boxShadow: theme.selectedShadow,
    },
}));

type LCBoardProp = {
    game: LCGame
}

const LCBoardView: React.FunctionComponent<LCBoardProp> = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const board = useStateByProp(props.game.board.board);
    const drop = useStateByProp(props.game.board.drop);
    const mySeat = useStateByProp(props.game.host.mySeat);

    const drawType = useStateByProp(props.game.playInfo.drawType);

    return (
        <Grid className={classes.root} innerRef={ref}>
            {LCCardColors.map(color => (
                <React.Fragment key={color}>
                    <Box className={classes.other}>
                        {board[1 - mySeat][color].slice().reverse().map((card, i) => (
                            <LCSquareView key={i} card={card}/>
                        ))}
                    </Box>
                    <Button className={classes.drop + " " + (drawType === color ? classes.selectedDrawType : "")}
                            onClick={() => props.game.playInfo.drawType.update(v => v === color ? "none" : color)}>
                        {drop[color].length === 0 ?
                            <LCSquareView card={new LCCard(color * 12)} colorOnly/> :
                            <LCSquareView card={drop[color][drop[color].length - 1]}/>
                        }

                    </Button>
                    <Box className={classes.my}>
                        {board[mySeat][color].map((card, i) => (
                            <LCSquareView key={i} card={card}/>
                        ))}
                    </Box>
                </React.Fragment>
            ))}
        </Grid>
    );
});

export default LCBoardView;