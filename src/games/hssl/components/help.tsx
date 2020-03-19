import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Chip, Divider, Link, Paper, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Rating from "@material-ui/lab/Rating";
import playerImage from "../resources/help/player.png"
import {HSSLCards} from "../model/game";
import {HSSLTheme} from "../theme";

const useStyles = makeStyles(theme => createStyles({
    title: {
        padding: theme.spacing(1, 2),
    },
    content: {
        padding: theme.spacing(2),
        overflowY: "auto",
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

type HSSLHelpProp = {
    onClose: () => void
}

const HSSLHelpView: React.FunctionComponent<HSSLHelpProp> = (props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant={"h3"} className={classes.title}>
                海上丝路 (Merchants)
            </Typography>
            <IconButton className={classes.closeButton} onClick={props.onClose}>
                <CloseIcon/>
            </IconButton>
            <Divider/>
            <Paper className={classes.content}>
                <Typography>
                    人数： 2 ~ 4 人
                </Typography>
                <Typography>
                    时间： 20 ~ 30 分钟
                </Typography>
                <Typography>
                    难度：<Rating name={"score"} value={1.73} precision={0.01} style={{verticalAlign: "middle"}}/>
                </Typography>
                <Typography>
                    作者： <Link href="https://boardgamegeek.com/boardgamedesigner/2/reiner-knizia"
                              target={"_blank"}> Reiner Knizia </Link>
                </Typography>
                <Typography paragraph>
                    玩家扮演一支海上商队，往返于码头与市场之间，为城市带来珍奇的货物。<br/>
                    你需要仔细观察并引领市场的潮流，以赚取成倍的金币。<br/>
                    你还要与其他商队保持紧密的联系，合作共赢才能获得最大化的利润。<br/>
                    同时你也要时刻注意市场的动向，切不可迷失，被瞬息万变的市场甩在身后。<br/>
                    究竟谁能拥有最多的金币，获得最终的胜利呢？
                </Typography>
                <Typography variant={"h4"} paragraph>
                    游戏配置
                </Typography>
                <Typography>
                    桌面中间是公共面板，包括码头，市场，商店，牌堆。
                </Typography>
                <Typography>
                    货物一共有6种，{HSSLCards.map(c => {
                    let style = HSSLTheme.cardStyle(c);
                    return <span key={c} style={{
                        color: style.color.font,
                        backgroundColor: style.color.primary,
                        marginRight: 5,
                    }}>{style.name}</span>;
                })} 。
                </Typography>
                <Typography component={"span"} paragraph>
                    <ul>
                        <li>在码头，每种货物各有5箱。用以装船运货。</li>
                        <li>在牌堆，每种货物各有11张。用以打出交易。</li>
                        <li>在市场，共有6个交易席位，同种货物数量越多，交易时获取的利润也会越多。游戏开始时会随机展开6张牌作为初始市场。</li>
                        <li>在商店，可以购买货船和3中特殊道具，通行证、搬运工、交易所，每种各2张。任何玩家不能购买相同的特殊道具。</li>
                    </ul>
                </Typography>
                <Typography>
                    每位玩家有一块个人面板。游戏开始时，每位玩家获得3张手牌和2艘货船。
                    <img src={playerImage} alt={"个人面板"}/>
                </Typography>


                <Typography variant={"h4"} paragraph>
                    游戏流程
                </Typography>
                <Typography paragraph>
                    游戏首先进行配置阶段，从起始玩家开始，进行一轮正向一轮反向行动，轮到的玩家须进行装货，即从码头选取一种货物。
                </Typography>
                <Typography paragraph>
                    配置完成后正式开始游戏，玩家依次进行回合。每个回合有两个阶段。
                </Typography>
                <Typography variant={"h5"} paragraph>
                    阶段1：换货/购买阶段。你可以 三选一：
                </Typography>
                <Typography component={"span"} paragraph>
                    <ol>
                        <li>换货，选择自己的1艘货船和码头上的1种货物，将该货物与船上货物进行交换。如果你拥有<b>搬运工</b>道具，则可以换2船货</li>
                        <li>购买道具，从商店里购买道具，须支付相应的金币。不能购买已经拥有的特殊道具。购买搬运工会立即获得一次额外的换货机会。</li>
                        <li>跳过该阶段</li>
                    </ol>
                </Typography>
                <Typography variant={"h5"} paragraph>
                    阶段2：出牌/抽牌阶段。你可以 二选一：
                </Typography>
                <ol>
                    <li>
                        出牌，从手牌选择一种货物并在市场选择若干交易席位，打出相应张数的手牌。无论打出多少张货物，都会触发一次交易。
                        <b>所有玩家</b>都会获得按照自己的货船获得收益：<br/>
                        <Chip label={"获得的金币 = 该货物的总席位数 × 该货物的船数 + 通行证奖励(2金币)"} variant={"outlined"}/>
                    </li>
                    <li>抽牌，从牌堆抽取两张牌</li>
                </ol>
                <Typography paragraph>
                    <sub style={{marginLeft: 10}}>*如果你拥有<b>交易所</b>道具，则你可以在该阶段结束时抽一张牌。</sub>
                </Typography>
                <Typography variant={"h4"} paragraph>
                    游戏结束
                </Typography>
                <Typography>
                    当牌堆最后一张牌被摸起时，游戏立刻结束。<br/>
                    每位玩家此时手中的金币即为最终得分。
                </Typography>
            </Paper>
        </React.Fragment>
    )
};

export default HSSLHelpView;