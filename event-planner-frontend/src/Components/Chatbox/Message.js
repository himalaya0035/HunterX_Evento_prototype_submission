import React from "react";

import "./Message.css";

function Message({messageObj}) {
    const {timestamp, message, from_user, by_you, message_type} = messageObj;


    if (message_type === 'notification') {
        // console.log(mes/)
        return (
            <div className="message__notif">
                <p> {message} </p>
            </div>
        );
    }

    if (by_you === true) {
        return (
            <div className="message__send">
                <div className="message__chat__send">
                    <p>{message}</p>
                </div>
                <div className="message__time__send">{new Date(timestamp).toLocaleString()}</div>
            </div>
        );

    } else if (by_you === false) {
        return (
            <div className="message">
                <div className="message__chat">
                    <p className="message__name">{from_user}</p>
                    <p>{message}</p>
                </div>
                <div className="message__time">{new Date(timestamp).toLocaleString()}</div>
            </div>
        );
    }


}

export default Message;

