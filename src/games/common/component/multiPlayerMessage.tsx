import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    HostMessage,
    JoinMessage,
    MultiPlayerMessage,
    ReadyMessage,
    SwapSeatMessage,
    WatchMessage
} from "../model/multi-player/message";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({});

type MultiPlayerMessageProp = {
    message: MultiPlayerMessage
}

const MultiPlayerMessageView: React.FunctionComponent<MultiPlayerMessageProp> = (props) => {
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
    } else if (msg instanceof SwapSeatMessage) {
        return <Typography>
            [{msg.from.id}] 与 {msg.to.isEmpty()?"空座位":`[${msg.to.id}]`} 交换了座位
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
    }
    return (null)
};

export default MultiPlayerMessageView;