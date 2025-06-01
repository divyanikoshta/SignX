import { ArrowRight } from "lucide-react";
import FilePreview from "./FilePreview";
import FileUploader from "./FileUploader";
import Button from "./ui/Button/Button";
import { useCallback, useRef, useState } from "react";
import { useSignXLoader } from "../hooks/useSignXLoader";

interface handleClickSignProps {
    handleClickSign: any,
    file: File | null,
    handleFileChange: any
}

const FileUploaderConatiner = ({ handleClickSign, file, handleFileChange }: handleClickSignProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [numPages, setNumPages] = useState<number>(0);
    const [renderedPages, setRenderedPages] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { Loader } = useSignXLoader(loading);

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setLoading(true);
        setNumPages(numPages);
        setRenderedPages(0);
    };

    const handlePageRenderSuccess = useCallback(() => {
        setRenderedPages(prev => {
            const newCount = prev + 1;
            if (newCount === numPages) {
                yourCustomFunction();
            }
            return newCount;
        });
    }, [numPages]);

    const yourCustomFunction = () => {
        setLoading(false);
    };

    return (
        <>
            <Loader />
            <div className="flex flex-col items-center justify-center bg-gray-50 h-full">
                <div className="flex flex-col bg-white border border-gray-300 rounded-md w-[80%] p-8 h-full lg:h-[80%]">
                    <div className="text-[26px] font-bold mb-4">
                        Free PDF Signing
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 flex-1" style={{ height: "76%" }}>
                        {/* Dropzone */}
                        <FileUploader fileInputRef={fileInputRef} handleFileClick={handleFileClick} handleFileChange={handleFileChange} />

                        {/* Uploaded PDF Preview */}
                        <FilePreview file={file} onDocumentLoadSuccess={onDocumentLoadSuccess} numPages={numPages} handlePageRenderSuccess={handlePageRenderSuccess} />
                    </div>

                    <div className="mt-4 text flex justify-end items-center">
                        <Button 
                            size="large" 
                            onClick={handleClickSign} 
                            variant="primary" 
                            rightIcon={<ArrowRight />}
                            disabled={!file}
                        >
                            Sign
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default FileUploaderConatiner