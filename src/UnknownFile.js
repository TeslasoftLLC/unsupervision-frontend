import React from 'react';
import ListPlaceholder from "./ListPlaceholder";

function UnknownFile(props) {
    return (
        <div className={"pp"}>
            <h2 className={"tab-title"}>Error</h2>
            <div className={"form-card-v2"}>
                <ListPlaceholder
                    text={"Failed to retrieve file contents. Providing you are not a developer please report this bug immediately through 𝗱𝗼𝘀𝘁𝗮𝗽𝗲𝗻𝗸𝗼𝟴𝟮@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺"}/>
                <button className={"ut mtrl-button-tonal-success mtrl-button-tonal"} onClick={() => {
                    window.location.reload()
                }}>Back to home
                </button>
            </div>
        </div>
    );
}

export default UnknownFile;