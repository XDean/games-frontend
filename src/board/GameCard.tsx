import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {CardActionArea, CardMedia, Dialog, IconButton, Tooltip} from "@material-ui/core";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles({
    card: {},
    media: {
        width: 350,
        height: 180,
    },
});

type GameCardProp = {
    name: string,
    desc: string,
    image: string,
    onPlay?: () => void,
    help?: React.ReactNode,
}

const GameCard: React.FunctionComponent<GameCardProp> = (props) => {
    const classes = useStyles();

    const [showHelp, setShowHelp] = useState(false);

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={props.image}
                    title={props.name}
                />
                <CardContent>
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
                        开始游戏!
                    </Button>
                ) : (
                    <Button size="small" color="primary">
                        尚未就绪
                    </Button>
                )}
                {props.help &&
                <IconButton onClick={() => setShowHelp(s => !s)} size={"small"} style={{marginLeft: "auto"}}>
                    <Tooltip title={"帮助"}>
                        <HelpOutlineIcon/>
                    </Tooltip>
                </IconButton>}
            </CardActions>
            {showHelp && <Dialog maxWidth={"lg"} fullWidth style={{zIndex: 99999}} open
                                 onClose={() => setShowHelp(false)}>{props.help}</Dialog>}
        </Card>
    );
};

export default GameCard;