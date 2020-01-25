import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import LCCards from "./hand";
import {randomCards} from "../model/mock";

const useStyles = makeStyles({});

type BoardProp = {
    id: string
}

const LCBoard: React.FunctionComponent<BoardProp> = (props) => {
    return (
        <Box>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={false} reverse={false}/>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={false} reverse={true}/>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={true} reverse={false}/>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={true} reverse={true}/>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={false} reverse={false} mini={true}/>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={false} reverse={true} mini={true}/>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={true} reverse={false} mini={true}/>
            <LCCards cards={randomCards(5)} onPlayCard={c => {
                console.log(c)
            }} vertical={true} reverse={true} mini={true}/>
        </Box>
    )
};

export default LCBoard;