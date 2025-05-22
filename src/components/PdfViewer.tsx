import { useEffect, useState } from "react";
import Layout from "./Layout";
import PdfViewHelper from "./PdfViewHelper";
import FILE from "../mock/sampleFile2";
import FileUploaderConatiner from "./FileUploaderConatiner";
import './../pdfWorkerSetup';
import { pdfjs } from 'react-pdf';

// Set this before using any react-pdf components
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;


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