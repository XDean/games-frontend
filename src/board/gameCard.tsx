import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {CardActionArea, CardMedia, IconButton, Tooltip} from "@material-ui/core";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {AppTheme} from "../theme";

const useStyles = makeStyles<typeof AppTheme>(theme=>createStyles({
    card: {
        width: 350,
        height: 350,
    },
    media: {
        width: 350,
        height: 180,
    },
    content: {
        height: 90,
        overflowY: "auto",
        ...theme.hideScrollBar
    }
}));

type GameCardProp = {
    name: string,
    desc: string,
    image: string,
    onPlay?: () => void,
    onHelp?: () => void,
}

const GameCard: React.FunctionComponent<GameCardProp> = (props) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardActionArea onClick={props.onPlay}>
                <CardMedia
                    className={classes.media}
                    image={props.image}
                    title={props.name}
                />
                <CardContent className={classes.content}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.desc}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {props.onPlay ? (
                    <Button size="small" color="primary" onClick={props.onPlay}>
                        点击开始
                    </Button>
                ) : (
                    <Button size="small" color="primary">
                        尚未就绪，敬请期待
                    </Button>
                )}
                {props.onHelp &&
                <IconButton onClick={props.onHelp} size={"small"} style={{marginLeft: "auto"}}>
                    <Tooltip title={"帮助"}>
                        <HelpOutlineIcon/>
                    </Tooltip>
                </IconButton>}
            </CardActions>
        </Card>
    );
};

export default GameCard;