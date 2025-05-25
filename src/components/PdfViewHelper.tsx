import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PdfViewHelperProps } from '../types';
import { usePdfRenderer } from '../hooks/usePdfRenderer';
import { useSignatureBoxes } from '../hooks/useSignatureBoxes';
import { usePdfModifier } from '../hooks/usePdfModifier';
import SignatureBox from './SignatureBox';
import SignatureModal from './SignatureModal/SignatureModal';
import PdfControls from './PdfControls';

const PdfViewHelper: React.FC<PdfViewHelperProps> = ({
    pdfConfig,
    file
}) => {

    const [fileAsBase64, setFileAsBase64] = useState<string>('');

    useEffect(() => {
        console.log("file--->", file)
        if (!file) return;

        const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.replace(/^data:.*;base64,/, '');
                resolve(base64);
            };
            reader.onerror = () => reject(reader.error);
        });

        toBase64(file)
            .then(setFileAsBase64)
            .catch(console.error);
    }, [file]);

    const containerRef = useRef<HTMLDivElement>(null);
    const { isLoaded } = usePdfRenderer(fileAsBase64, pdfConfig.scale);

    const {
        boxes,
        isAddingBox,
        selectedBoxId,
        addBox,
        startAddingBox,
        updateSignature,
        deleteBox,
        handleBoxMouseDown,
        handleBoxClick,
        setSelectedBoxId
    } = useSignatureBoxes();

    const { modifiedPdf, downloadPdf } = usePdfModifier(fileAsBase64, pdfConfig.scale, boxes);

    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        if (!isAddingBox || !containerRef.current) return;

        const pageContainers = containerRef.current.querySelectorAll('[data-page-number]');
        let previousPagesHeight = 0;

        for (let i = 0; i < pageContainers.length; i++) {
            const container = pageContainers[i] as HTMLElement;
            const rect = container.getBoundingClientRect();

            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                const pageNumber = parseInt(container.getAttribute('data-page-number') || '1');

                // Calculate position relative to the clicked page container
                const relativeX = e.clientX - rect.left;
                const relativeY = e.clientY - rect.top + previousPagesHeight;

                addBox(relativeX, relativeY, pageNumber);
                break;
            }

            // Add this page's height to the cumulative height for next iteration
            previousPagesHeight += rect.height;
        }
    }, [isAddingBox, addBox]);

    const handleModalConfirm = useCallback((signatureDataUrl: string) => {
        if (selectedBoxId) {
            updateSignature(selectedBoxId, signatureDataUrl);
        }
    }, [selectedBoxId, updateSignature]);

    const handleModalClose = useCallback(() => {
        setSelectedBoxId(null);
    }, [setSelectedBoxId]);

    const handleDownloadPdf = useCallback(() => {
        downloadPdf(`${file?.name.split(".")[0]}_singed.pdf`);
    }, [downloadPdf]);

    return (
        <div className="pdf-view-helper flex justify-center">
            <div className='flex justify-center w-[80%]'>
                <PdfControls
                    onAddSignatureBox={startAddingBox}
                    onDownloadPdf={handleDownloadPdf}
                    isLoading={!isLoaded}
                    hasSignatures={boxes.some(box => box.sign !== '')}
                />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                        ref={containerRef}
                        id="pdf-container"
                        onClick={handleContainerClick}
                        style={{ position: 'relative' }}
                    >
                        {boxes.map((box, index) => (
                            <SignatureBox
                                key={box.id}
                                box={box}
                                index={index}
                                onBoxClick={handleBoxClick}
                                onMouseDown={handleBoxMouseDown}
                                onDelete={deleteBox}
                            />
                        ))}
                    </div>
                </div>
            </div>


            {selectedBoxId && (
                <SignatureModal
                    onConfirm={handleModalConfirm}
                    onClose={handleModalClose}
                />
            )}

            {/* {modifiedPdf && (
                <iframe
                    title="Modified PDF"
                    src={modifiedPdf}
                    width="100%"
                    height="600px"
                    style={{ border: '1px solid #ccc', marginTop: '20px', borderRadius: '4px' }}
                />
            )} */}
        </div>
    );
};

export default PdfViewHelper;