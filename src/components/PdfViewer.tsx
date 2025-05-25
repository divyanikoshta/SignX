import { useEffect, useState } from "react";
import Layout from "./Layout";
import PdfViewHelper from "./PdfViewHelper";
import FileUploaderConatiner from "./FileUploaderConatiner";
import './../pdfWorkerSetup';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;


const PdfViewer = () => {
    const pdfConfig = {
        scale: 1.5
    }
    const [isSignClicked, setIsSignedClicked] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleNavigation = () => {
        setIsSignedClicked(!isSignClicked);
    }
    const handleClickSign = () => {
        handleNavigation()
    }

    const handleFileChange = async (fileObj: File | null) => {
        const selectedFile = fileObj;
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('Please upload a valid PDF file.');
        }
    };

    return (
        <div>
            <Layout isSignClicked={isSignClicked} handleClickSign={handleClickSign}>
                {!isSignClicked ?
                    <FileUploaderConatiner file={file} handleFileChange={handleFileChange} handleClickSign={handleClickSign} /> :
                    <PdfViewHelper file={file} pdfConfig={pdfConfig} />}
            </Layout>
        </div>
    )
};

export default PdfViewer;