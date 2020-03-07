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
    }
}));

type HSSLPlayerProp = {
    game: HSSLGame
    seat: number
    swap?: boolean
}

const HSSLPlayerView: React.FunctionComponent<HSSLPlayerProp> = (props) => {
    const classes = useStyles();
    const hostPlayer = useStateByProp(props.game.host.players)[props.seat];
    const gamePlayer = props.game.board.players[props.seat];

    const playing = useStateByProp(props.game.host.playing);
    const current = useStateByProp(props.game.board.current);

    const swap = props.swap && !playing && !hostPlayer.ready &&
        <Chip label={"交换位置"} variant={"outlined"} size={"small"} className={classes.swap} clickable onClick={() => {
            props.game.host.swapSeat(props.seat)
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
            </Box>
        </Paper>
    )
};

export default HSSLPlayerView;