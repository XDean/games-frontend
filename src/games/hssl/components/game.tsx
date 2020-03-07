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
import HSSLBoardView from "./board";

const useStyles = makeStyles<typeof AppTheme & typeof HSSLTheme>(theme => createStyles({
    root: {
        height: "100%",
        boxSizing: "border-box",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "minmax(250px, 2fr) minmax(auto, 5fr) minmax(0, 1fr)",
        gridRowGap: theme.spacing(1),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1, 5),
        },
    },
    logchat: {
        minHeight: 0,
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gridRowGap: theme.spacing(1),
    },
    game: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto 1fr auto",
        gridRowGap: theme.spacing(1),
        gridColumnGap: theme.spacing(1),
        justifyItems: "center",
        alignItems: "center",
    },
    board: {
        gridColumnStart: "span 2",
    },
}));

type Operation = "selectCard" | "selectPlayType" | "selectDraw" | "submit" | "idle";

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
                <Box className={classes.game}>
                    <Box>
                        <HSSLPlayerView game={props.game} seat={(mySeat + 2) % 4}/>
                    </Box>
                    <Box>
                        <HSSLPlayerView game={props.game} seat={(mySeat + 3) % 4}/>
                    </Box>
                    <Box className={classes.board}>
                        <HSSLBoardView game={props.game}/>
                    </Box>
                    <Box>
                        <HSSLPlayerView game={props.game} seat={(mySeat + 1) % 4}/>
                    </Box>
                    <Box>
                        <HSSLPlayerView game={props.game} seat={mySeat}/>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    )
};

export default HSSLGameView;