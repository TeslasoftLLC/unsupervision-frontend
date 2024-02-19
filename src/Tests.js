import React, {useEffect, useState} from 'react';
import {CircularProgress} from "@mui/material";
import ErrorTests from "./ErrorTests";
import ListPlaceholder from "./ListPlaceholder";

function Tests(props) {

    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [updateId, setUpdateId] = useState(-1);
    const [testId, setTestId] = useState("")
    const [data, setData] = useState([]);

    useEffect(() => {
        if (refresh) {
            loadTests();
        }
    }, [refresh]);

    const loadTests = () => {
        setLoading(true);

        fetch("https://unsupervision.teslasoft.org/unsupervision/tests/TestsInfo")
            .then(res => {
                return res.json()
            }).catch(e => {
                setUpdateId(-2)
                setLoading(false)
                setRefresh(false)
            })
            .then(data => {
                if (data === null || data === undefined) {
                    setUpdateId(-2)
                    setLoading(false)
                    setRefresh(false)
                    return
                }
                setLoading(false)
                setData(data)
                setRefresh(false)
            });
    }

    return (
        <div className={"pp"}>
            {updateId < -1 ? <ErrorTests/> : <>
                {updateId === -1 ?
                    <>
                        <h2 className={"tab-title"}>Tests</h2>

                        {data === null || data === undefined ? <ListPlaceholder text={"No test data."}/> : <>
                            {
                                <>
                                    {
                                        data.length === 0 ? <ListPlaceholder text={"No test data."}/> :
                                            data.map((item, index) => (
                                                <div key={"update-" + index.toString()}>
                                                    <button className={"update-card clickable-frame full-width"}
                                                            onClick={() => {
                                                                setUpdateId(parseInt(item.updateId));
                                                                setTestId(item.id)
                                                            }}>
                                                        <div className={"update-card-content"}><span className={"folder material-symbols-outlined"}>folder_open</span>&nbsp;&nbsp;&nbsp;
                                                            <span className={"text"}>Submission ID {item.id} for update {item.updateId}</span></div>
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
                        <h2 className={"tab-title"}>Submission ID {testId} for update {updateId}</h2>
                        <div className={"update-card-info"}>
                            <div className={"update-actions"}>
                                <button className={"mtrl-button-tonal"} onClick={() => {
                                    setUpdateId(-1)
                                    setTestId("")
                                    setRefresh(true)
                                }}><span
                                    className="material-symbols-outlined-btn material-symbols-outlined">arrow_back_ios</span>Go
                                    back
                                </button>
                            </div>
                            <br/>
                            <div>{data.map((item) => {
                                if (item.id === testId) {
                                    return(<>
                                        <div className={"info-card"}>
                                            <span className={"material-symbols-outlined"}>package_2</span><span
                                            className={"info-message"}>Submission ID: {item.id}<br/>Timestamp: {item.timestamp} ({new Date(parseInt(item.timestamp) * 1000).toLocaleString()})</span>
                                        </div>
                                        {
                                            item.tests.map((test, index) => (
                                                <>
                                                    <br/>
                                                    <div className={"test-card"} key={"test-" + index.toString()}>
                                                        <div className={"card-normalize-v32"}>
                                                            <hr className={"auth-hr"}/>
                                                            <h2 className={"centered form-subtitle text"}>Test for
                                                                file {test.path + test.file}</h2>
                                                            <hr className={"auth-hr"}/>
                                                        </div>
                                                        {
                                                            test.cases.map((_case, index) => (
                                                                <div key={"case-" + index.toString()}>
                                                                    <br/>
                                                                    {_case.status === "pass" ?
                                                                        <div className={"test-pass"}>
                                                                        <div
                                                                            className={"material-symbols-outlined"}>verified</div><div
                                                                            className={"success-message"}><h3 className={"test-title"}>{_case.name}</h3><br/>
                                                                            Case ID: {_case.id}<br/>
                                                                            Status: <b>PASSED</b><br/>
                                                                            Execution time: {_case.time}<br/>
                                                                            <br/><div className={"raw-container"}><code>{_case.message}</code></div></div>
                                                                        </div> :
                                                                        <div className={"test-fail"}>
                                                                        <div
                                                                            className={"material-symbols-outlined"}>warning</div><div
                                                                            className={"error-message"}><h3 className={"test-title"}>{_case.name}</h3><br/>
                                                                            Case ID: {_case.id}<br/>
                                                                            Status: <b>FAILED</b><br/>
                                                                            Execution time: {_case.time}<br/>
                                                                            <br/><div className={"raw-container"}><code>{_case.message}</code></div></div>
                                                                        </div>}
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            ))
                                        }
                                    </>)
                                } else return null
                            })}</div>
                        </div>
                    </>}
            </>}

            {loading ? <div className={"dialog"}>
                <CircularProgress/>
            </div> : null}
        </div>
    );
}

export default Tests;