import React, { memo } from 'react';
import { PencilLine, Download, Loader2 } from "lucide-react";

interface PdfControlsProps {
    onAddSignatureBox: () => void;
    onDownloadPdf: () => void;
    isLoading?: boolean;
    hasSignatures: boolean;
    isProcessing?: boolean;
}

const PdfControls: React.FC<PdfControlsProps> = memo(({
    onAddSignatureBox,
    onDownloadPdf,
    isLoading = false,
    hasSignatures,
    isProcessing = false
}) => {
    return (
        <>
            {/* Desktop Controls (unchanged) */}
            <div className="hidden lg:block relative p-2" style={{ width: "15%" }}>
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
                        className={(!hasSignatures || isProcessing) ? "text-tertiary" : ""}
                        onClick={!hasSignatures || isProcessing ? undefined : onDownloadPdf}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: (!hasSignatures || isProcessing) ? 'not-allowed' : 'pointer',
                            border: "1px solid #e5e7eb",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            opacity: (!hasSignatures || isProcessing) ? 0.6 : 1
                        }}
                    >
                        <span>
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        </span>
                        <span className='ml-2'>
                            {isProcessing ? 'Processing...' : 'Download'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Controls - Fixed below SignX header without affecting layout */}
            <div className="lg:hidden fixed left-0 right-0 bg-white border-b border-gray-200 z-50" style={{ top: '56px' }}>
                <div className="flex items-center justify-center gap-4 p-3">
                    <button
                        onClick={onAddSignatureBox}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
                    >
                        <PencilLine size={16} />
                        <span>Signature</span>
                    </button>

                    <button
                        onClick={!hasSignatures || isProcessing ? undefined : onDownloadPdf}
                        disabled={!hasSignatures || isProcessing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${(!hasSignatures || isProcessing)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                            }`}
                    >
                        {isProcessing ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Download size={16} />
                        )}
                        <span>
                            {isProcessing ? 'Processing...' : 'Download'}
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
});

export default PdfControls;