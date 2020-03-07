import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Chip, Paper} from "@material-ui/core";
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

    const swap = myRole === "play" && props.seat !== mySeat && !playing && !hostPlayer.ready && !myPlayer.ready &&
        <Chip label={"交换位置"} variant={"outlined"} size={"small"} className={classes.swap} clickable onClick={() => {
            props.game.host.swapSeat(props.seat)
        }}/>;
    const ready = myRole === "play" && props.seat === mySeat && !playing &&
        <Chip label={hostPlayer.ready ? "取消准备" : "点击准备"} variant={"outlined"} size={"small"} className={classes.ready}
              clickable onClick={() => {
            props.game.host.ready(!hostPlayer.ready)
        }}/>;

    if (hostPlayer.isEmpty()) {
        return <Paper elevation={3} className={classes.root}>
            <Typography component={"span"}>
                等待玩家加入
            </Typography>
            {swap}
        </Paper>
    }

    const tag = function (): string {
        if (playing) {
            if (current === props.seat) {
                return "进行回合"
            } else {
                return ""
            }
        } else {
            if (hostPlayer.host) {
                return "房主"
            } else if (hostPlayer.ready) {
                return "已准备"
            } else {
                return "未准备"
            }
        }
    }();

    return (
        <Paper elevation={3} className={classes.root}>
            <Box className={classes.header}>
                <Typography component={"span"} className={classes.name}>
                    {hostPlayer.id}
                </Typography>
                {tag && <Chip label={tag} variant={"outlined"} size={"small"} className={classes.tag}/>}
                {swap}
                {ready}
            </Box>
        </Paper>
    )
};

export default HSSLPlayerView;