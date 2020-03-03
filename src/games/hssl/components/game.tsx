import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import {HSSLTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {AppTheme} from "../../../theme";
import {useStateByProp} from "../../../util/property";
import LogView from "../../common/component/log";
import {HSSLGame} from "../model/game";
import HSSLMessageView from "./message";
import CubeView from "../../common/component/cube";

const useStyles = makeStyles<typeof AppTheme & typeof HSSLTheme>(theme => createStyles({
    root: {
        height: "100%",
        margin: "auto",
        position: "relative",
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(2, 5),
        },
    },
    logchat: {
        height: "100%",
        width: "70%",
        padding: theme.spacing(1),
        display: "grid",
        gridTemplateColumns: "100%",
        gridTemplateRows: "50% 50%",
        gridRowGap: theme.spacing(1),
    },
    board: {
        height: "100%",
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 1),
        },
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(1, 4),
        },
    },
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
            <Grid container wrap={"nowrap"} alignItems={"center"} className={classes.root}>
                <Grid item className={classes.logchat}>
                    <LogView model={props.game.plugins.log}
                             handle={msg => <HSSLMessageView message={msg} game={props.game}/>}/>
                    <ChatView controller={props.game.plugins.chat}/>
                </Grid>
                <Grid item>
                    <CubeView color={"#ff0000"} borderColor={"#aa0000"} size={20}/>
                </Grid>
                <Grid item>
                    <CubeView color={"#00ff00"} borderColor={"#00aa00"} size={20}/>
                </Grid>
                <Grid item>
                    <CubeView color={"#0000ff"} borderColor={"#0000aa"} size={20}/>
                </Grid>
                <Grid item>
                    <CubeView color={"#ffff00"} borderColor={"#aaaa00"} size={20}/>
                </Grid>
            </Grid>
        </React.Fragment>
    )
};

export default HSSLGameView;