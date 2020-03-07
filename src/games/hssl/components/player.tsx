import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Button, Chip, Paper} from "@material-ui/core";
import {HSSLGame} from "../model/game";
import {useStateByProp} from "../../../util/property";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: 300,
        height: 200,
        padding: theme.spacing(1),
    },
    header: {
        display: "flex",
        alignItems: "center",
    },
    tag: {
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

    const canSwap = props.swap && !playing && !hostPlayer.ready;

    if (hostPlayer.isEmpty()) {
        return <Paper elevation={3} className={classes.root}>
            等待加入
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
                <Typography component={"span"}>
                    {hostPlayer.id}
                </Typography>
                {tag && <Chip label={tag} variant={"outlined"} size={"small"} className={classes.tag}/>}
                {canSwap && <Button variant={"outlined"}>交換位置</Button>}
            </Box>
        </Paper>
    )
};

export default HSSLPlayerView;