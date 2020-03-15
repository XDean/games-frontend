import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {MultiPlayerMessage} from "../../common/model/multi-player/message";
import {HSSLCard, HSSLGame, HSSLItem} from "../model/game";
import {
    HSSLBanyunMessage,
    HSSLBiyueMessage,
    HSSLBuyMessage,
    HSSLDrawMessage,
    HSSLMessage,
    HSSLPlayMessage,
    HSSLSetMessage,
    HSSLSkipMessage,
    HSSLStatusMessage,
    HSSLSwapMessage
} from "../model/message";
import MultiPlayerMessageView from "../../common/component/multiPlayerMessage";
import Typography from "@material-ui/core/Typography";
import {HSSLTheme} from "../theme";
import {Divider} from "@material-ui/core";

const useStyles = makeStyles({});

type HSSLMessageProp = {
    game: HSSLGame
    message: HSSLMessage
}

const HSSLMessageView: React.FunctionComponent<HSSLMessageProp> = (props) => {
    const msg = props.message;
    if (msg instanceof HSSLSetMessage) {
        return <Typography>
            [{props.game.host.players.value[msg.seat].id}] 选择了 <CardMessage card={msg.good}/> 装船
        </Typography>
    } else if (msg instanceof HSSLBuyMessage) {
        return (
            <React.Fragment>
                <Typography>
                    [{props.game.host.players.value[msg.seat].id}] 购买了 [{HSSLTheme.itemStyle(msg.item).name}]
                </Typography>
                {msg.item === HSSLItem.Boat && <Typography>
                    [{props.game.host.players.value[msg.seat].id}] 选择了 <CardMessage card={msg.good}/> 装船
                </Typography>}
            </React.Fragment>
        )
    } else if (msg instanceof HSSLSwapMessage) {
        return <Typography>
            [{props.game.host.players.value[msg.seat].id}] 换货
            {msg.old.map((c, i) => <CardMessage card={c} key={i}/>)} 👉
            {msg.now.map((c, i) => <CardMessage card={c} key={i}/>)}
        </Typography>
    } else if (msg instanceof HSSLBanyunMessage) {
        return <Typography>
            [{props.game.host.players.value[msg.seat].id}] 换货
            <CardMessage card={msg.old}/>) 👉
            <CardMessage card={msg.now}/>)
        </Typography>
    } else if (msg instanceof HSSLSkipMessage) {
        return <Typography>
            [{props.game.host.players.value[msg.seat].id}] 跳过了 换货/购买 阶段
        </Typography>
    } else if (msg instanceof HSSLPlayMessage) {
        return (
            <React.Fragment>
                <Typography>
                    [{props.game.host.players.value[msg.seat].id}] 打出了 {msg.count} 张 <CardMessage card={msg.card}/> 覆盖
                    {msg.was.map((c, i) => <CardMessage card={c} key={i}/>)}
                </Typography>
                {msg.revenue.map((r, seat) => r === 0 ? null : (
                    <Typography style={{marginLeft: 20}} key={seat}>
                        [{props.game.host.players.value[seat].id}]
                        获得了 {msg.guanshui[seat] ? `${r - 2} + 2` : r} 金币
                    </Typography>
                ))}
            </React.Fragment>
        )
    } else if (msg instanceof HSSLDrawMessage) {
        return <Typography>
            [{props.game.host.players.value[msg.seat].id}] 从牌库抽取
            {msg.known ? msg.cards.map((c, i) => <CardMessage card={c} key={i}/>) : ` ${msg.cards.length} 张牌`}
        </Typography>
    } else if (msg instanceof HSSLBiyueMessage) {
        return <Typography>
            [{props.game.host.players.value[msg.seat].id}] 通过交易所额外抽取
            {msg.known ? <CardMessage card={msg.card}/> : ` 1 张牌`}
        </Typography>;
    } else if (msg instanceof HSSLStatusMessage) {
        if (msg.wasSeat !== msg.seat) {
            return <Divider variant={"fullWidth"}/>
        }
    }
    return <MultiPlayerMessageView message={msg as MultiPlayerMessage}/>
};

function CardMessage(props: { card: HSSLCard }) {
    const style = HSSLTheme.cardStyle(props.card);
    return <Typography component={"span"} style={{
        fontSize: "0.85rem",
        backgroundColor: style.color.primary,
        color: style.color.font,
        padding: 2,
        marginLeft: 4,
        wordBreak: "keep-all",
    }}>
        {style.name}
    </Typography>
}

export default HSSLMessageView;