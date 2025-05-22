import { Page, Document } from "react-pdf";


interface FilePreviewProps {
    file: File | null,
    onDocumentLoadSuccess: any,
    numPages: number,
}

const FilePreview = ({ file, onDocumentLoadSuccess, numPages }: FilePreviewProps) => {

    return (
        <div className="border rounded shadow-sm p-4 md:w-1/3" style={{ background: "#f1f5f9", width: "40%", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "0.5rem", color: "#334155", textAlign: "left" }}>
                Document Preview
            </div>
            <div className="border mb-4 overflow-auto h-full" style={{ borderRadius: "0.5rem" }}>
                {file ? (
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        {Array.from({ length: numPages }, (_, index) => (
                            <Page key={index + 1} pageNumber={index + 1} width={400} renderTextLayer={false}
                                renderAnnotationLayer={false} />
                        ))}
                    </Document>
                ) : <div className="flex justify-center items-center h-full" style={{ background: "white", }}>
                    Please upload the file to sign
                </div>}

            </div>
            <div className="text-sm font-medium text-gray-700">{file?.name}</div>
            {numPages !== 0 && <div className="text-sm text-gray-500">{numPages} {numPages > 1 ? 'Pages' : "Page"}</div>}
        </div>
    )

}

export default FilePreview;