import React, {useEffect, useState} from 'react';
import {Alert, CircularProgress, Snackbar} from "@mui/material";
import {MaterialButton, MaterialButtonTonal, MaterialEditText} from "./MaterialComponents";
import TeslasoftID from "./TeslasoftID";

function Auth(props) {
    // Snackbar state
    const [snackbarOpened, setSnackbarOpened] = useState(false)
    const [snackbarSuccessOpened, setSnackbarSuccessOpened] = useState(false)
    const [helpDialogOpened, setHelpDialogOpened] = useState(false)

    // Error message
    const [error, setError] = useState("")
    const [msg, setMsg] = useState("")

    // Loading page state
    const [isLoading, setIsLoading] = useState(false)

    // Prevent page from updating
    useEffect(() => {
        const form = document.getElementById("login-form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
        });
    }, [])

    // Snackbar close handler
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpened(false)
        setSnackbarSuccessOpened(false)
    };

    let auth = () => {
        if (document.getElementById("username").value.toString().trim() === "" || document.getElementById("password").value.toString().trim() === "") {
            setError("Please fill all fields.")
        } else {
            setIsLoading(true);

            let passwordHash = require('js-sha256').sha256(document.getElementById("password").value);

            let formData = new FormData();
            formData.append("username", document.getElementById("username").value);
            formData.append("password", passwordHash);

            let xhr = new XMLHttpRequest();

            xhr.open('POST', 'https://unsupervision.teslasoft.org/auth/users/Validator.php', true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // Check if the status is "OK" (status 200)
                    if (xhr.status === 200) {
                        let response = JSON.parse(xhr.responseText);

                        if (response.code === 403) {
                            //
                        } else if (response.code === 200) {
                            props.setAuth(true);
                            setMsg("Authentication successful.")
                            setSnackbarSuccessOpened(true);
                            localStorage.setItem("token", response.message);
                        }

                        if (response.code !== 200) {
                            setError(response.message);
                            setSnackbarOpened(true);
                        }
                    } else {
                        // Handle the error
                        console.error('Error:', xhr.status, xhr.statusText);
                    }

                    setIsLoading(false);
                }
            };

            xhr.send(formData);
        }
    }

    // Sign in handler
    const signIn = () => {
        auth();
    }

    const help = () => {
        setHelpDialogOpened(true)
    }

    return (
        <div className={"auth-page"}>
            {helpDialogOpened ? <div className={"dialog"}>
                    <div className={"dialog-bg"}>
                        <h3 className={"dialog-title"}>What is it?</h3>
                        <p className={"text dialog-message"}>UNSupervision dashboard is an interactive panel to manage
                            AI-generated updates. This is the part of Bachelor project.</p>
                        <div className={"dialog-actions"}>
                            <button className={"mtrl-button-tonal"} onClick={() => {
                                setHelpDialogOpened(false)
                            }}>Close
                            </button>
                        </div>
                    </div>
                </div>
                : null}
                <div className={"auth-center"}>
                <div className={"auth-block"}>
                    <form id="login-form">
                        <div className={"auth-header"}>
                            <h1 className={"auth-header-text"}>Sign In</h1>
                        </div>
                        <br/>
                        <br/>
                        <MaterialEditText
                            InputLabelProps={{shrink: true}}
                            className={"input"}
                            id="username"
                            label="Email"
                            variant="outlined"/>
                        <br/>
                        <br/>
                        <MaterialEditText
                            InputLabelProps={{shrink: true}}
                            className={"input"}
                            id="password"
                            label="Password"
                            type={'password'}
                        />
                        <br/>
                        <br/>
                        <div className={"auth-btn"}>
                            <MaterialButton onClick={signIn} variant="contained">Sign In</MaterialButton>
                            <div style={{
                                flexGrow: "1"
                            }}>
                            </div>
                            <MaterialButtonTonal onClick={help}>&nbsp;What is it?&nbsp;</MaterialButtonTonal>
                        </div>
                        <br/>
                        <div className={"auth-separator"}>
                            <hr className={"auth-hr"}/>
                            <h2 className={"auth-header-text"}>or</h2>
                            <hr className={"auth-hr"}/>
                        </div>
                        <br/>
                        <div>
                            <TeslasoftID/>
                        </div>
                    </form>
                    <Snackbar
                        open={snackbarOpened}
                        autoHideDuration={5000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        sx={{
                            zIndex: "20000"
                        }}
                    >
                        <Alert onClose={handleSnackbarClose} severity="error" sx={{
                            width: '100%'
                        }}>
                            { error }
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={snackbarSuccessOpened}
                        autoHideDuration={5000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        sx={{
                            zIndex: "20000"
                        }}
                    >
                        <Alert onClose={handleSnackbarClose} severity="success" sx={{
                            width: '100%'
                        }}>
                            { msg }
                        </Alert>
                    </Snackbar>
                </div>
            </div>
            {isLoading ? <div className={"dialog"}>
                <CircularProgress/>
            </div>  : null}
        </div>
    );
}

export default Auth;