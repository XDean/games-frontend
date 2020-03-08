import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Chip, Paper, Tooltip} from "@material-ui/core";
import {HSSLGame, HSSLSpecialItems} from "../model/game";
import {useStateByProp} from "../../../util/property";
import Typography from "@material-ui/core/Typography";
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import {HSSLTheme} from "../theme";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: 300,
        height: 160,
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gridTemplateRows: "auto 1fr 1fr",
        gridRowGap: theme.spacing(1),
    },
    empty: {
        width: 300,
        height: 160,
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
    },
    name: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
    },
    header: {
        gridColumnStart: "span 2",
        display: "flex",
        alignItems: "center",
    },
    tag: {
        margin: theme.spacing(0, 0.25),
    },
    action: {
        margin: theme.spacing(0, 0.25),
    },
    items: {
        display: "grid",
        gridTemplateRows: "repeat(4, auto)",
        gridRowGap: theme.spacing(1),
    },
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

    function tag(text: string) {
        return <Chip label={text} variant={"outlined"} size={"small"} className={classes.tag}/>;
    }

    // tag
    const hostTag = !playing && hostPlayer.host && tag("房主");
    const readyTag = !playing && props.seat !== mySeat && tag(hostPlayer.ready ? "已准备" : "未准备");

    //action
    const swap = myRole === "play" && props.seat !== mySeat && !playing && !hostPlayer.ready && !myHostPlayer.ready &&
        <Chip label={"交换位置"} variant={"outlined"} size={"small"} className={classes.action} clickable onClick={() => {
            props.game.host.swapSeat(props.seat)
        }}/>;
    const ready = myRole === "play" && props.seat === mySeat && !playing &&
        <Chip label={hostPlayer.ready ? "取消准备" : "点击准备"} variant={"outlined"} size={"small"} className={classes.action}
              clickable onClick={() => {
            props.game.host.ready(!hostPlayer.ready)
        }}/>;
    const allReady = props.game.host.isAllReady();
    const start = myRole === "play" && props.seat === mySeat && !playing && myHostPlayer.host && myHostPlayer.ready &&
        <Tooltip title={"等待所有玩家准备"} open={!allReady} arrow placement={"top"}>
            <Chip label={"开始游戏"} variant={"outlined"} size={"small"} className={classes.action}
                  disabled={!allReady} clickable onClick={() => props.game.host.startGame()}/>
        </Tooltip>;

    if (hostPlayer.isEmpty()) {
        return <Paper elevation={3} className={classes.empty}>
            <Box>
                {playing ? "空位" : "等待玩家加入"}
            </Box>
            {swap}
        </Paper>
    }

    return (
        <Paper elevation={3} className={classes.root}>
            <Box className={classes.header}>
                <Typography component={"span"} className={classes.name}>
                    {hostPlayer.id}
                </Typography>
                {hostTag}
                {readyTag}
                {swap}
                {ready}
                {start}
            </Box>
            <Box className={classes.items}>
                <Chip icon={<MonetizationOnOutlinedIcon/>}
                      label={gamePlayer.points === -1 ? "未知" : gamePlayer.points} variant={"outlined"} size={"small"}/>
                {HSSLSpecialItems.map((item, index) => (
                    <Chip label={HSSLTheme.itemStyle(item).name} variant={"outlined"} size={"small"}
                          disabled={!gamePlayer.items[item]} clickable key={index}/>
                ))}
            </Box>
        </Paper>
    )
};

export default HSSLPlayerView;