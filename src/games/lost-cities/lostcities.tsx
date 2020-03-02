import React, {useContext, useEffect, useState} from 'react';
import {Dialog, ThemeProvider} from "@material-ui/core";
import LCGameView from "./component/game";
import {AppContext} from "../../App";
import {LCGame} from "./model/board";
import {Route, Switch, useParams, useRouteMatch} from "react-router";
import banner from "./resources/banner.webp";
import LCHelpView from "./component/help";
import LCCreateView from "./component/create";
import {LCMeta} from "./meta";
import {ShareRoom} from "../../components/snippts";
import GameCard from "../../board/gameCard";
import ConnectCreateJoinView from "../common/component/connectCreateJoin";
import {LCTheme} from "./theme";

export const LCBoardCard = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    return (
        <React.Fragment>
            <GameCard name={LCMeta.name} image={banner}
                      desc={"玩家扮演冒险者探索世界五大遗迹，等待你的会是无尽的财宝，还是血本无归呢？"}
                      onPlay={() => setShowCreate(true)} onHelp={() => setShowHelp(true)}
            />
            {showHelp && <Dialog maxWidth={"md"} fullWidth open onClose={() => setShowHelp(false)}>
                <LCHelpView onClose={() => setShowHelp(false)}/>
            </Dialog>}
            {showCreate && <Dialog open onClose={() => setShowCreate(false)}>
                <LCCreateView onClose={() => setShowCreate(false)}/>
            </Dialog>}
        </React.Fragment>
    )
};

export const LCHeadView = () => {
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/:id`}>
                <ShareRoomIcon/>
            </Route>
        </Switch>
    )
};

export function ShareRoomIcon() {
    const {id} = useParams();
    return <ShareRoom id={id!}/>
}

export const LCMainView: React.FunctionComponent<{}> = () => {
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/:id`}>
                <LCActualMainView/>
            </Route>
        </Switch>
    )
};

const LCActualMainView: React.FunctionComponent<{}> = () => {
    const {id} = useParams();
    const ctx = useContext(AppContext);

    const [game, setGame] = useState<LCGame>();
    useEffect(() => {
        setGame(new LCGame(id!, ctx.id));
    }, [id, ctx.id]);

    return (
        game ? <ThemeProvider theme={outer => ({...outer, ...LCTheme})}>
            <ConnectCreateJoinView game={game} host={game.host} url={`socket/game/lostcities/${id}?user=${ctx.id}`}>
                <LCGameView game={game}/>
            </ConnectCreateJoinView>
        </ThemeProvider> : null
    );
};