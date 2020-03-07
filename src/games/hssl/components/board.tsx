import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button} from "@material-ui/core";
import {HSSLCards, HSSLGame, HSSLItem, HSSLItems} from "../model/game";
import HSSLCubeView from "./cube";
import {useStateByProp} from "../../../util/property";
import HSSLCardView from "./card";
import Typography from "@material-ui/core/Typography";
import HSSLItemView from "./item";
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: "100%",
        height: "100%",
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "minmax(auto, 2fr) minmax(auto, 4fr) minmax(auto, 2fr) minmax(auto, 1fr)",
        gridTemplateRows: "1fr",
        gridColumnGap: theme.spacing(3),
        justifyItems: "center",
        alignItems: "center",
    },
    goods: {
        display: "grid",
        gridTemplateRows: "repeat(7, auto)",
        gridRowGap: theme.spacing(1),
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
        padding: theme.spacing(1),
    },
    goodCard: {},
    board: {
        display: "grid",
        gridTemplateColumns: "repeat(3, auto)",
        gridTemplateRows: "repeat(3, auto)",
        gridRowGap: theme.spacing(2),
        gridColumnGap: theme.spacing(2),
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
        padding: theme.spacing(1),
    },
    boardTitle: {
        gridColumnStart: "span 3",
    },
    boardCard: {},
    deck: {},
    items: {
        display: "grid",
        gridTemplateRows: "repeat(5, auto)",
        gridRowGap: theme.spacing(1),
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
        padding: theme.spacing(1),
    },
}));

type HSSLBoardProp = {
    game: HSSLGame
}

const HSSLBoardView: React.FunctionComponent<HSSLBoardProp> = (props) => {
    const classes = useStyles();
    const goods = useStateByProp(props.game.board.goods);
    const board = useStateByProp(props.game.board.board);
    const items = useStateByProp(props.game.board.items);

    return (
        <Box className={classes.root}>
            <Box className={classes.goods}>
                <Typography variant="h5">
                    码头
                </Typography>
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
                <Typography variant="h5" className={classes.boardTitle}>
                    市场
                </Typography>
                {board.map((c, i) => (
                    <Button key={i} className={classes.boardCard}>
                        <HSSLCardView card={c}/>
                    </Button>
                ))}
            </Box>
            <Box className={classes.items}>
                <Typography variant="h5">
                    商店
                </Typography>
                {HSSLItems.map((item, i) => (
                    <Button key={i} className={classes.goodCard}>
                        <HSSLItemView item={item}/>
                        <span style={{margin: "0 5px"}}>
                            ✖
                            </span>
                        {item === HSSLItem.Boat ? <AllInclusiveIcon style={{fontSize: "14px"}}/> :
                            <Typography style={{fontSize: "14px"}}>
                                {items[item]}
                            </Typography>}
                    </Button>
                ))}
            </Box>
            <Box className={classes.deck}>
                Deck
            </Box>
        </Box>
    )
};

export default HSSLBoardView;