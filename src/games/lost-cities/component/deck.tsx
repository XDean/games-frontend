import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Typography} from "@material-ui/core";
import LCCardView from "./card";
import {AppTheme} from "../../../theme";
import {LCGame} from "../model/board";
import {useStateByProp} from "../../../util/property";
import {LCTheme} from "../theme";

const useStyles = makeStyles<typeof AppTheme & typeof LCTheme, LCDeckProp>(theme => createStyles({
        root: {
            width: "min-content",
            padding: theme.spacing(1),
        },
        deck: {
            position: "relative",
            width: 100,
            height: 160,
            marginTop: theme.spacing(1),
            cursor: "pointer",
        },
        cardBox: {
            position: "absolute",
        },
        card: {
            boxShadow: "none",
        },
        selected: {
            boxShadow: theme.selectedShadow,
        }
    }))
;

type LCDeckProp = {
    game: LCGame,
}

const LCDeckView: React.FunctionComponent<LCDeckProp> = (props) => {
    const classes = useStyles(props);

    const deck = useStateByProp(props.game.board.deck);
    const drawType = useStateByProp(props.game.playInfo.drawType);

    function onSelectDrawType() {
        props.game.playInfo.drawType.update(t => t === "deck" ? "none" : "deck");
    }

    return (
        <Box className={`${classes.root} ${drawType === "deck" ? classes.selected : ""}`}>
            <Typography>
                牌库剩余：{deck}
            </Typography>
            <Box className={classes.deck} onClick={onSelectDrawType}>
                {new Array(deck).fill(0).map((z, i) => (
                    <Box className={classes.cardBox} style={{left: i * 0.3, top: i * 0.2}} key={i}>
                        <LCCardView unknown className={classes.card}/>
                    </Box>
                ))}
            </Box>
        </Box>
    )
};

export default LCDeckView;