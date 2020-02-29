import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {LCGame, LCMessage} from "../model/board";
import {HostMessage, JoinMessage, ReadyMessage, WatchMessage} from "../../common/model/multi-player/message";
import Typography from "@material-ui/core/Typography";
import {LCDrawMessage, LCPlayMessage, LCScoreMessage} from "../model/message";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LCCard} from "../model/card";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {LCTheme} from "../theme";
import {Divider} from "@material-ui/core";

const useStyles = makeStyles({});

type LCMessageProp = {
    game: LCGame
    message: LCMessage
}

const LCMessageView: React.FunctionComponent<LCMessageProp> = (props) => {
    let msg = props.message;
    if (msg instanceof JoinMessage) {
        return <Typography>
            [{msg.who}] 加入了游戏
        </Typography>
    } else if (msg instanceof WatchMessage) {
        return <Typography>
            [{msg.who}] 开始旁观
        </Typography>
    } else if (msg instanceof ReadyMessage) {
        return <Typography>
            [{msg.who}] {msg.ready ? "准备就绪" : "取消准备"}
        </Typography>
    } else if (msg === HostMessage.START) {
        return <Typography>
            游戏开始
        </Typography>
    } else if (msg === HostMessage.OVER) {
        return <Typography>
            游戏结束
        </Typography>
    } else if (msg === HostMessage.CONTINUE) {
        return <Typography>
            游戏继续
        </Typography>
    } else if (msg instanceof LCPlayMessage) {
        let id = props.game.host.players.value[msg.seat].id;
        return (
            <React.Fragment>
                [{id}] {msg.drop ? "弃置了" : "打出了"}
                <CardMessage card={msg.card}/>
            </React.Fragment>
        )
    } else if (msg instanceof LCDrawMessage) {
        let id = props.game.host.players.value[msg.seat].id;
        return (
            <React.Fragment>
                [{id}] {msg.type === "deck" ? "从牌库摸起了" : "从弃牌堆摸起了"}
                {msg.card ? <CardMessage card={msg.card}/> : "一张牌"}
            </React.Fragment>
        )
    } else if (msg instanceof LCScoreMessage) {
        let score = msg.score;
        return <div>
            <Divider/>
            最终得分:<br/>
            <ul>
                {msg.players.map((p, i) => (
                    <li key={i}>[{p.id}]: {score[p.seat].sum}</li>
                ))}
            </ul>
            [{msg.winner.id}] 获得了胜利<br/>
            <Divider/>
        </div>
    }
    return (null)
};

function CardMessage(props: { card: LCCard }) {
    const point = props.card.isDouble() ? <FontAwesomeIcon icon={faHandshake}/> :
        <Typography>{props.card.point}</Typography>;
    return <div style={{
        display: "inline-block",
        background: LCTheme.cardBackground(props.card.color, "square"),
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
        minWidth: 20,
        textAlign: "center",
    }}>
        {point}
    </div>
}

export default LCMessageView;