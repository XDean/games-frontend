import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import {LCCard} from "../model/model";
import LCCards from "./cards";

const useStyles = makeStyles({});

type LCDeckProp = {
    deck: number,
    board: LCCard[][][], //player -> color -> index
    drop: LCCard[][], //color -> index
}

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