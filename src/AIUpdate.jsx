import React, {useEffect} from 'react';
import {CircularProgress} from "@mui/material";
import Telemetry from "./Telemetry";
import OpenAI from "openai";

function AiUpdate(props) {
    let [data, setData] = React.useState([]);

    let [upd, setUpd] = React.useState(null);

    let [refresh, setRefresh] = React.useState(false);

    let [loading, setLoading] = React.useState(false);

    let [dialog, setDialog] = React.useState(null);

    let [dialogTitle, setDialogTitle] = React.useState(null);

    let [selectedUpdate, setSelectedUpdate] = React.useState(null);

    let [selectedFile, setSelectedFile] = React.useState(null);

    let [selectedFilePath, setSelectedFilePath] = React.useState(null);

    let [filePreview, setFilePreview] = React.useState(null);

    let [prompt, setPrompt] = React.useState("The following file contains an error. Fix it and write fixed file and nothing else. Don't write any explanations. Don't write any codeblocks. Write your answer in plain text. Use the following additional info: '{context}'. The file to fix: {file}");

    let [context, setContext] = React.useState("");

    let [error, setError] = React.useState(false);

    let [errorMissingFile, setErrorMissingFile] = React.useState(false);

    let [errorMissingContext, setErrorMissingContext] = React.useState(false);

    let [errorFileNotSelected, setErrorFileNotSelected] = React.useState(true);

    let [errorText, setErrorText] = React.useState("");

    useEffect(() => {
        setRefresh(true)
    }, []);

    useEffect(() => {
        if (refresh) {
            setRefresh(false)
            fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetUpdates.php")
            .then(res => res.json())
            .then(d => {
                setUpd(d)
            });
        }
    }, [refresh]);

    async function getUpdate(id) {
        const response = await fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetUpdateById.php?id=" + id)
        return await response.json();
    }

    useEffect(() => {
        if (upd !== null) {
            getUpdates().then(r => {})
        }
    }, [upd]);

    async function getUpdates() {
        let updates = [];

        upd.updates.forEach(updateId => {
            updates.push(getUpdate(updateId))
        })

        const data = await Promise.all(updates)

        setData(data)
    }

    let downloadFile = (updateId, path, file) => {
        setLoading(true)
        fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GetFile.php?id=" + updateId + "&path=" + path + "&file=" + file)
        .then(res => {
            return res.text()
        }).then(data => {
            let textNode = document.createTextNode(data)
            setFilePreview(textNode)
            setLoading(false)
        });
    }

    useEffect(() => {
        if (filePreview !== null) {
            document.getElementById("filePreviewT").innerHTML = ""
            document.getElementById("filePreviewT").appendChild(filePreview)
            setErrorFileNotSelected(false)
        }
    }, [filePreview])

    useEffect(() => {
        validateForm()
    }, [prompt, context, filePreview])

    useEffect(() => {
        validateForm()
    }, [])

    useEffect(() => {
        let errorText = ""

        if (errorMissingFile || errorMissingContext || errorFileNotSelected) {
            errorText += "The form contains the following errors:\n\n"
        }

        if (errorMissingFile) {
            errorText += " - File placeholder {file} is missing.\n"
        }

        if (errorMissingContext) {
            errorText += " - Context placeholder {context} is missing. Clear context field or provide the placeholder.\n"
        }

        if (errorFileNotSelected) {
            errorText += " - File is not selected. Don't forget to download a file before generating update.\n"
        }

        if (!errorMissingFile && !errorMissingContext && !errorFileNotSelected) {
            errorText = "No errors found."
        }

        setErrorText(errorText)

        setError(errorMissingFile || errorMissingContext || errorFileNotSelected)
    }, [errorMissingFile, errorMissingContext, errorFileNotSelected]);

    let validateForm = () => {
        if (!prompt.includes("{file}")) {
            setErrorMissingFile(true)
        }

        if (!prompt.includes("{context}") && context !== null && context !== "") {
            setErrorMissingContext(true)
        }

        if (filePreview === null) {
            setErrorFileNotSelected(true)
        }

        let errorText = ""

        if (errorMissingFile || errorMissingContext || errorFileNotSelected) {
            errorText += "The form contains the following errors:\n\n"
        }

        if (errorMissingFile) {
            errorText += " - File placeholder {file} is missing.\n"
        }

        if (errorMissingContext) {
            errorText += " - Context placeholder {context} is missing. Clear context field or provide the placeholder.\n"
        }

        if (errorFileNotSelected) {
            errorText += " - File is not selected.\n"
        }

        if (!errorMissingFile && !errorMissingContext && !errorFileNotSelected) {
            errorText = "No errors found."
        }

        setErrorText(errorText)

        setError(errorMissingFile || errorMissingContext || errorFileNotSelected)
    }

    let generateUpdate = async () => {

        let parsedFile = filePreview.textContent.replaceAll("\n", "")
        let parsedFile2 = parsedFile.replaceAll("\"", "\\\"")

        let parsedPrompt = prompt.replace("{file}", parsedFile2)

        let parsedContext = context.replaceAll("\"", "\\\"")

        let parsedPrompt2 = parsedPrompt.replace("{context}", parsedContext)

        const openai = new OpenAI({
            apiKey: "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",
            dangerouslyAllowBrowser: true
        })

        setLoading(true)

        let gptRequest = {
            model: "gpt-4-turbo-preview",
            messages: [{
                "role": "user",
                "content": parsedPrompt2
            }]
        }

        let completion = await openai.chat.completions.create(
            gptRequest
        )

        let message = completion.choices[0].message.content

        console.log(message);

        let updateGen = {
            "fileList": [selectedFile],
            "filePathMap": [selectedFilePath],
            "files": [
                {
                    "name": selectedFile,
                    "content": btoa(message)
                }
            ]
        }

        let req = JSON.stringify(updateGen)

        let encodedReq = btoa(req)

        const formData = new FormData();

        formData.append("u", encodedReq)

        fetch("https://unsupervision.teslasoft.org/unsupervision/updates/GenerateFixedUpdate.php", {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            setDialog("Update generated successfully. Navigate to 'Pending updates' tab to apply it.")
            setDialogTitle("Update generated")
            setLoading(false)
        });
    }

    return (
        <div className={"pp"}>
            <h2 className={"tab-title"}>Generate AI update</h2>
            <div className={"form-card"}>
                <h3 className={"form-title"}>Prompt</h3>
                <textarea className={"mtrl-textarea"}
                          onChange={(e) => {
                                setPrompt(e.target.value)
                          }}
                          placeholder={"Prompt"} defaultValue={prompt}></textarea>
                <br/>
                <div className={"info-card"}>
                    <span className={"material-symbols-outlined"}>note</span><span className={"info-message"}>Placeholders are supported. Use {'{file}'} to insert a file. Use {'{context}'} to provide additional info.</span>
                </div>
            </div>

            <div className={"form-card"}>
                <h3 className={"form-title"}>Select a file to patch</h3>
                <div className={selectedUpdate === null ? "selected-item-error" : "selected-item"}>
                    {selectedUpdate !== null ?
                        <h4 className={"selected-item-text"}>Selected file: {selectedFile} at {selectedFilePath} in
                            update
                            ID {selectedUpdate}</h4> :
                        <h4 className={"selected-item-text"}>No file selected</h4>}
                </div>
                {upd !== null && data !== null && data.length === upd.updates.length ?
                    data.map((item, index) => (
                        <div className={selectedUpdate === item.updateId ? "update-selector-active" : "update-selector"}
                             key={index}>
                            <h4 className={"update-unselected form-subtitle"} id={index.toString() + "_t"}
                                onClick={() => {
                                    let el = document.getElementById(index.toString() + "_upd")
                                    let el2 = document.getElementById(index.toString() + "_t")
                                    if (el.style.display === "none") {
                                        el.style.display = "block"
                                        el2.classList.add("update-selected")
                                        el2.classList.remove("update-unselected")
                                    } else {
                                        el.style.display = "none"
                                        el2.classList.add("update-unselected")
                                        el2.classList.remove("update-selected")
                                    }
                                }}>Update ID {item.updateId}</h4>
                            <div id={index.toString() + "_upd"} style={{
                                display: "none"
                            }}>
                                {
                                    item.changeMap.map((file, index2) => (
                                        <div
                                            className={file.fileName.replace("/", "") === selectedFile && item.updateId === selectedUpdate ? "file-item-selected" : "file-item"}
                                            onClick={
                                                () => {
                                                    setSelectedUpdate(item.updateId)
                                                    setSelectedFile(file.fileName.replace("/", ""))
                                                    setSelectedFilePath(file.path)
                                                }
                                            }>
                                            <p key={index2}>{file.fileName.replace("/", "")}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )) : <div className={"loading-placeholder"}>
                        <CircularProgress/>
                    </div>}
            </div>
            <div className={"form-card"}>
                <h3 className={"form-title"}>Prepare file</h3>

                <div className={"info-card"}>
                    <span className={"material-symbols-outlined"}>note</span><span className={"info-message"}>Click the button below to download and preview file before continuing. File preview will be shown in the bow below.</span>
                </div>
                <br/>
                <button onClick={() => {
                    if (selectedUpdate !== null) {
                        downloadFile(selectedUpdate, selectedFilePath, selectedFile)
                    }
                }}
                        className={selectedUpdate === null ? "mtrl-button-disabled mtrl-button-tonal" : "mtrl-button-tonal-success mtrl-button-tonal"}
                        disabled={selectedUpdate === null}>
                    <span
                        className="material-symbols-outlined-btn material-symbols-outlined">download</span>&nbsp;&nbsp;Download
                    file for patch
                </button>
                <br/>
                <textarea className={"mtrl-textarea-code mtrl-textarea"} readOnly={true} id={"filePreviewT"}></textarea>
            </div>

            {loading ? <div className={"dialog"}>
                <CircularProgress/>
            </div> : null}

            <div className={"form-card"}>
                <h3 className={"form-title"}>Telemetry data</h3>
                <div className={"telemetry-embedded"}>
                    <Telemetry embedded={true}/>
                </div>
            </div>

            <div className={"form-card"}>
                <h3 className={"form-title"}>Additional info</h3>
                <textarea className={"mtrl-textarea"}
                          onChange={(e) => {
                                setContext(e.target.value)
                          }}
                          placeholder={"Context"} defaultValue={context}></textarea>
                <br/>
                <div className={"info-card"}>
                    <span className={"material-symbols-outlined"}>info</span><span className={"info-message"}>Put any additional info here. For example it can be developer notes or telemetry data.</span>
                </div>
            </div>

            <div className={"form-card"}>
                <h3 className={"form-title"}>Submit</h3>
                <div className={"warning-card"}>
                    <span className={"material-symbols-outlined"}>warning</span><span className={"warning-message"}>Patch generation can take some time. Please don't close this page until patch is generated. Please check the info provided to prevent malformed update. Click the button below to proceed.</span>
                </div>
                <br/>
                <div className={"error-card-v2"}>
                    <pre className={"error-message-v2"}>{errorText}</pre>
                </div>
                <br/>
                <button onClick={() => {
                    generateUpdate()
                }} className={error ? "mtrl-button-disabled mtrl-button-tonal" : "mtrl-button-tonal-success mtrl-button-tonal"} disabled={error}>
                    <span
                        className="material-symbols-outlined-btn material-symbols-outlined">play_arrow</span>&nbsp;&nbsp;Generate update
                </button>
            </div>

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
        </div>
    );
}

export default AiUpdate;