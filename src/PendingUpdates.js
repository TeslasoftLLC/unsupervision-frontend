import React, {useEffect} from 'react';
import {CircularProgress} from "@mui/material";
import ListPlaceholder from "./ListPlaceholder";
import SecurityAlert from "./SecurityAlert";
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import Editor from "react-simple-code-editor";
import { html_beautify } from 'js-beautify';
import UnknownFile from "./UnknownFile";

const options = { indent_size: 4, space_in_empty_paren: true };

function PendingUpdates(props) {

    let [data, setData] = React.useState(null);

    let [refresh, setRefresh] = React.useState(false);

    let [updateInfo, setUpdateInfo] = React.useState(null);

    let [updateId, setUpdateId] = React.useState(-1);

    let [dialog, setDialog] = React.useState(null);

    let [dialogTitle, setDialogTitle] = React.useState(null);

    let [loading, setLoading] = React.useState(false);

    let [deletionDialog, setDeletionDialog] = React.useState(false);

    let [deletionDialogFile, setDeletionDialogFile] = React.useState(false);

    let [fileId, setFileId] = React.useState(-1);

    let [fileHash, setFileHash] = React.useState("");

    let [code, setCode] = React.useState("");

    let [path, setPath] = React.useState("");

    useEffect(() => {
        if (fileId === -1) {
            setCode("")
        } else {
            setLoading(true)
            fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetFile.php?id=" + updateId + "-fixed" + "&path=" + path + "&file=" + fileId)
            .then(res => res.text())
            .then(data => {
                setLoading(false)
                if (data === null || data === undefined || data === "") {
                    setFileId(-2)
                    setCode("")
                    setPath("")
                    setFileHash("")
                } else {
                    setCode(html_beautify(data, options))
                }
            });
        }
    }, [fileId]);

    useEffect(() => {
        setRefresh(true)
    }, []);

    React.useEffect(() => {
        if (refresh) {
            setRefresh(false)

            setLoading(true)
            fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetPendingUpdates.php")
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                setData(data)
            });
        }
    }, [refresh]);

    useEffect(() => {
        setLoading(true)
        if (updateId !== -1) {
            fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetPendingUpdateById.php?id=" + updateId)
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

    let applyUpdate = () => {
        setLoading(true)
        fetch("https://unsupervision.teslasoft.org/unsupervision/updates/ApplyFix.php?id=" + updateId)
        .then(res => res.json())
        .then(data => {
            setLoading(false)
            setDialog("Update applied successfully")
            setDialogTitle("Update applied")
            setUpdateId(-1)
            setUpdateInfo(null)
            setRefresh(true)
        });
    }

    let confirmDeletion = () => {
        setDeletionDialog(true)
    }

    let deleteUpdate = () => {
        setLoading(true)
        fetch("https://unsupervision.teslasoft.org/unsupervision/updates/DeleteFix.php?id=" + updateId)
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
                        <h2 className={"tab-title"}>Pending updates</h2>
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
                        {fileId === -1 ?
                            <>
                                {updateId < -1 ? <SecurityAlert/> : <>
                                    <h2 className={"tab-title"}>Pending update ID {updateId}</h2>
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
                                            <span className={"material-symbols-outlined"}>cancel</span><span
                                            className={"error-message"}>This is the source update. It cannot be deleted nor changed. Source update is the update that is used to create the app. It's the first app version.</span>
                                        </div> : null}
                                        <br/>
                                        <div className={"info-card"}>
                                            <span className={"material-symbols-outlined"}>package_2</span><span
                                            className={"info-message"}>Version: {updateInfo.version}<br/>Timestamp: {updateInfo.timestamp} ({new Date(parseInt(updateInfo.timestamp) * 1000).toLocaleString()})</span>
                                        </div>
                                        <br/>
                                        <div className={"card-normalize-v32"}>
                                            <hr className={"auth-hr"}/>
                                            <h2 className={"centered form-subtitle text"}>Files</h2>
                                            <hr className={"auth-hr"}/>
                                        </div>
                                        <div className={"file-info"}>
                                            {
                                                updateInfo.changeMap.map((item, index) => (
                                                    <>
                                                        <div key={"file-" + index.toString()}>
                                                            <br/>
                                                            <button className={"file-card clickable-frame"}
                                                                    onClick={() => {
                                                                        setFileId(item.fileName.toString());
                                                                        setPath(item.path.toString());
                                                                        setFileHash(item.sha256);
                                                                    }}>
                                                                <div className={"update-card-content"}><span
                                                                    className={"folder material-symbols-outlined"}>draft</span>&nbsp;&nbsp;&nbsp;
                                                                    <span
                                                                        className={"text"}>{item.path.toString() + item.fileName.toString()}</span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </>
                                                ))
                                            }
                                        </div>
                                    </div>}
                                </>}
                            </>

                            : <>
                                {fileId < -1 ? <UnknownFile/> : <>
                                    <h2 className={"tab-title"}>Pending update ID {updateId} - {path + fileId}</h2>
                                    <div className={"update-card-info"}>
                                        <div className={"update-actions"}>
                                            <button className={"mtrl-button-tonal"} onClick={() => {
                                                setFileId(-1)
                                                setFileHash(null)
                                            }}><span
                                                className="material-symbols-outlined-btn material-symbols-outlined">arrow_back_ios</span>Go
                                                back
                                            </button>
                                            {/*        {updateId.toString() === "0" ? null : <>*/}
                                            {/*            &nbsp;&nbsp;*/}
                                            {/*            <button className={"mtrl-button-tonal-error mtrl-button-tonal"}*/}
                                            {/*                    onClick={confirmDeletionFile}>*/}
                                            {/*<span*/}
                                            {/*    className="material-symbols-outlined-btn material-symbols-outlined">delete</span>&nbsp;&nbsp;Delete*/}
                                            {/*                file*/}
                                            {/*            </button>*/}
                                            {/*        </>}*/}
                                        </div>
                                        {updateId.toString() === "0" ? <>
                                            <br/>
                                            <div className={"error-card"}>
                                                <span className={"material-symbols-outlined"}>cancel</span><span
                                                className={"error-message"}>This file is a part of source update. It cannot be modified nor deleted.</span>
                                            </div>
                                        </> : null}
                                        <br/>
                                        <div className={"warning-card"}>
                                            <span className={"material-symbols-outlined"}>warning</span><span
                                            className={"warning-message"}>You can't edit file using this system to avoid merge conflicts. Use your favorite IDE and project management system instead.</span>
                                        </div>
                                        <br/>
                                        <div className={"info-card"}>
                                            <span className={"material-symbols-outlined"}>tag</span><span
                                            className={"info-message"}>File hash: {fileHash}</span>
                                        </div>
                                        <br/>
                                        <div className={"code-editor"}>
                                            <Editor
                                                value={code}
                                                onValueChange={code => setCode(code)}
                                                highlight={code => highlight(code, languages.html, 'html')}
                                                padding={10}
                                                disabled={true}
                                                style={{
                                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                                    fontSize: 16,
                                                    color: "#ffffff",
                                                    border: "none",
                                                    padding: 0,
                                                    margin: 0,
                                                    '&:hover': {
                                                        border: "none",
                                                    },
                                                    '&:focus': {
                                                        border: "none",
                                                    },
                                                    '&:after': {
                                                        border: "none",
                                                    },
                                                    maxHeight: "650px",
                                                    overflow: "auto"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>}
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

export default PendingUpdates;
