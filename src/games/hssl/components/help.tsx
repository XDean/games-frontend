import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {Divider, Link, Paper, Typography} from "@material-ui/core";
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
                    每位玩家有一块个人面板
                    <img src={playerImage} alt={"个人面板"}/>
                </Typography>
                <Typography>
                    桌面中间是公共面板，包括码头，市场，商店，牌堆。
                </Typography>
                <Typography>
                    货物一共有6中，{HSSLCards.map(c => {
                    let style = HSSLTheme.cardStyle(c);
                    return <span key={c} style={{
                        color: style.color.font,
                        backgroundColor: style.color.primary,
                        marginRight: 5,
                    }}>{style.name}</span>;
                })} 。
                </Typography>
                <Typography>
                    在码头，每种货物各有5箱。用以装船运货。
                </Typography>
                <Typography>
                    在牌堆，每种货物各有11张。用以打出交易。
                </Typography>
                <Typography>
                    在市场，共有6个交易席位，同种货物数量越多，交易时获取的利润也会越多。
                </Typography>
                <Typography paragraph>
                    在商店，可以购买货船和3中特殊道具，通行证、搬运工、交易所，每种各2张。
                </Typography>
            </Paper>
        </React.Fragment>
    )
};

export default HSSLHelpView;