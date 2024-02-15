import React, {useEffect} from 'react';
import TelemetryElement from "./TelemetryElement";
import {CircularProgress} from "@mui/material";
import ListPlaceholder from "./ListPlaceholder";

function Telemetry(props) {

    let [data, setData] = React.useState(null);

    let [refresh, setRefresh] = React.useState(false);

    let [loading, setLoading] = React.useState(false);

    let [dialog, setDialog] = React.useState(null);

    let [dialogTitle, setDialogTitle] = React.useState(null);

    let [deletionDialog, setDeletionDialog] = React.useState(false);

    useEffect(() => {
        setRefresh(true)
    }, []);

    useEffect(() => {
        if (refresh) {
            setLoading(true)
            setRefresh(false)
            fetch("https://unsupervision.teslasoft.org/unsupervision/GetTelemetry.php")
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setData(data)
            });
        }
    }, [refresh]);

    let confirmDeletion = () => {
        setDeletionDialog(true)
    }

    let clearTelemetry = () => {
        setLoading(true)
        fetch("https://unsupervision.teslasoft.org/unsupervision/ClearTelemetry.php")
        .then(res => res.json())
        .then(data => {
            setLoading(false)
            setDialog("Telemetry cleared successfully")
            setDialogTitle("Telemetry cleared")
            setRefresh(true)
        });
    }

    return (
        <div className={"pp"}>
            {props.embedded !== true ? <>
                <button className={"ct mtrl-button-tonal-error mtrl-button-tonal"}
                        onClick={confirmDeletion}>
                        <span
                            className="material-symbols-outlined-btn material-symbols-outlined">delete</span>&nbsp;&nbsp;Clear telemetry
                </button>
                <h2 className={"tab-title"}>Telemetry</h2>
            </> : null}

            {data === null ? null : <>
                {
                    <>
                        {data.length === 0 ? <ListPlaceholder text={"No data"}/> : data.map((item, index) => (
                            <TelemetryElement key={index} timestamp={item.timestamp} messageType={item.type}
                                              deviceId={item.deviceId} message={item.message}/>
                        ))}
                    </>
                }
            </>}

            {loading && props.embedded !== true ? <div className={"dialog"}>
                <CircularProgress/>
            </div> : null}

            {dialog !== null ? <div className={"dialog"}>
                <div className={"dialog-bg"}>
                    <h3 className={"dialog-title"}>{dialogTitle}</h3>
                    <p className={"text dialog-message"}>{dialog}</p>
                    <div className={"dialog-actions"}>
                        <button className={"mtrl-button-tonal"} onClick={() => {
                            setDialog(null)
                            setDialogTitle(null)
                        }}>Close
                        </button>
                    </div>
                </div>
            </div> : null}

            {deletionDialog ? <div className={"dialog"}>
                    <div className={"dialog-bg"}>
                        <h3 className={"dialog-title"}>Clear telemetry</h3>
                        <p className={"text dialog-message"}>Are you sure you want to clear telemetry?</p>
                        <div className={"dialog-actions"}>
                            <button className={"mtrl-button-tonal"} onClick={() => {
                                setDeletionDialog(false)
                            }}>Cancel
                            </button>
                            &nbsp;&nbsp;
                            <button className={"mtrl-button-tonal-error mtrl-button-tonal"} onClick={() => {
                                setDeletionDialog(false)
                                clearTelemetry()
                            }}>Delete
                            </button>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
}

export default Telemetry;
