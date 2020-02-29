import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Divider, Paper, Typography} from "@material-ui/core";
import {faHandshake} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LCTheme} from "../theme";
import {LCCardColor, LCCardColors} from "../model/card";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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

type LCHelpProp = {
    onClose?: () => void
}

const LCHelpView: React.FunctionComponent<LCHelpProp> = (props) => {
    const classes = useStyles();

    function cardCell(color: LCCardColor) {
        return <span key={color} style={{
            display: "inline-block",
            verticalAlign: "text-bottom",
            width: 15,
            height: 15,
            margin: 3,
            backgroundImage: LCTheme.cardBackground(color, "square"),
            borderRadius: 5,
            borderWidth: 1,
            borderStyle: "solid",
        }}/>
    }

    return (
        <React.Fragment>
            <Typography variant={"h3"} className={classes.title}>
                失落的城市
            </Typography>
            <IconButton className={classes.closeButton} onClick={props.onClose}>
                <CloseIcon/>
            </IconButton>
            <Divider/>
            <Paper className={classes.content}>
                <Typography>
                    人数： 2人
                </Typography>
                <Typography>
                    时间： 10~20分钟
                </Typography>
                <Typography>
                    量级： 轻中
                </Typography>
                <Typography paragraph>
                    机制： 组合收集/手牌管理
                </Typography>
                <Typography paragraph>
                    游戏中玩家扮演一支探险队，对五个曾经繁荣却突然没落的古文明城市进行探索。
                    玩家必须选择从哪里开始冒险而哪里要留给另一位玩家去探索。
                    你或许会有机会提高你的探险投资以得到更高的成功报酬，
                    但也将承担更大的失败风险。
                    能够找到平衡点的玩家就能成功探索并且赢得游戏。
                </Typography>
                <Typography variant={"h4"} paragraph>
                    游戏配置
                </Typography>
                <Typography>
                    游戏卡牌共有5种颜色 {LCCardColors.map(cardCell)}
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
                        1. 出牌
                    </Typography>
                    <ul>
                        <li>打出的卡牌会被放置在己方对应颜色的队列末尾</li>
                        <li>相同颜色点数必须递增，翻倍牌必须在点数牌之前打出</li>
                        <li>一旦一列中打出了任何牌，这一列便计-20分作为开发费用</li>
                    </ul>
                </Typography>
                <Typography component={"span"} paragraph>
                    <Typography>
                        2. 弃牌
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
                    计分规则
                </Typography>
                <Typography>
                    每位玩家对自己的面板计分。面板上每种颜色单独计分，加和即为总分。
                </Typography>
                <Typography paragraph>
                    对于每一列，如果没有牌则计0分，否则如下计分
                </Typography>
                <Paper elevation={5} style={{display: "inline-block", padding: 5, marginBottom: 15}}>
                    得分 = (点数牌之和 - 20) × (1 + 翻倍牌数) + 奖励分
                </Paper>
                <Typography paragraph>
                    *奖励分：当你一列中至少有8张点数牌时即可获得20分奖励分。
                </Typography>
            </Paper>
        </React.Fragment>
    )
};

export default LCHelpView;