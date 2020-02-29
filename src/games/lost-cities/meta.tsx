import {GameMeta} from "../common/model/meta";
import React from "react";
import {LCBoardCard, LCHeadView, LCMainView} from "./lostcities";

export const LCMeta: GameMeta = {
    id: "lost-cities",
    name: "失落的城市",
    boardCard: LCBoardCard,
    mainNode: LCMainView,
    headerNode: LCHeadView,
};