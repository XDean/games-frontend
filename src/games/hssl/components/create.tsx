import React, {useState} from 'react';
import {useHistory} from "react-router";
import {HSSLMeta} from "../meta";
import CreateJoinRoomView from "../../common/component/create";

type HSSLCreateProp = {
    onClose(): void
}

const HSSLCreateView: React.FunctionComponent<HSSLCreateProp> = (props) => {
    const history = useHistory();

    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState("");

    function onCreate() {
        setConnecting(true);
        fetch("api/game/hssl", {
            method: "POST",
        }).then(res => {
            setConnecting(false);
            if (res.ok) {
                res.json().then(body => {
                    history.push(`/game/${HSSLMeta.id}/${body["id"]}`);
                })
            } else {
                throw new Error(`${res.status} ${res.statusText}`);
            }
        }).catch(e => {
            setConnecting(false);
            setError(`创建游戏失败：${e.toString()}`)
        })
    }

    function onJoin(id: string) {
        history.push(`/game/${HSSLMeta.id}/${id}`);
    }

    return (
        <CreateJoinRoomView connecting={connecting} onCreate={onCreate} onJoin={onJoin} onClose={props.onClose}
                            error={error}>
            标准游戏
        </CreateJoinRoomView>
    );
};

export default HSSLCreateView;