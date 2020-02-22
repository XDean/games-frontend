import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Zoom
} from "@material-ui/core";
import {LCCard} from "../../../lost-cities/model/model";
import LCCardView from "../../../lost-cities/component/card";
import {LCGameBoard} from "../model/board";
import {LCSingleScore} from "../model/score";

const useStyles = makeStyles({});

type LCScoreBoardProp = {
    board: LCGameBoard
}

const LCScoreBoardView: React.FunctionComponent<LCScoreBoardProp> = (props) => {
    let score = props.board.calcScore();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>对手得分</TableCell>
                        <TableCell>你的得分</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        LCCard.Colors.map(color => (
                            <TableRow key={color}>
                                <TableCell>
                                    <LCCardView card={new LCCard(0, color)} mini/>
                                </TableCell>
                                {[0, 1].map(player =>
                                    <TableCell align={"center"}>
                                        <Tooltip title={<LineScoreView score={score[player].scores[color]}/>} arrow
                                                 TransitionComponent={Zoom}>
                                            <Box>
                                                {score[player].scores[color].sum}
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    }
                    <TableRow>
                        <TableCell>总分</TableCell>
                        {[0, 1].map(player =>
                            <TableCell align={"center"}>
                                {score[player].sum}
                            </TableCell>
                        )}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
};

function LineScoreView(props: { score: LCSingleScore }) {
    if (props.score.develop) {
        return <Box>
            {`(${props.score.score} - 20) x ${props.score.times} + ${props.score.bonus ? 20 : 0} = ${props.score.sum}`}
        </Box>
    } else {
        return <Box>0</Box>;
    }
}

export default LCScoreBoardView;