import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Box, Typography} from "@material-ui/core";
import HSSLCardView from "./card";
import {AppTheme} from "../../../theme";
import {HSSLGame} from "../model/game";
import {useStateByProp} from "../../../util/property";
import {HSSLTheme} from "../theme";

const useStyles = makeStyles<typeof AppTheme & typeof HSSLTheme, HSSLDeckProp>(theme => createStyles({
        root: {
            width: "min-content",
            padding: theme.spacing(1),
        },
        deck: {
            position: "relative",
            width: 90,
            height: 130,
            marginTop: theme.spacing(1),
            cursor: "pointer",
        },
        cardBox: {
            position: "absolute",
        },
        card: {
            boxShadow: "none",
        },
    }))
;

type HSSLDeckProp = {
    game: HSSLGame,
}

const HSSLDeckView: React.FunctionComponent<HSSLDeckProp> = (props) => {
    const classes = useStyles(props);
    const deck = useStateByProp(props.game.board.deck);

    return (
        <Box className={`${classes.root}`}>
            <Box className={classes.deck}>
                {new Array(deck).fill(0).map((z, i) => (
                    <Box className={classes.cardBox} style={{left: (i - deck / 3) * 0.3, top: (i - deck / 3) * 0.2}}
                         key={i}>
                        <HSSLCardView card={"empty"}/>
                    </Box>
                ))}
            </Box>
            <Typography align={"center"}>
                剩余：{deck}
            </Typography>
        </Box>
    )
};

export default HSSLDeckView;