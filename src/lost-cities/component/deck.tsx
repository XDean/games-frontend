import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import {LCCard} from "../model/model";
import LCCardView from "./card";
import LCCards from "./hand";

const useStyles = makeStyles({});

type LCDeckProp = {}

const LCDeckView: React.FunctionComponent<LCDeckProp> = (props) => {
    return (
        <Box>
            <LCCards cards={[
                new LCCard(1, "double"),
                new LCCard(2, 2),
                new LCCard(2, 3),
                new LCCard(3, 4),
            ]}/>
        </Box>
    )
};

export default LCDeckView;