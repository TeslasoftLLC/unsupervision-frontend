import React from 'react';
import ListPlaceholder from "./ListPlaceholder";

function UndefinedPage(props) {
    return (
        <div className={"pp"}>
            <h2 className={"tab-title"}>You've come too far...</h2>
            <div className={"form-card-v2"}>
            <ListPlaceholder text={"...but you've reached a page that doesn't exist. Please go back and try again. Normally it's not possible to reach this page, but it looks like you tried to tamper with this system using React DevTools. Providing you are not a developer please report this security issue immediately through 𝗱𝗼𝘀𝘁𝗮𝗽𝗲𝗻𝗸𝗼𝟴𝟮@𝗴𝗺𝗮𝗶𝗹.𝗰𝗼𝗺"}/>
            <button className={"ut mtrl-button-tonal-success mtrl-button-tonal"} onClick={() => {window.location.reload()}}>Back to home</button>
            </div>
        </div>
    );
}

export default UndefinedPage;
