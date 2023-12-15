import mockPdf from "./mock/test.pdf"
import PDFViewer from "./component/PDFViewer";
import React from "react";
import Navbar from "./component/Navbar";

function App(): React.JSX.Element {

    return (
        <div className={"flex flex-col"}>
            <Navbar />
            <PDFViewer pdf={mockPdf} />
        </div>
    )
}

export default App