import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {LCCard} from "../../../lost-cities/model/model";
import LCCardView from "../../../lost-cities/component/card";
import {LCBoard} from "../model/board";
import {LCSingleScore} from "../model/score";

const useStyles = makeStyles({});

type LCScoreBoardProp = {
    board: LCBoard
}

const LCScoreBoardView: React.FunctionComponent<LCScoreBoardProp> = (props) => {
    const score = props.board.calcScore();
    const [details, setDetails] = useState(false);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            显示细节
                            <Switch color="primary" size={"small"} checked={details}
                                    onChange={e => setDetails(d => !d)}/>
                        </TableCell>
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
                                    <TableCell align={"center"} key={player}>
                                        {details ?
                                            <LineScoreView score={score[player].scores[color]}/> :
                                            <Typography>{score[player].scores[color].sum}</Typography>
                                        }
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    }
                    <TableRow>
                        <TableCell>总分</TableCell>
                        {[0, 1].map(player =>
                            <TableCell align={"center"} key={player}>
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
        return <Typography>
            {`(${props.score.score} - 20) x ${props.score.times} + ${props.score.bonus ? 20 : 0} = ${props.score.sum}`}
        </Typography>
    } else {
        return <Typography>0</Typography>;
    }
}

export default LCScoreBoardView;