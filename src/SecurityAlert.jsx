import React from 'react';
import ListPlaceholder from "./ListPlaceholder";

function SecurityAlert(props) {
    return (
        <div className={"pp"}>
            <h2 className={"tab-title"}>Security alert triggerred!!!</h2>
            <div className={"form-card-v2"}>
                <ListPlaceholder
                    text={"A state of a component has been changed unexpectedly. The new state is invalid. Looks like you've used React DevTools to tamper with this system. Providing you are not a developer please report this security issue immediately through 𝗱𝗼𝘀𝘁𝗮𝗽𝗲𝗻𝗸𝗼𝟴𝟮@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺"}/>
                <button className={"ut mtrl-button-tonal-success mtrl-button-tonal"} onClick={() => {
                    window.location.reload()
                }}>Back to home
                </button>
            </div>
        </div>
    );
}

export default SecurityAlert;