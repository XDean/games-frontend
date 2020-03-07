import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Chip, Paper, Tooltip} from "@material-ui/core";
import {HSSLGame} from "../model/game";
import {useStateByProp} from "../../../util/property";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: 300,
        height: 150,
        padding: theme.spacing(1),
    },
    name: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
    },
    header: {
        display: "flex",
        alignItems: "center",
    },
    tag: {
        marginLeft: theme.spacing(1),
    },
    swap: {
        marginLeft: theme.spacing(1),
    },
    ready: {
        marginLeft: theme.spacing(1),
    },
    start: {
        marginLeft: theme.spacing(1),
    },
}));

type HSSLPlayerProp = {
    game: HSSLGame
    seat: number
}

const HSSLPlayerView: React.FunctionComponent<HSSLPlayerProp> = (props) => {
    const classes = useStyles();

    const players = useStateByProp(props.game.host.players);
    const mySeat = useStateByProp(props.game.host.mySeat);
    const myRole = useStateByProp(props.game.host.myRole);

    const hostPlayer = players[props.seat];
    const myPlayer = players[mySeat];
    const gamePlayer = props.game.board.players[props.seat];

    const playing = useStateByProp(props.game.host.playing);
    const current = useStateByProp(props.game.board.current);

    function tag(text: string) {
        return <Chip label={text} variant={"outlined"} size={"small"} className={classes.tag}/>;
    }

    // tag
    const hostTag = !playing && hostPlayer.host && tag("房主");
    const readyTag = !playing && props.seat !== mySeat && tag(hostPlayer.ready ? "已准备" : "未准备");

    //action
    const swap = myRole === "play" && props.seat !== mySeat && !playing && !hostPlayer.ready && !myPlayer.ready &&
        <Chip label={"交换位置"} variant={"outlined"} size={"small"} className={classes.swap} clickable onClick={() => {
            props.game.host.swapSeat(props.seat)
        }}/>;
    const ready = myRole === "play" && props.seat === mySeat && !playing &&
        <Chip label={hostPlayer.ready ? "取消准备" : "点击准备"} variant={"outlined"} size={"small"} className={classes.ready}
              clickable onClick={() => {
            props.game.host.ready(!hostPlayer.ready)
        }}/>;
    const allReady = props.game.host.isAllReady();
    const start = myRole === "play" && props.seat === mySeat && !playing && myPlayer.host && myPlayer.ready &&
        <Tooltip title={"等待所有玩家准备"} open={!allReady} arrow placement={"top"}>
            <Chip label={"开始游戏"} variant={"outlined"} size={"small"} className={classes.start}
                  disabled={!allReady} clickable onClick={() => props.game.host.startGame()}/>
        </Tooltip>;

    if (hostPlayer.isEmpty()) {
        return <Paper elevation={3} className={classes.root}>
            <Typography component={"span"}>
                等待玩家加入
            </Typography>
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
        </Paper>
    )
};

export default HSSLPlayerView;