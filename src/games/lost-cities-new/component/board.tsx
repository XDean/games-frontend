import React from 'react';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards} from "../model/card";
import {LCTheme} from "../theme";

const useStyles = makeStyles({});

type LCBoardProp = {}

const LCBoardView: React.FunctionComponent<LCBoardProp> = (props) => {
    return (
        <ThemeProvider theme={outer => ({...outer, ...LCTheme})}>
            <Box>
                <LCHandView cards={createCards(8)} unknown/>
            </Box>
        </ThemeProvider>
    )
};

export default LCBoardView;