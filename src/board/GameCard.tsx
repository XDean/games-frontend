import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {CardActionArea, CardMedia} from "@material-ui/core";

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
    link?: string,
}

const GameCard: React.FunctionComponent<GameCardProp> = (props) => {
    const classes = useStyles();

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
                {props.link ? (
                    <Button size="small" color="primary">
                        PLAY NOW!
                    </Button>
                ) : (
                    <Button size="small" color="primary">
                        NOT READY NOW
                    </Button>
                )
                }
            </CardActions>
        </Card>
    );
};

export default GameCard;