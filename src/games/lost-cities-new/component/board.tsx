import React, {useEffect} from 'react';
import {createStyles, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards} from "../model/card";
import {LCTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {LCGame} from "../model/board";
import {SocketTopicSender} from "../../common/model/socket";
import LCColorBoardView from "./color-board";
import {AppTheme} from "../../../theme";
import {useStateByProp} from "../../../util/property";

const useStyles = makeStyles<typeof AppTheme>(theme => createStyles({
    root: {
        height: "100%",
        padding: theme.spacing(4),
        maxWidth: 1200,
        margin: "auto",
    },
    chat: {
        height: 200,
        position: "relative",
        padding: theme.spacing(1),
    },
    otherHand: {
        padding: theme.spacing(1),
    },
    myHand: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(3),
    }
}));

type LCBoardProp = {
    game: LCGame
    sender: SocketTopicSender
}

const LCBoardView: React.FunctionComponent<LCBoardProp> = (props) => {
    const classes = useStyles();
    const role = useStateByProp(props.game.host.myRole, "none")[0];
    const playing = useStateByProp(props.game.host.playing, false)[0];
    const hand = useStateByProp(props.game.board.hand, [[],[]])[0];
    const mySeat = useStateByProp(props.game.host.mySeat, 0)[0];

    return (
        <ThemeProvider theme={outer => ({...outer, ...LCTheme})}>
            <Grid container className={classes.root} justify={"center"} alignItems={"center"}>
                <Grid item xs={5} className={classes.otherHand}>
                    <LCHandView cards={createCards(8)} unknown/>
                </Grid>
                <Grid item xs={5}>
                    <LCHandView cards={createCards(8)} unknown/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={0} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={1} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={2} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={3} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={12}>
                    <LCColorBoardView board={props.game.board} color={4} rightSeat={props.game.host.mySeat.value}/>
                </Grid>
                <Grid item xs={5} className={classes.chat}>
                    <ChatView controller={props.game.plugins.chat} sender={props.sender}/>
                </Grid>
                <Grid item xs={5} className={classes.myHand}>
                    <LCHandView cards={hand[mySeat]}/>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
};

export default LCBoardView;