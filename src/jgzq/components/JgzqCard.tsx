import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import attack from "../images/attack.png"
import hp from "../images/hp.png"
import yrzcz from "../images/cards/1/yurenzhaochaozhe.png"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            position: "relative",
            height: 173,
            width: 125,
            borderRadius: 15,
            backgroundImage: `url(${yrzcz})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
        },
        attack: {
            backgroundImage: `url(${attack})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            width: 50,
            height: 50,
            left: -10,
            bottom: -10,
            textAlign: "center",
            paddingLeft: 3,
            fontSize: 32,
            lineHeight: "55px",
            fontWeight: "bold",
            color: "white",
            "-webkit-text-stroke": "1px black",
            "text-stroke": "1px black",
        },
        hp: {
            backgroundImage: `url(${hp})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            width: 50,
            height: 50,
            right: -10,
            bottom: -10,
            textAlign: "center",
            paddingLeft: 1,
            fontSize: 32,
            lineHeight: "55px",
            fontWeight: "bold",
            color: "white",
            "-webkit-text-stroke": "1px black",
            "text-stroke": "1px black",
        }
    }),
);

const JgzqCard: React.FunctionComponent = () => {
    const classes = useStyles();

    return (
        <Box className={classes.card}>
            <Box className={classes.attack}>
                1
            </Box>
            <Box className={classes.hp}>
                2
            </Box>
        </Box>
    );
};

export default JgzqCard