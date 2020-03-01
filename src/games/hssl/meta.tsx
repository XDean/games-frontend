import {GameMeta} from "../common/model/meta";
import {HSSLBoardCard, HSSLHeadView, HSSLMainView} from "./hssl";

export const HSSLMeta: GameMeta = {
    id: "merchants",
    name: "海上丝路",
    boardCard: HSSLBoardCard,
    mainNode: HSSLMainView,
    headerNode: HSSLHeadView,
};