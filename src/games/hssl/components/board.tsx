import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Box, Button, IconButton, Paper, Tooltip} from "@material-ui/core";
import {HSSLCard, HSSLCards, HSSLGame, HSSLItem, HSSLItems, HSSLStatus, ItemCost} from "../model/game";
import HSSLCubeView from "./cube";
import {useStateByProp} from "../../../util/property";
import HSSLCardView from "./card";
import Typography from "@material-ui/core/Typography";
import HSSLItemView from "./item";
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import HSSLDeckView from "./deck";
import {HSSLTheme} from "../theme";
import {windowMove} from "../../../util/selection";
import {ifClass} from "../../../util/css";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles<typeof HSSLTheme & Theme>(theme => createStyles({
    root: {
        width: "100%",
        height: "100%",
        padding: theme.spacing(0.5),
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)",
        gridTemplateRows: "repeat(3, auto)",
        gridColumnGap: theme.spacing(1.5),
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
        gridColumnGap: theme.spacing(1),
        gridRowGap: theme.spacing(0.5),
        justifyItems: "center",
        alignItems: "center",
        border: "black solid 1px",
        borderRadius: 10,
        padding: theme.spacing(0.5),
    },
    boardTitle: {
        gridColumnStart: "span 3",
    },
    boardCard: {
        padding: theme.spacing(0.25),
    },
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
    deckButton: {
        margin: theme.spacing(0, 0.25),
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
        item: useStateByProp(props.game.board.selected.item),
        deck: useStateByProp(props.game.board.selected.deck),
        board: useStateByProp(props.game.board.selected.board),
        hand: useStateByProp(props.game.board.selected.hand),
    };

    const [showStoreHelp, setShowStoreHelp] = useState(false);

    // Goods
    const goodsTooltip = function () {
        if (myRole === "play" && current === mySeat && playing) {
            switch (status) {
                case HSSLStatus.Set1:
                case HSSLStatus.Set2:
                case HSSLStatus.BanYun:
                    if (selected.good1 === -1) {
                        return "选择货物装船";
                    }
                    break;
                case HSSLStatus.BuySwap:
                    if (selected.item === -1) {
                        if (selected.good1 === -1) {
                            return "选择货物装船";
                        } else if (myPlayer.items[HSSLItem.BanYun] && selected.good2 === -1) {
                            return "你可以选择两个货物";
                        }
                    } else if (selected.item === HSSLItem.Boat) {
                        if (selected.good1 === -1) {
                            return "选择货物装船";
                        }
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
                    props.game.board.selected.good1.update(g => g === c ? -1 : c);
                    break;
                case HSSLStatus.BuySwap:
                    if (selected.item === HSSLItem.Boat) {
                        props.game.board.selected.good1.update(g => g === c ? -1 : c);
                    } else {
                        props.game.board.selected.item.value = -1;
                        if (myPlayer.items[HSSLItem.BanYun]) {
                            let res = windowMove(c, [
                                props.game.board.selected.good1.value,
                                props.game.board.selected.good2.value
                            ], -1);
                            props.game.board.selected.good1.value = res[0];
                            props.game.board.selected.good2.value = res[1];
                        } else {
                            props.game.board.selected.good1.update(g => g === c ? -1 : c);
                        }
                    }
                    break;
            }
        }
    };

    // Items
    const itemsTooltip = function () {
        if (myRole === "play" && current === mySeat && playing &&
            status === HSSLStatus.BuySwap && selected.good1 === -1 && selected.boat1 === -1 && selected.item === -1) {
            return "选择要购买的功能牌";
        }
        return "";
    }();

    const onItemClick = (item: HSSLItem) => {
        if (myRole === "play" && current === mySeat && playing && status === HSSLStatus.BuySwap) {
            props.game.board.selected.good1.value = -1;
            props.game.board.selected.boat1.value = -1;
            props.game.board.selected.good2.value = -1;
            props.game.board.selected.boat2.value = -1;
            props.game.board.selected.item.update(i => i === item ? -1 : item);
        }
    };

    // Board
    const boardTooltip = function () {
        if (myRole === "play" && current === mySeat && playing &&
            status === HSSLStatus.DrawPlay && selected.deck === false && selected.board.every(e => e === false)) {
            return "选择出牌席位";
        }
        return "";
    }();

    const onBoardClick = (pos: number) => {
        if (myRole === "play" && current === mySeat && playing && status === HSSLStatus.DrawPlay) {
            props.game.board.selected.deck.value = false;
            props.game.board.selected.board.update(board => {
                board[pos] = !board[pos];
            });
        }
    };

    // Deck
    const deckTooltip = function () {
        if (myRole === "play" && current === mySeat && playing &&
            status === HSSLStatus.DrawPlay && !selected.deck && selected.hand === -1 && selected.board.every(b => !b)) {
            return "选择抽牌";
        }
        return "";
    }();

    const onDeckClick = () => {
        if (myRole === "play" && current === mySeat && playing && status === HSSLStatus.DrawPlay) {
            props.game.board.selected.deck.update(b => !b);
            props.game.board.selected.hand.value = -1;
            props.game.board.selected.board.update(b => b.fill(false))
        }
    };

    // submit
    const [selectDone, submitTooltip] = function (): [boolean, string] {
        if (current === mySeat && playing) {
            switch (status) {
                case HSSLStatus.Set1:
                case HSSLStatus.Set2:
                    if (selected.good1 === -1) {
                        return [false, ""];
                    } else {
                        return [goods[selected.good1] > 0, "货物已用完"];
                    }
                case HSSLStatus.BuySwap:
                    if (selected.item !== -1) {
                        if (ItemCost(selected.item) > myPlayer.points) {
                            return [false, "金币不足"];
                        } else if (selected.item === HSSLItem.Boat) {
                            if (selected.good1 === -1) {
                                return [false, ""];
                            } else {
                                return [goods[selected.good1] > 0, "货物已用完"];
                            }
                        } else if (items[selected.item] === 0) {
                            return [false, "道具已卖完"]
                        } else {
                            return [!myPlayer.items[selected.item], "道具不能重复购买"]
                        }
                    }
                // fallthrough
                case HSSLStatus.BanYun:
                    if (selected.good1 !== -1 || selected.boat1 !== -1) {
                        if (selected.good1 !== -1 && selected.boat1 !== -1) {
                            // ((selected.good2 !== -1 || goods[selected.good1] > 1) === (selected.boat2 !== -1))
                            if (selected.good2 !== -1 || selected.boat2 !== -1) {
                                if (selected.good2 === -1) {
                                    return [goods[selected.good1] > 1, "货物已用完"];
                                } else {
                                    return [goods[selected.good1] > 0 && goods[selected.good2] > 0, "货物已用完"];
                                }
                            } else {
                                return [goods[selected.good1] > 0, "货物已用完"];
                            }
                        } else {
                            return [false, ""];
                        }
                    }
                    return [true, ""];
                case HSSLStatus.DrawPlay:
                    if (selected.deck) {
                        return [true, ""];
                    }
                    if (selected.hand !== -1 && selected.board.some(b => b)) {
                        return [myPlayer.hand[selected.hand] >= selected.board.filter(b => b).length, "该种手牌数量不足"];
                    }
                    break;
            }
        }
        return [false, ""];
    }();

    const submitText = function () {
        if (playing) {
            switch (myRole) {
                case "none":
                    return "准备数据";
                case "not-determined":
                    return "等待加入";
                case "play":
                    if (current === mySeat) {
                        switch (status) {
                            case HSSLStatus.Set1:
                            case HSSLStatus.Set2:
                                return "确认装货";
                            case HSSLStatus.BuySwap:
                            case HSSLStatus.BanYun:
                                if (selected.good1 !== -1 || selected.boat1 !== -1) {
                                    return "确认换货";
                                }
                                if (selected.item !== -1) {
                                    return "确认购买";
                                }
                                return "跳过该阶段";
                            case HSSLStatus.DrawPlay:
                                if (selected.deck) {
                                    return "确认抽牌";
                                }
                                if (selected.board.some(b => b) || selected.hand !== -1) {
                                    return "确认出牌";
                                }
                                break;
                            case HSSLStatus.Over:
                                break;
                        }
                        return "确认操作";
                    } else {
                        return "其他玩家回合";
                    }
                case "watch":
                    return "正在旁观";
            }
        } else {
            return "等待游戏开始";
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
                <Tooltip title={boardTooltip} placement={"left"} arrow open>
                    <Typography variant="h5" className={classes.boardTitle}>
                        市场
                    </Typography>
                </Tooltip>
                {board.map((c, i) => (
                    <Button key={i} className={classes.boardCard + ifClass(selected.board[i], classes.selected)}
                            onClick={() => onBoardClick(i)}>
                        <HSSLCardView card={c}/>
                    </Button>
                ))}
            </Box>
            <Box className={classes.items}>
                <Tooltip title={itemsTooltip} placement={"left"} arrow open>
                    <Typography variant="h5">
                        商店
                        <IconButton size={"small"} onClick={() => setShowStoreHelp(b => !b)}>
                            <HelpOutlineIcon fontSize={"small"} style={{verticalAlign: "middle"}}/>
                        </IconButton>
                    </Typography>
                </Tooltip>
                {HSSLItems.map((item, i) => (
                    <Tooltip key={i} title={function () {
                        let style = HSSLTheme.itemStyle(item);
                        return <Box style={{width: "min-content"}}>
                            <Box>
                                <img src={style.image} alt={"item"} width={120}/>
                            </Box>
                            <Typography>
                                {style.name} ({ItemCost(item)}金币)<br/>
                                {function () {
                                    switch (item) {
                                        case HSSLItem.Boat:
                                            return "购买的同时你需要选择货物装船";
                                        case HSSLItem.GuanShui:
                                            return "每次获得金币时额外获得2枚";
                                        case HSSLItem.BanYun:
                                            return "换货阶段可以换两船货，购买后可立即换一船货";
                                        default:
                                            return "回合结束时可额外抽一张牌";
                                    }
                                }()}
                            </Typography>
                        </Box>
                    }()} placement={function () {
                        switch (i) {
                            case 0:
                                return "left-end";
                            case 1:
                                return "right-end";
                            case 2:
                                return "left-start";
                            default:
                                return "right-start";
                        }
                    }()} arrow open={showStoreHelp}
                             onClose={() => setShowStoreHelp(false)} interactive>
                        <Button className={classes.goodCard + ifClass(selected.item === item, classes.selected)}
                                onClick={() => onItemClick(item)}>
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
                    </Tooltip>
                ))}
            </Box>
            <Box className={classes.deck}>
                <Tooltip title={deckTooltip} placement={"left"} arrow open>
                    <Typography variant="h5">
                        牌堆
                    </Typography>
                </Tooltip>
                <Button className={classes.deckButton + ifClass(selected.deck, classes.selected)}
                        onClick={onDeckClick}>
                    <HSSLDeckView game={props.game}/>
                </Button>
            </Box>
            <Paper variant={"outlined"} elevation={5} className={classes.status}>
                {function () {
                    if (playing) {
                        switch (status) {
                            case HSSLStatus.Doing:
                                return "正在执行操作";
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
            <Tooltip title={selectDone ? "点击确认操作" : submitTooltip} open arrow placement={"right"}>
                <Button variant={"outlined"}
                        onClick={() => current === mySeat && playing && myRole === "play" && selectDone && props.game.submit()}
                        disabled={current === mySeat && playing && myRole === "play" && !selectDone}>
                    {submitText}
                </Button>
            </Tooltip>
        </Box>
    )
};

export default HSSLBoardView;