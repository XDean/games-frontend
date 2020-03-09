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
        },
        deck: {
            position: "relative",
            width: 100,
            height: 140,
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
                    <Box className={classes.cardBox} style={{left: (i) * 0.3 + 12.5 - 0.15 * deck, top: (i) * 0.2}}
                         key={i}>
                        <HSSLCardView card={-1}/>
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