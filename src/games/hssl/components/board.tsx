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
import HSSLDeckView from "./deck";
import {HSSLTheme} from "../theme";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: "100%",
        height: "100%",
        padding: theme.spacing(0.5),
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)",
        gridTemplateRows: "1fr",
        gridColumnGap: theme.spacing(3),
        justifyItems: "center",
        alignItems: "center",
    },
    goods: {
        height: "100%",
        display: "grid",
        gridTemplateRows: "32px repeat(6, auto)",
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
        padding: theme.spacing(0.5),
    },
    goodCard: {},
    board: {
        height: "100%",
        display: "grid",
        gridTemplateRows: "32px repeat(2, auto)",
        gridTemplateColumns: "repeat(3, auto)",
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
        padding: theme.spacing(0.5),
    },
    boardTitle: {
        gridColumnStart: "span 3",
    },
    boardCard: {},
    items: {
        height: "100%",
        display: "grid",
        gridTemplateRows: "32px repeat(4, auto)",
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
        padding: theme.spacing(0.5),
    },
    itemDetails: {
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gridTemplateColumns: "1fr 1fr",
        justifyItems: "center",
        alignItems: "center",
        marginLeft: theme.spacing(1),
        minWidth: 48,
    },
    itemName: {
        gridColumnStart: "span 2",
    },
    deck: {
        display: "grid",
        gridTemplateRows: "32px auto",
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
                        <Box className={classes.itemDetails}>
                            <Box className={classes.itemName}>
                                {HSSLTheme.itemStyle(item).name}
                            </Box>
                            <Box>
                                ✖
                            </Box>
                            {item === HSSLItem.Boat ? <AllInclusiveIcon style={{fontSize: "14px"}}/> :
                                <Box style={{fontSize: "14px"}}>
                                    {items[item]}
                                </Box>}
                        </Box>
                    </Button>
                ))}
            </Box>
            <Box className={classes.deck}>
                <Typography variant="h5">
                    牌堆
                </Typography>
                <HSSLDeckView game={props.game}/>
            </Box>
        </Box>
    )
};

export default HSSLBoardView;