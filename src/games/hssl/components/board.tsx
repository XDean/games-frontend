import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button} from "@material-ui/core";
import {HSSLCards, HSSLGame} from "../model/game";
import HSSLCubeView from "./cube";
import {useStateByProp} from "../../../util/property";
import HSSLCardView from "./card";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: "100%",
        height: "100%",
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "minmax(auto, 1fr) minmax(auto, 2fr) minmax(auto, 1fr)",
        gridTemplateRows: "auto 1fr",
        gridRowGap: theme.spacing(1),
        gridColumnGap: theme.spacing(3),
        justifyItems: "center",
        alignItems: "center",
    },
    goods: {
        gridRowStart: "span 2",
        display: "grid",
        gridTemplateRows: "repeat(6, auto)",
        gridRowGap: theme.spacing(1),
        justifyItems: "center",
        alignItems: "center",
    },
    board: {
        gridRowStart: "span 2",
        display: "grid",
        gridTemplateColumns: "repeat(3, auto)",
        gridTemplateRows: "repeat(2, auto)",
        gridRowGap: theme.spacing(2),
        gridColumnGap: theme.spacing(2),
        justifyItems: "center",
        alignItems: "center",
    },
    deck: {},
    items: {},
    goodCard: {},
    boardCard: {},
}));

type HSSLBoardProp = {
    game: HSSLGame
}

const HSSLBoardView: React.FunctionComponent<HSSLBoardProp> = (props) => {
    const classes = useStyles();
    const goods = useStateByProp(props.game.board.goods);
    const board = useStateByProp(props.game.board.board);

    return (
        <Box className={classes.root}>
            <Box className={classes.goods}>
                {HSSLCards.map((c, i) => (
                    <Button key={i} className={classes.goodCard}>
                        <HSSLCubeView card={c}/>
                        <span style={{margin: "0 5px"}}>
                            ✖
                            </span>
                        {goods[c as number]}
                    </Button>
                ))}
            </Box>
            <Box className={classes.board}>
                {board.map((c, i) => (
                    <Button key={i} className={classes.boardCard}>
                        <HSSLCardView card={c}/>
                    </Button>
                ))}
            </Box>
            <Box className={classes.deck}>
                Deck
            </Box>
            <Box className={classes.items}>
                Items
            </Box>
        </Box>
    )
};

export default HSSLBoardView;