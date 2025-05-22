import React, { memo } from 'react';
import { PencilLine, Download } from "lucide-react";

interface PdfControlsProps {
    onAddSignatureBox: () => void;
    onDownloadPdf: () => void;
    isLoading?: boolean;
    hasSignatures: boolean;
}

const PdfControls: React.FC<PdfControlsProps> = memo(({
    onAddSignatureBox,
    onDownloadPdf,
    isLoading = false,
    hasSignatures
}) => {
    return (
        <div className="relative p-2" style={{ width: "15%" }}>
            <div className='p-2 border-b font-semibold text-left fixed'>
                ACTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className='fixed top-36'>
                <div
                    onClick={onAddSignatureBox}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', border: "1px solid #e5e7eb",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem"

                    }}
                >
                    <span><PencilLine size={16} /></span>
                    <span className='ml-2'>Signature</span>
                </div>

                <div
                    className={!hasSignatures ? "text-tertiary" : ""}
                    onClick={onDownloadPdf}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', border: "1px solid #e5e7eb",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem"
                    }}
                >
                    <span><Download size={16} /></span>
                    <span className='ml-2'>Download</span>
                </div>
            </div>
        </div>
    );
});

export default PdfControls;