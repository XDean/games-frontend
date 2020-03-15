import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Box, Button, Chip, Paper, Tooltip} from "@material-ui/core";
import {HSSLCard, HSSLGame, HSSLItem, HSSLSpecialItems, HSSLStatus} from "../model/game";
import {useStateByProp} from "../../../util/property";
import Typography from "@material-ui/core/Typography";
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import {HSSLTheme} from "../theme";
import HSSLCubeView from "./cube";
import {windowMove} from "../../../util/selection";
import {ifClass} from "../../../util/css";

const useStyles = makeStyles<typeof HSSLTheme & Theme>(theme => createStyles({
    //empty
    empty: {
        width: 340,
        height: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
    },
    //wait
    waitRoot: {
        width: 340,
        height: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
    },
    tag: {
        margin: theme.spacing(0.5),
    },
    action: {
        margin: theme.spacing(0.5),
    },
    // play
    root: {
        minWidth: 340,
        height: 180,
        padding: theme.spacing(0.5),
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gridTemplateRows: "auto auto auto 1fr",
        gridAutoFlow: "column",
        boxSizing: "border-box",
    },
    name: {
        textAlign: "center",
        padding: theme.spacing(0.5, 0, 1, 0),
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
    },
    items: {
        gridRowStart: "span 3",
        display: "grid",
        gridTemplateRows: "repeat(4, auto)",
        gridRowGap: theme.spacing(1),
    },
    hand: {
        height: 64,
        gridRowStart: "span 2",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(2, auto)",
        gridRowGap: theme.spacing(0.75),
        gridColumnGap: theme.spacing(1),
        justifyItems: "center",
        alignItems: "baseline",
        alignSelf: "center",
        justifySelf: "center",
        margin: theme.spacing(0.5, 0, 1, 0),
    },
    handCard: {
        height: 30,
        padding: theme.spacing(0.5),
        border: "black solid 1px",
        fontSize: "0.85rem",
    },
    handUnknown: {
        height: 64,
        gridRowStart: "span 2",
        alignSelf: "center",
        justifySelf: "center",
        alignItems: "center",
        display: "flex",
    },
    boats: {
        gridRowStart: "span 2",
        overflowX: "auto",
        overflowY: "hidden",
        padding: theme.spacing(0.5),
        whiteSpace: "nowrap",
        margin: "auto 0",
        textAlign: "center",
    },
    boat: {
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        justifyContent: "center",
    },
    boatButton: {
        height: 77,
        width: 50,
        ...theme.itemStyle(HSSLItem.Boat).card,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        minWidth: 0,
        margin: theme.spacing(0, 0.5),
    },


    selected: {
        ...theme.selectedBox,
    }
}));

type HSSLPlayerProp = {
    game: HSSLGame
    seat: number
}

const HSSLPlayerView: React.FunctionComponent<HSSLPlayerProp> = (props) => {
    const classes = useStyles();

    const hostPlayers = useStateByProp(props.game.host.players);
    const gamePlayers = useStateByProp(props.game.board.players);

    const mySeat = useStateByProp(props.game.host.mySeat);
    const myRole = useStateByProp(props.game.host.myRole);

    const myHostPlayer = hostPlayers[mySeat];

    const hostPlayer = hostPlayers[props.seat];
    const gamePlayer = gamePlayers[props.seat];

    const playing = useStateByProp(props.game.host.playing);
    const current = useStateByProp(props.game.board.current);
    const status = useStateByProp(props.game.board.status);

    const selected = {
        boat1: useStateByProp(props.game.board.selected.boat1),
        boat2: useStateByProp(props.game.board.selected.boat2),
        item: useStateByProp(props.game.board.selected.item),
        deck: useStateByProp(props.game.board.selected.deck),
        hand: useStateByProp(props.game.board.selected.hand),
        biyue: useStateByProp(props.game.board.selected.biyue),
    };

    function tag(text: string) {
        return <Chip label={text} variant={"outlined"} size={"small"} className={classes.tag}/>;
    }

    // tag
    const hostTag = !playing && hostPlayer.host && tag("房主");
    const readyTag = !playing && props.seat !== mySeat && tag(hostPlayer.ready ? "已准备" : "未准备");

    //action
    const swapAction = myRole === "play" && props.seat !== mySeat && !playing && !hostPlayer.ready && !myHostPlayer.ready &&
        <Chip label={"交换位置"} variant={"outlined"} size={"small"} className={classes.action} clickable onClick={() => {
            props.game.host.swapSeat(props.seat)
        }}/>;
    const readyAction = myRole === "play" && props.seat === mySeat && !playing &&
        <Chip label={hostPlayer.ready ? "取消准备" : "点击准备"} variant={"outlined"} size={"small"} className={classes.action}
              clickable onClick={() => {
            props.game.host.ready(!hostPlayer.ready)
        }}/>;
    const allReady = props.game.host.isAllReady() && props.game.host.getPlayerCount() > 1;
    const startAction = myRole === "play" && props.seat === mySeat && !playing && myHostPlayer.host && myHostPlayer.ready &&
        <Tooltip title={"等待其他玩家"} open={!allReady} arrow placement={"left"}>
            <Chip label={"开始游戏"} variant={"outlined"} size={"small"} className={classes.action}
                  disabled={!allReady} clickable onClick={() => props.game.host.startGame()}/>
        </Tooltip>;

    // hand
    const handTooltip = function () {
        if (myRole === "play" && props.seat === mySeat && current === mySeat && playing &&
            status === HSSLStatus.DrawPlay && selected.deck === false && selected.hand === -1) {
            return "选择手牌打出";
        }
        return "";
    }();

    const onHandClick = (hand: HSSLCard) => {
        if (myRole === "play" && props.seat === mySeat && current === mySeat && playing &&
            status === HSSLStatus.DrawPlay) {
            props.game.board.selected.hand.update(h => h === hand ? -1 : hand);
            props.game.board.selected.deck.value = false;
        }
    };

    // boat
    const boatTooltip = function () {
        if (myRole === "play" && props.seat === mySeat && current === mySeat && playing && selected.item === -1) {
            switch (status) {
                case HSSLStatus.BanYun:
                    if (selected.boat1 === -1) {
                        return "选择货船卸货";
                    }
                    break;
                case HSSLStatus.BuySwap:
                    if (selected.boat1 === -1) {
                        return "选择货船卸货";
                    } else if (gamePlayer.items[HSSLItem.BanYun] && selected.boat2 === -1) {
                        return "你可以选择两艘船";
                    }
            }
        }
        return "";
    }();

    const onBoatClick = (boat: number) => {
        if (myRole === "play" && props.seat === mySeat && current === mySeat && playing) {
            props.game.board.selected.item.value = -1;
            switch (status) {
                case HSSLStatus.BanYun:
                    props.game.board.selected.boat1.update(b => b === boat ? -1 : boat);
                    break;
                case HSSLStatus.BuySwap:
                    if (gamePlayer.items[HSSLItem.BanYun]) {
                        let res = windowMove(boat, [
                            props.game.board.selected.boat1.value,
                            props.game.board.selected.boat2.value
                        ], -1);
                        props.game.board.selected.boat1.value = res[0];
                        props.game.board.selected.boat2.value = res[1];
                    } else {
                        props.game.board.selected.boat1.update(b => b === boat ? -1 : boat);
                    }
                    break;
            }
        }
    };

    function boat(index: number) {
        return (
            <Button key={index} size={"small"}
                    className={classes.boatButton + (props.seat === mySeat && (selected.boat1 === index || selected.boat2 === index) ? " " + classes.selected : "")}
                    onClick={() => onBoatClick(index)}>
                <Box className={classes.boat}>
                    <HSSLCubeView card={gamePlayer.boats[index]}/>
                </Box>
            </Button>
        );
    }

    if (hostPlayer.isEmpty()) {
        return (
            <Paper elevation={3} className={classes.empty}>
                <Box>
                    {playing ? "空位" : "等待玩家加入"}
                </Box>
                {swapAction}
            </Paper>
        )
    }

    if (!playing && status !== HSSLStatus.Over) {
        return (
            <Paper elevation={3} className={classes.waitRoot}>
                <Typography component={"span"} className={classes.name}>
                    {hostPlayer.id}
                </Typography>
                {hostTag}
                {readyTag}
                {swapAction}
                {readyAction}
                {startAction}
            </Paper>
        )
    }

    const canBiYue = gamePlayer.items[HSSLItem.BiYue] && mySeat === props.seat && playing && myRole === "play";

    return (
        <Paper elevation={3}
               className={classes.root + (playing && props.seat === current ? " " + classes.selected : "")}>
            <Box className={classes.name}>
                {hostPlayer.id}
            </Box>
            <Box className={classes.items}>
                <Chip icon={<MonetizationOnOutlinedIcon/>}
                      label={props.seat !== mySeat && myRole === "play" ? "未知" : gamePlayer.points} variant={"outlined"}
                      size={"small"}/>
                {HSSLSpecialItems.map((item, index) => (
                    <Tooltip title={"点击开启交易所"} key={index} arrow placement={"left"}
                             open={item === HSSLItem.BiYue &&canBiYue && !selected.biyue && status === HSSLStatus.DrawPlay}>
                        <Chip label={HSSLTheme.itemStyle(item).name} variant={"outlined"} size={"small"}
                              className={ifClass(item === HSSLItem.BiYue &&canBiYue && selected.biyue, classes.selected)}
                              disabled={!gamePlayer.items[item]} clickable={item === HSSLItem.BiYue}
                              onClick={item === HSSLItem.BiYue ? (() => {
                                  props.game.board.selected.biyue.update(b => !b)
                              }) : undefined}/>
                    </Tooltip>
                ))}
            </Box>
            {props.seat !== mySeat && myRole === "play"
                ? <Box className={classes.handUnknown}>{tag("手牌: " + gamePlayer.handCount)}</Box>
                : <Tooltip title={handTooltip} open arrow placement={"top"}>
                    <Box className={classes.hand}>
                        {gamePlayer.hand.map((count, card) => {
                            let style = HSSLTheme.cardStyle(card as HSSLCard);
                            return (
                                <Button className={classes.handCard + ifClass(selected.hand === card, classes.selected)}
                                        onClick={() => onHandClick(card as HSSLCard)}
                                        style={{
                                            backgroundColor: style.color.primary,
                                            borderColor: style.color.secondary,
                                            color: style.color.font,
                                        }}
                                        key={card}>
                                    {style.name} × {count}
                                </Button>

                            );
                        })}
                    </Box>
                </Tooltip>}
            <Tooltip title={boatTooltip} open arrow placement={"right"}>
                <Box className={classes.boats}>
                    {gamePlayer.boats.map((card, index) => boat(index))}
                </Box>
            </Tooltip>
        </Paper>
    )
};

export default HSSLPlayerView;