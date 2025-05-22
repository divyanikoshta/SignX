import { useState } from "react";
import Layout from "./Layout";
// import FILE from "../mock/samplefile";
import PdfViewHelper from "./PdfViewHelper";
import FILE from "../mock/sampleFile2";
import { pdfjs } from "react-pdf";
import FileUploaderConatiner from "./FileUploaderConatiner";
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}pdf.worker.min.mjs`;

const PdfViewer = () => {
    const pdfConfig = {
        scale: 1.5
    }
    const [isSignClicked, setIsSignedClicked] = useState(false);
    const handleClickSign = () => {
        setIsSignedClicked(!isSignClicked);
    }

    return (
        <div>
            <Layout isSignClicked={isSignClicked} handleClickSign={handleClickSign}>
                {!isSignClicked ?
                    <FileUploaderConatiner handleClickSign={handleClickSign} /> :
                    <PdfViewHelper fileAsBase64={FILE} pdfConfig={pdfConfig} />}
            </Layout>
        </div>
    )
};

export default PdfViewer;