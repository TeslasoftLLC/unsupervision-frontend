import React from 'react';
import packageJson from '../package.json';

function About(props) {
    return (
        <div className={"pp"}>
            <h2 className={"tab-title"}>About system</h2>

            <div style={{
                padding: "0 24px",
            }}>
                <div className={"info-card"}>
                    <span className={"material-symbols-outlined"}>webhook</span><span
                    className={"info-message"}>Developer: AndraxDev
                </span>
                </div>
                <br/>
                <div className={"info-card"}>
                    <span className={"material-symbols-outlined"}>code_blocks</span><span
                    className={"info-message"}>Version: {packageJson.version}
                </span>
                </div>
                <br/>
                <div className={"info-card"}>
                    <span className={"material-symbols-outlined"}>api</span><span
                    className={"info-message"}>React version: {packageJson.dependencies.react.replace("^", "")}
                </span>
                </div>
                <br/>
                <div className={"info-card"}>
                    <span className={"material-symbols-outlined"}>palette</span><span
                    className={"info-message"}>MUI version: {packageJson.dependencies["@mui/material"].replace("^", "")}
                </span>
                </div>
            </div>
        </div>
    );
}

export default About;