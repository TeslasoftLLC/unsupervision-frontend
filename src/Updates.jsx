import React, {useEffect} from 'react';
import {CircularProgress} from "@mui/material";
import ListPlaceholder from "./ListPlaceholder";
import SecurityAlert from "./SecurityAlert";

function Updates(props) {

    let [data, setData] = React.useState(null);

    let [refresh, setRefresh] = React.useState(false);

    let [updateInfo, setUpdateInfo] = React.useState(null);

    let [updateId, setUpdateId] = React.useState(-1);

    let [loading, setLoading] = React.useState(false);

    let [dialog, setDialog] = React.useState(null);

    let [dialogTitle, setDialogTitle] = React.useState(null);

    let [deletionDialog, setDeletionDialog] = React.useState(false);

    useEffect(() => {
        setRefresh(true)
    }, []);

    React.useEffect(() => {
        if (refresh) {
            setLoading(true)
            setRefresh(false)
            fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetUpdates.php")
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setData(data)
            });
        }
    }, [refresh]);

    useEffect(() => {
        if (deletionDialog && updateId.toString() === "0") setDeletionDialog(false)
    }, [deletionDialog]);

    useEffect(() => {
        if (updateId !== -1) {
            setLoading(true)
            fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetUpdateById.php?id=" + updateId)
                .then(res => {
                    return res.json()
                }).catch(e => {
                    setUpdateId(-2)
                    setLoading(false)
                })
                .then(data => {
                    if (data === null || data === undefined || data.version === undefined) {
                        setUpdateId(-2)
                        setLoading(false)
                        return
                    }
                    setLoading(false)
                    setUpdateInfo(data)
                });
        }
    }, [updateId]);

    let confirmDeletion = () => {
        setDeletionDialog(true)
    }

    let deleteUpdate = () => {
        setLoading(true)
        fetch("https://unsupervision.teslasoft.org/unsupervision/updates/DeleteUpdate.php?id=" + updateId)
        .then(res => res.json())
        .then(data => {
            setLoading(false)
            setDialog("Update deleted successfully")
            setDialogTitle("Update deleted")
            setUpdateId(-1)
            setUpdateInfo(null)
            setRefresh(true)
        });
    }

    return (
        <div className={"pp"}>
            {
                updateId === -1 ?
                    <>
                        <h2 className={"tab-title"}>Updates</h2>
                        {data === null ? null : <>
                            {
                                <>
                                    {
                                        data.updates.length === 0 ? <ListPlaceholder text={"No updates found."}/> :
                                            data.updates.map((item, index) => (
                                                <div key={"update-" + index.toString()}>
                                                    <button className={"update-card clickable-frame full-width"}
                                                            onClick={() => {
                                                                setUpdateId(item);
                                                            }}>
                                                        <div className={"update-card-content"}><span className={"folder material-symbols-outlined"}>folder_open</span>&nbsp;&nbsp;&nbsp;
                                                            <span className={"text"}>Update ID {item}</span></div>
                                                    </button>
                                                    <br/>
                                                </div>
                                            ))
                                    }
                                </>
                            }
                        </>}
                    </>
                    : <>
                        {updateId < -1 ? <SecurityAlert/> : <>
                            <h2 className={"tab-title"}>Update ID {updateId}</h2>
                            {updateInfo === null ? null : <div className={"update-card-info"}>
                                <div className={"update-actions"}>
                                    <button className={"mtrl-button-tonal"} onClick={() => {
                                        setUpdateId(-1)
                                        setUpdateInfo(null)
                                        setRefresh(true)
                                    }}><span
                                        className="material-symbols-outlined-btn material-symbols-outlined">arrow_back_ios</span>Go
                                        back
                                    </button>
                                    {updateId.toString() === "0" ? null : <>
                                        &nbsp;&nbsp;
                                        <button className={"mtrl-button-tonal-error mtrl-button-tonal"}
                                                onClick={confirmDeletion}>
                                    <span
                                        className="material-symbols-outlined-btn material-symbols-outlined">delete</span>&nbsp;&nbsp;Delete
                                            update
                                        </button>
                                    </>}
                                </div>
                                <br/>
                                {updateId.toString() === "0" ? <div className={"error-card"}>
                                    <span className={"material-symbols-outlined"}>error</span><span className={"error-message"}>This is the source update. It cannot be deleted nor changed. Source update is the update that is used to create the app. It's the first app version.</span>
                                </div> : null}
                                <br/>
                                <p className={"text"}>Version: {updateInfo.version}</p>
                                <br/>
                                <p className={"text"}>Timestamp: {updateInfo.timestamp} ({new Date(parseInt(updateInfo.timestamp) * 1000).toLocaleString()})</p>
                                <br/>
                                <p className={"text"}>Files:</p>
                                <div className={"file-info"}>
                                    {
                                        updateInfo.changeMap.map((item, index) => (
                                            <div className={"update-file"} key={index}>
                                                <p className={"text"}>File Name: {item.fileName}</p>
                                                <p className={"text"}>Path: {item.path}</p>
                                                <p className={"text"}>Update method: {item.updateMethod}</p>
                                                <p className={"text"}>SHA256: {item.sha256}</p>
                                                <br/>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>}
                        </>}
                    </>
            }

            {dialog !== null ? <div className={"dialog"}>
                <div className={"dialog-bg"}>
                    <h3 className={"dialog-title"}>{dialogTitle}</h3>
                    <p className={"text dialog-message"}>{dialog}</p>
                    <div className={"dialog-actions"}>
                        <button className={"mtrl-button-tonal"} onClick={() => {
                            setDialog(null)
                            setDialogTitle(null)
                        }}>Close</button>
                    </div>
                </div>
            </div> : null}

            {deletionDialog ? <div className={"dialog"}>
                    <div className={"dialog-bg"}>
                        <h3 className={"dialog-title"}>Delete update</h3>
                        <p className={"text dialog-message"}>Are you sure you want to delete this update?</p>
                        <div className={"dialog-actions"}>
                            <button className={"mtrl-button-tonal"} onClick={() => {
                                setDeletionDialog(false)
                            }}>Cancel
                            </button>
                            &nbsp;&nbsp;
                            <button className={"mtrl-button-tonal-error mtrl-button-tonal"} onClick={() => {
                                setDeletionDialog(false)
                                deleteUpdate()
                            }}>Delete
                            </button>
                        </div>
                    </div>
                </div>
                : null}

            {loading ? <div className={"dialog"}>
                <CircularProgress/>
            </div> : null}
        </div>
    );
}

export default Updates;