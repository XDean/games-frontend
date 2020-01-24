import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import LCHandView from "./hand";
import {LCCard} from "../model/model";
import LCDeckView from "./deck";

const useStyles = makeStyles({});

type BoardProp = {
    id: string
}

const LCBoard: React.FunctionComponent<BoardProp> = (props) => {
    return (
        <Box>
            <LCHandView cards={[
                new LCCard("unknown"),
                new LCCard(1, "double"),
                new LCCard(2, 2),
                new LCCard(3, 9),
                new LCCard(4, 7)
            ]} onPlayCard={c => {
                console.log(c)
            }} vertical={false} reverse={false}/>
            <LCHandView cards={[
                new LCCard("unknown"),
                new LCCard(1, "double"),
                new LCCard(2, 2),
                new LCCard(3, 9),
                new LCCard(4, 7)
            ]} onPlayCard={c => {
                console.log(c)
            }} vertical={false} reverse={true}/>
            <LCHandView cards={[
                new LCCard("unknown"),
                new LCCard(1, "double"),
                new LCCard(2, 2),
                new LCCard(3, 9),
                new LCCard(4, 7)
            ]} onPlayCard={c => {
                console.log(c)
            }} vertical={true} reverse={false}/>
            <LCHandView cards={[
                new LCCard("unknown"),
                new LCCard(1, "double"),
                new LCCard(2, 2),
                new LCCard(3, 9),
                new LCCard(4, 7)
            ]} onPlayCard={c => {
                console.log(c)
            }} vertical={true} reverse={true}/>
        </Box>
    )
};

export default LCBoard;