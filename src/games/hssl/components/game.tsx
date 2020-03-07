import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import {HSSLTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {AppTheme} from "../../../theme";
import {useStateByProp} from "../../../util/property";
import LogView from "../../common/component/log";
import {HSSLGame} from "../model/game";
import HSSLMessageView from "./message";
import HSSLPlayerView from "./player";

const useStyles = makeStyles<typeof AppTheme & typeof HSSLTheme>(theme => createStyles({
    root: {
        height: "90%",
        margin: "auto",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "30% 70%",
        gridTemplateRows: "100%",
        gridRowGap: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(2, 5),
        },
    },
    logchat: {
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "50% 50%",
        gridRowGap: theme.spacing(1),
    },
    board: {
        position: "relative",
        margin: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1, 1),
        },
    },
    player0: {
        position: "absolute",
        right: 100,
        bottom: 0,
    },
    player1: {
        position: "absolute",
        left: 0,
        bottom: 0,
    },
    player2: {
        position: "absolute",
        left: 0,
        top: 0,
    },
    player3: {
        position: "absolute",
        right: 100,
        top: 0,
    },
    //
    rightContainer: {
        height: "100%",
        overflow: "auto",
        padding: theme.spacing(0, 1),
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(0),
        },
        [theme.breakpoints.up('lg')]: {
            marginLeft: theme.spacing(4),
        },
    },
    button: {
        minWidth: 0,
        margin: 3,
        padding: "3px 5px"
    },
    myButtonBar: {
        minWidth: "fit-content",
        marginLeft: theme.spacing(1),
    },
    otherButtonBar: {
        minWidth: "fit-content",
        marginLeft: theme.spacing(1),
        marginTop: 20,
    },
    infoContainer: {
        marginLeft: theme.spacing(4),
        display: "grid",
        gridTemplateColumns: "1pr",
        justifyItems: "center"
    },
    info: {
        padding: theme.spacing(1, 2),
        margin: theme.spacing(1),
    },
}));

type Operation = "selectCard" | "selectPlayType" | "selectDraw" | "submit" | "idle";

enum HandSort {
    NULL = 0,
    COLOR,
    POINT
}

type HSSLGameProp = {
    game: HSSLGame
}

const HSSLGameView: React.FunctionComponent<HSSLGameProp> = (props) => {
    const classes = useStyles();
    const role = useStateByProp(props.game.host.myRole);
    const playing = useStateByProp(props.game.host.playing);
    const status = useStateByProp(props.game.board.status);

    const mySeat = useStateByProp(props.game.host.mySeat);
    const otherSeat = 1 - mySeat;

    const players = useStateByProp(props.game.host.players);

    const current = useStateByProp(props.game.board.current);

    return (
        <React.Fragment>
            <Box className={classes.root}>
                <Box className={classes.logchat}>
                    <LogView model={props.game.plugins.log}
                             handle={msg => <HSSLMessageView message={msg} game={props.game}/>}/>
                    <ChatView controller={props.game.plugins.chat}/>
                </Box>
                <Box className={classes.board}>
                    <Box className={classes.player0}>
                        <HSSLPlayerView game={props.game} seat={mySeat}/>
                    </Box>
                    <Box className={classes.player1}>
                        <HSSLPlayerView game={props.game} seat={(mySeat+1)%4} swap/>
                    </Box>
                    <Box className={classes.player2}>
                        <HSSLPlayerView game={props.game} seat={(mySeat+2)%4} swap/>
                    </Box>
                    <Box className={classes.player3}>
                        <HSSLPlayerView game={props.game} seat={(mySeat+3)%4} swap/>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    )
};

export default HSSLGameView;