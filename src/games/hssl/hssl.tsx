import React, {useContext, useEffect, useState} from 'react';
import {Dialog, ThemeProvider} from "@material-ui/core";
import {AppContext} from "../../App";
import {Route, Switch, useParams, useRouteMatch} from "react-router";
import banner from "./resources/banner.webp";
import {HSSLMeta} from "./meta";
import {ShareRoom} from "../../components/snippts";
import HSSLHelpView from "./components/help";
import HSSLCreateView from "./components/create";
import HSSLGameView from "./components/game";
import GameCard from "../../board/gameCard";
import ConnectCreateJoinView from "../common/component/connectCreateJoin";
import {HSSLGame} from "./model/game";
import {HSSLTheme} from "./theme";

export const HSSLBoardCard = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    return (
        <React.Fragment>
            <GameCard name={HSSLMeta.name} image={banner}
                      desc={"玩家扮演16世纪时往来于欧亚间的精明商人，通过缜密观察六种不同货物的流行趋势，装运和出售合适的货物来获取最大利益"}
                      onPlay={() => setShowCreate(true)} onHelp={() => setShowHelp(true)}
            />
            {showHelp && <Dialog maxWidth={"md"} fullWidth open onClose={() => setShowHelp(false)}>
                <HSSLHelpView onClose={() => setShowHelp(false)}/>
            </Dialog>}
            {showCreate && <Dialog open onClose={() => setShowCreate(false)}>
                <HSSLCreateView onClose={() => setShowCreate(false)}/>
            </Dialog>}
        </React.Fragment>
    )
};

export const HSSLHeadView = () => {
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

export const HSSLMainView: React.FunctionComponent<{}> = () => {
    const {path} = useRouteMatch();
    return (
        <Switch>
            <Route path={`${path}/:id`}>
                <HSSLActualMainView/>
            </Route>
        </Switch>
    )
};

const HSSLActualMainView: React.FunctionComponent<{}> = () => {
    const {id} = useParams();
    const ctx = useContext(AppContext);

    const [game, setGame] = useState<HSSLGame>();
    useEffect(() => {
        setGame(new HSSLGame(id!, ctx.id));
    }, [id, ctx.id]);

    return (
        game ? <ThemeProvider theme={outer => ({...outer, ...HSSLTheme})}>
            <ConnectCreateJoinView game={game} host={game.host} url={`socket/game/hssl/${id}?user=${ctx.id}`}>
                <HSSLGameView game={game}/>
            </ConnectCreateJoinView>
        </ThemeProvider> : null
    );
};