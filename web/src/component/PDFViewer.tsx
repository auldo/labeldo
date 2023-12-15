import PDFViewerProps from "../props/PDFViewerProps";
import React, {useEffect} from "react";
import {loadPdf} from "../pdf/logic";

function PDFViewer(props: PDFViewerProps) {

    useEffect(() => {
        loadPdf("pdf-viewer", props.pdf).catch(() => {
            console.log("Failed loading PDF.")
        })
    }, [])

    return (
        <div className={"overflow-auto"} id={"pdf-root"}>
            <canvas id={"pdf-viewer"}></canvas>
            <div className="textLayer"></div>
        </div>
    )
}

export default PDFViewer