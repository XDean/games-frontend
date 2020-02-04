import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, Typography} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import {cardColor} from "./card";
import {LCCard} from "../model/model";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AssignmentIcon from '@material-ui/icons/Assignment';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LoopIcon from '@material-ui/icons/Loop';

const useStyles = makeStyles({
    container: {
        padding: 20,
    },
});

type LCHelpProp = {}

const LCHelpView: React.FunctionComponent<LCHelpProp> = (props) => {
    const classes = useStyles();

    function cardCell(i: number) {
        let color = cardColor(i);
        return <span key={i} style={{
            display: "inline-block",
            verticalAlign: "text-bottom",
            width: 15,
            height: 15,
            margin: 3,
            backgroundColor: color,
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
        }}/>
    }

    return (
        <Paper className={classes.container}>
            <Typography variant={"h3"} paragraph>
                失落的城市
            </Typography>
            <Typography variant={"h4"} paragraph>
                游戏配置
            </Typography>
            <Typography>
                游戏卡牌共有5种颜色 {LCCard.Colors.map(cardCell)}
            </Typography>
            <Typography>
                每种颜色的卡牌有3张加倍牌<FontAwesomeIcon icon={faHandshake}/>和点数牌2-10各一张
            </Typography>
            <Typography>
                每位玩家总是有8张手牌
            </Typography>
            <Typography paragraph>
                游戏版图分为三部分，每位玩家拥有一侧，中间为公共弃牌区
            </Typography>
            <Typography variant={"h4"} paragraph>
                游戏流程
            </Typography>
            <Typography>
                双方玩家轮流进行回合，牌库抽完立即结束游戏，按各自面板计分，分高者胜。
            </Typography>
            <Typography paragraph>
                每个回合玩家需要执行 [出牌] 和 [抽牌] 两个动作。
            </Typography>
            <Typography variant={"h5"} paragraph>
                出牌
            </Typography>
            <Typography paragraph>
                选择一张手牌，然后二选一
            </Typography>
            <Typography component={"span"} paragraph>
                <Typography>
                    1. 打出 <SendIcon/>
                </Typography>
                <ul>
                    <li>打出的卡牌会被放置在己方对应颜色的队列末尾</li>
                    <li>相同颜色点数必须递增，翻倍牌必须在点数牌之前打出</li>
                    <li>一旦一列中打出了任何牌，这一列便计-20分作为开发费用</li>
                </ul>
            </Typography>
            <Typography component={"span"} paragraph>
                <Typography>
                    2. 弃置 <CancelOutlinedIcon/>
                </Typography>
                <ul>
                    <li>弃置的卡牌会放在对应颜色的弃牌堆顶</li>
                </ul>
            </Typography>
            <Typography variant={"h5"} paragraph>
                抽牌
            </Typography>
            <Typography paragraph>
                抽牌行动也是二选一
            </Typography>
            <Typography component={"span"} paragraph>
                <Typography>
                    1. 从牌库抽牌
                </Typography>
                <ul>
                    <li>牌库剩余数量是公开的</li>
                    <li>最后一张被抽取时游戏立即结束</li>
                </ul>
            </Typography>
            <Typography component={"span"} paragraph>
                <Typography>
                    2. 从弃牌抽牌
                </Typography>
                <ul>
                    <li>你只可以抽取弃牌堆顶的牌</li>
                    <li>你不可以抽取你刚刚弃置的牌</li>
                </ul>
            </Typography>
            <Typography variant={"h4"} paragraph>
                积分规则
            </Typography>
            <Typography>
                每位玩家对自己的面板计分。面板上每种颜色单独计分，加和即为总分。
            </Typography>
            <Typography paragraph>
                对于每一列，如果没有牌则计0分，否则如下计分
            </Typography>
            <Paper elevation={5} style={{padding: 5, marginBottom: 15}}>
                得分 = (点数牌之和 - 20) × (1 + 翻倍牌数) + 奖励分
            </Paper>
            <Typography paragraph>
                *奖励分：当你一列中至少有8张点数牌时即可获得20分奖励分。
            </Typography>
            <Typography variant={"h4"} paragraph>
                界面工具
            </Typography>
            <Typography>
                <LoopIcon/> 排序 (按颜色或点数)
            </Typography>
            <Typography>
                <AssignmentIcon/> 计分板
            </Typography>
            <Typography>
                <HelpOutlineIcon/> 帮助也
            </Typography>
        </Paper>
    )
};

export default LCHelpView;