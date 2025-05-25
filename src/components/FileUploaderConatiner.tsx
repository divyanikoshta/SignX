import { ArrowRight } from "lucide-react";
import FilePreview from "./FilePreview";
import FileUploader from "./FileUploader";
import Button from "./ui/Button/Button";
import { useRef, useState } from "react";

interface handleClickSignProps {
    handleClickSign: any,
    file: File | null,
    handleFileChange: any
}

const FileUploaderConatiner = ({ handleClickSign, file, handleFileChange }: handleClickSignProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [numPages, setNumPages] = useState<number>(0);

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    return (
        <div className="flex flex-col items-center" style={{ background: "#f8fafc", height: '100%' }}>
            <div className="flex flex-col" style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "0.5rem", width: "80%", margin: "auto", padding: "2rem", height: "80%" }}>

                <div style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "1rem" }}>
                    Free PDF Signing
                </div>
                <div className="flex flex-col md:flex-row gap-6" style={{ height: "76%" }}>
                    {/* Uploaded PDF Preview */}
                    <FilePreview file={file} onDocumentLoadSuccess={onDocumentLoadSuccess} numPages={numPages} />

                    {/* Dropzone */}
                    <FileUploader fileInputRef={fileInputRef} handleFileClick={handleFileClick} handleFileChange={handleFileChange} />
                </div>

                <div className="mt-4 text flex justify-end items-center">
                    <Button size="large" onClick={handleClickSign} variant="primary" rightIcon={<ArrowRight />}>Sign</Button>
                </div>
            </div>


        </div>
    )

}

export default FileUploaderConatiner