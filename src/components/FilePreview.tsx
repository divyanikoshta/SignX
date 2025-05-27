import { Page, Document } from "react-pdf";


interface FilePreviewProps {
    file: File | null,
    onDocumentLoadSuccess: any,
    numPages: number,
    handlePageRenderSuccess: any
}

const FilePreview = ({ file, onDocumentLoadSuccess, numPages, handlePageRenderSuccess }: FilePreviewProps) => {
    return (
        <div className="border rounded shadow-sm p-4 bg-slate-100 w-full lg:w-[40%] flex flex-col" style={{ height: "100%", overflow: 'auto' }}>
            <div className="text-[18px] font-bold mb-2 text-slate-700 text-left">
                Document Preview
            </div>
            <div className="border mb-4 overflow-auto flex-1 rounded-md">
                {file ? (
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        {Array.from({ length: numPages }, (_, index) => (
                            <Page key={index + 1} pageNumber={index + 1} width={400} renderTextLayer={false}
                                renderAnnotationLayer={false} onRenderSuccess={handlePageRenderSuccess} />
                        ))}
                    </Document>
                ) : <div className="flex justify-center items-center h-full bg-white">
                    Please upload the file to sign
                </div>}

            </div>
            <div className="text-sm font-medium text-gray-700">{file?.name}</div>
            {numPages !== 0 && <div className="text-sm text-gray-500">{numPages} {numPages > 1 ? 'Pages' : "Page"}</div>}
        </div>
    )

}

export default FilePreview;