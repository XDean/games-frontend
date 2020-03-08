import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Box, Button, Paper, Tooltip} from "@material-ui/core";
import {HSSLCard, HSSLCards, HSSLGame, HSSLItem, HSSLItems, HSSLStatus} from "../model/game";
import HSSLCubeView from "./cube";
import {useStateByProp} from "../../../util/property";
import HSSLCardView from "./card";
import Typography from "@material-ui/core/Typography";
import HSSLItemView from "./item";
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import HSSLDeckView from "./deck";
import {HSSLTheme} from "../theme";
import {windowMove} from "../../../util/util";

const useStyles = makeStyles<typeof HSSLTheme & Theme>(theme => createStyles({
    root: {
        width: "100%",
        height: "100%",
        padding: theme.spacing(0.5),
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)",
        gridTemplateRows: "repeat(3, auto)",
        gridColumnGap: theme.spacing(3),
        gridRowGap: theme.spacing(0.5),
        justifyItems: "center",
        alignItems: "center",
    },
    goods: {
        gridRowStart: "span 3",
        alignSelf: "stretch",
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
        gridRowStart: "span 3",
        alignSelf: "stretch",
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
        gridRowStart: "span 3",
        alignSelf: "stretch",
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
        alignSelf: "flex-start",
        padding: theme.spacing(1),
        gridTemplateRows: "32px auto",
        gridRowGap: theme.spacing(1),
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
    },
    status: {
        padding: theme.spacing(0.5, 1),
    },


    selected: {
        ...theme.selectedBox,
    }
}));

type HSSLBoardProp = {
    game: HSSLGame
}

const HSSLBoardView: React.FunctionComponent<HSSLBoardProp> = (props) => {
    const classes = useStyles();
    const goods = useStateByProp(props.game.board.goods);
    const board = useStateByProp(props.game.board.board);
    const items = useStateByProp(props.game.board.items);

    const playing = useStateByProp(props.game.host.playing);
    const status = useStateByProp(props.game.board.status);
    const current = useStateByProp(props.game.board.current);
    const mySeat = useStateByProp(props.game.host.mySeat);
    const myRole = useStateByProp(props.game.host.myRole);
    const players = useStateByProp(props.game.board.players);
    const myPlayer = players[mySeat];

    const selected = {
        good1: useStateByProp(props.game.board.selected.good1),
        boat1: useStateByProp(props.game.board.selected.boat1),
        good2: useStateByProp(props.game.board.selected.good2),
        boat2: useStateByProp(props.game.board.selected.boat2),
    };

    // Goods
    const goodsTooltip = function () {
        if (myRole === "play" && current === mySeat && playing) {
            switch (status) {
                case HSSLStatus.Set1:
                case HSSLStatus.Set2:
                case HSSLStatus.BanYun:
                    if (selected.good1 === "empty") {
                        return "选择货物装船";
                    }
                    break;
                case HSSLStatus.BuySwap:
                    if (selected.good1 === "empty") {
                        return "选择货物装船";
                    } else if (myPlayer.items[HSSLItem.BanYun] && selected.good2 === "empty") {
                        return "你可以选择两个货物";
                    }
            }
        }
        return "";
    }();

    const onGoodClick = (c: HSSLCard) => {
        if (myRole === "play" && current === mySeat && playing) {
            switch (status) {
                case HSSLStatus.Set1:
                case HSSLStatus.Set2:
                case HSSLStatus.BanYun:
                    props.game.board.selected.good1.update(g => g === c ? "empty" : c);
                    break;
                case HSSLStatus.BuySwap:
                    if (myPlayer.items[HSSLItem.BanYun]) {
                        let res = windowMove(c, [
                            props.game.board.selected.good1.value,
                            props.game.board.selected.good2.value
                        ], "empty");
                        props.game.board.selected.good1.value = res[0];
                        props.game.board.selected.good2.value = res[1];
                    } else {
                        props.game.board.selected.good1.update(g => g === c ? "empty" : c);
                    }
                    break;
            }
        }
    };

    // submit
    const selectDone = function () {
        if (current === mySeat && playing) {
            switch (status) {
                case HSSLStatus.Set1:
                case HSSLStatus.Set2:
                    return selected.good1 !== "empty";
                case HSSLStatus.BuySwap:
                    if (selected.good1 !== "empty" || selected.boat1 !== -1) {
                        return selected.good1 !== "empty" && selected.boat1 !== -1 &&
                            ((selected.good2 === "empty") === (selected.boat2 === -1))
                    }
                    return true;
                case HSSLStatus.BanYun:
                    break;
                case HSSLStatus.DrawPlay:
                    break;
                case HSSLStatus.Over:
                    break;
            }
        }
        return false;
    }();

    const submitText = function () {
        if (current === mySeat) {
            switch (status) {
                case HSSLStatus.Set1:
                case HSSLStatus.Set2:
                    return "确认装货";
                case HSSLStatus.BuySwap:
                    if (selected.good1 !== "empty" || selected.boat1 !== -1) {
                        return "确认换货"
                    }
                    return "跳过该阶段";
                case HSSLStatus.BanYun:
                    break;
                case HSSLStatus.DrawPlay:
                    break;
                case HSSLStatus.Over:
                    break;

            }
            return "确认操作";
        } else {
            return "等待其他玩家操作";
        }
    }();

    return (
        <Box className={classes.root}>
            <Box className={classes.goods}>
                <Tooltip title={goodsTooltip} placement={"left"} arrow open>
                    <Typography variant="h5">
                        码头
                    </Typography>
                </Tooltip>
                {HSSLCards.map((c, i) => (
                    <Button key={i}
                            className={classes.goodCard + (selected.good1 === c || selected.good2 === c ? " " + classes.selected : "")}
                            onClick={() => onGoodClick(c)}>
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
            <Paper variant={"outlined"} elevation={5} className={classes.status}>
                {function () {
                    if (playing) {
                        switch (status) {
                            case HSSLStatus.Set1:
                            case HSSLStatus.Set2:
                                return "配置货物阶段";
                            case HSSLStatus.BuySwap:
                                return "换货/购买阶段";
                            case HSSLStatus.BanYun:
                                return "搬运工换货阶段";
                            case HSSLStatus.DrawPlay:
                                return "出牌/抽牌阶段";
                            case HSSLStatus.Over:
                                return "游戏结束";
                        }
                    } else if (status === HSSLStatus.Over) {
                        return "游戏结束";
                    } else {
                        return "等待游戏开始"
                    }
                }()}
            </Paper>
            {playing &&
            <Tooltip title={"点击确认操作"} open={selectDone} arrow placement={"bottom"}>
                <Button variant={"outlined"} onClick={() => props.game.submit()}
                        disabled={current === mySeat && playing && myRole === "play" && !selectDone}>
                    {submitText}
                </Button>
            </Tooltip>}
        </Box>
    )
};

export default HSSLBoardView;