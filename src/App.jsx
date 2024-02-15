import './App.css';
import React, {useEffect, useState} from "react";
import Updates from "./Updates";
import Telemetry from "./Telemetry";
import PendingUpdates from "./PendingUpdates";
import AiUpdate from "./AIUpdate";
import Auth from "./Auth";
import {CircularProgress} from "@mui/material";
import Tests from "./Tests";
import About from "./About";
import UndefinedPage from "./UndefinedPage";

function App() {
    let [selectedItem, setSelectedItem] = useState(1)
    let [authState, setAuthState] = useState(false)
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState("")

    useEffect(() => {
        verifyToken()
    }, []);

    useEffect(() => {
        if (authState === true) {
            verifyToken()
        }
    }, [authState]);

    let verifyToken = () => {
        if (localStorage.getItem("token") !== null) {
            setLoading(true);
            let formData = new FormData();
            formData.append("token", localStorage.getItem("token"));

            let xhr = new XMLHttpRequest();

            xhr.open('POST', 'https://unsupervision.teslasoft.org/auth/users/VerifyToken.php', true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // Check if the status is "OK" (status 200)
                    if (xhr.status === 200) {
                        let response = JSON.parse(xhr.responseText);

                        console.log(response);

                        if (response.code === 200) {
                            setAuthState(true);
                            setLoading(false)
                        } else {
                            localStorage.removeItem("token");
                            setAuthState(false);
                            setLoading(false)
                        }

                        if (response.code !== 200) {
                            setError(response.message);
                        }
                    } else {
                        // Handle the error
                        console.error('Error:', xhr.status, xhr.statusText);

                        setLoading(false)
                    }
                }
            };

            xhr.send(formData);
        } else {
            setAuthState(false)
            setLoading(false)
        }
    }

    let logout = () => {
        localStorage.removeItem("token");
        setAuthState(false);
    }

    return (
        <div className="App">
            {loading ? <div className={"dialog-banner"}>
                <CircularProgress/>
            </div> : null}
            {
                authState === false ? <div className={"auth"}>
                <Auth setAuth={setAuthState}/>
                </div> : <>
                    <div className={"action-bar"}>
                        <h2 className={"logo"}><span className={"logo-1"}>UN</span><span
                            className={"logo-2"}>Supervision</span></h2>

                        <div className={"ab-right"}>
                            <button className={"mtrl-button-tonal-error mtrl-button-tonal"}
                                    onClick={logout}>
                                    <span
                                        className="material-symbols-outlined-btn material-symbols-outlined">logout</span>&nbsp;&nbsp;Logout
                            </button>
                        </div>
                    </div>
                    <div className={"sidebar"}>
                        <div className={"before-menu"}/>
                        <button className={selectedItem === 1 ? "menu-entry-active" : "menu-entry"} onClick={
                            () => {
                                setSelectedItem(1)
                            }}>
                            <p>Updates</p>
                        </button>
                        <button className={selectedItem === 2 ? "menu-entry-active" : "menu-entry"} onClick={
                            () => {
                                setSelectedItem(2)
                            }}>
                            <p>Pending updates</p>
                        </button>
                        <button className={selectedItem === 3 ? "menu-entry-active" : "menu-entry"} onClick={
                            () => {
                                setSelectedItem(3)
                            }}>
                            <p>Telemetry</p>
                        </button>
                        <button className={selectedItem === 4 ? "menu-entry-active" : "menu-entry"} onClick={
                            () => {
                                setSelectedItem(4)
                            }}>
                            <p>Generate AI Update</p>
                        </button>
                        <button className={selectedItem === 5 ? "menu-entry-active" : "menu-entry"} onClick={
                            () => {
                                setSelectedItem(5)
                            }}>
                            <p>Tests</p>
                        </button>
                        <button className={selectedItem === 6 ? "menu-entry-active" : "menu-entry"} onClick={
                            () => {
                                setSelectedItem(6)
                            }}>
                            <p>About system</p>
                        </button>
                    </div>
                    <div className={"content"}>
                        {selectedItem === 1 ? <Updates/> : <> {selectedItem === 2 ?
                            <PendingUpdates/> :
                            <>{selectedItem === 3 ?
                                <Telemetry/> :
                                <> {selectedItem === 4 ? <AiUpdate/> :
                                    <>{selectedItem === 5 ? <Tests/> :
                                        <>{selectedItem === 6 ? <About/> :
                                            <UndefinedPage/>}
                                        </>}
                                    </>}
                                </>}
                            </>}
                        </>}
                    </div>
                </>
            }
        </div>
    );
}

export default App;
