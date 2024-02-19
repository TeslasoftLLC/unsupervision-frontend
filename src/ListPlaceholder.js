import React from 'react';

function ListPlaceholder(props) {
    return (
        <div className={"list-placeholder"}>
            <div className={"error-card"}>
                <span className={"material-symbols-outlined"}>warning</span><span
                className={"error-message"}>{props.text}</span>
            </div>
        </div>
    );
}

export default ListPlaceholder;