import React from 'react';
import "./TeslasoftID.css"

function TeslasoftID() {
    return (
        <a className={"btn-id5"} href = "https://id.teslasoft.org/oauth?continue=https://unsupervision.teslasoft.org/auth/_id5/ID5AuthCallback.php">
            <div className={"btn-bg"}>
                <img alt={"id5"} src="https://id.teslasoft.org/nfcid/icon.png" className={"icon-x"}/>
                <span className={"text-x"}>&nbsp;&nbsp;&nbsp;Sign In with Teslasoft ID CAS&nbsp;&nbsp;&nbsp;</span>
            </div>
        </a>
    );
}

export default TeslasoftID;
