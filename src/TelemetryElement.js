import React from 'react';

function TelemetryElement(props) {
    return (
        <div className={props.messageType === "error" ? "telemetry-element-bg-error" : "telemetry-element-bg-info"}>
            <span className={props.messageType === "error" ? "error material-symbols-outlined" : "info material-symbols-outlined"}>
                {props.messageType === "error" ? "cancel" : "info"}
            </span>
            <span className={"log-message"}>
                <span className={"log-timestamp"}>
                    [{new Date(parseInt(props.timestamp)).toLocaleString()}]
                </span>
                <b className={"log-tag"}>
                    [{props.deviceId}]
                </b>
                &nbsp;
                <span className={props.messageType === "error" ? "log-message-error" : "log-message-info"}>
                    {props.message}
                </span>
            </span>
        </div>
    );
}

export default TelemetryElement;