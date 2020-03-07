import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button} from "@material-ui/core";
import {HSSLCards, HSSLGame} from "../model/game";
import HSSLCubeView from "./cube";
import {useStateByProp} from "../../../util/property";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: "100%",
        height: "100%",
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "minmax(auto, 1fr) minmax(auto, 2fr) minmax(auto, 3fr)",
        gridTemplateRows: "auto 1fr",
        gridRowGap: theme.spacing(1),
        gridColumnGap: theme.spacing(1),
        justifyItems: "center",
        alignItems: "center",
    },
    goods: {
        gridRowStart: "span 2",
    },
    board: {
        gridRowStart: "span 2",
    },
    deck: {},
    items: {},
    good: {
        padding: theme.spacing(1),
    }
}));

type HSSLBoardProp = {
    game: HSSLGame
}

const HSSLBoardView: React.FunctionComponent<HSSLBoardProp> = (props) => {
    const classes = useStyles();
    const goods = useStateByProp(props.game.board.goods);
    return (
        <Box className={classes.root}>
            <Box className={classes.goods}>
                {HSSLCards.map((c, i) => (
                    <Box key={i} className={classes.good}>
                        <Button variant={"text"}>
                            <HSSLCubeView card={c}/>
                            <span style={{margin: "0 5px"}}>
                            ✖
                            </span>
                            {goods[c as number]}
                        </Button>
                    </Box>
                ))}
            </Box>
            <Box className={classes.board}>
                Board
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