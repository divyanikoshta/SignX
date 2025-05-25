import { useState, useEffect, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { getPDFDocument, createPDFPage, renderPDFToCanvas } from '../utility/pdfViewerUtility';

export const usePdfRenderer = (fileAsBase64: string, scale: number) => {
    const [isLoading, setIsLoading] = useState(false);
    const [numPages, setNumPages] = useState(0);
    const pdfDocumentRef = useRef<any>(null);

    useEffect(() => {
        const renderPdf = async () => {
            try {
                setIsLoading(true);
                const binaryString = atob(fileAsBase64);
                const pdfDocument: any = await getPDFDocument(binaryString);
                pdfDocumentRef.current = pdfDocument;

                const fullPdfContainer = document.getElementById("pdf-container");
                if (!fullPdfContainer) {
                    console.error("Container element not found.");
                    return;
                }

                // Clear any existing content
                fullPdfContainer.innerHTML = '';

                const pdfTotalPages = pdfDocument.numPages;
                setNumPages(pdfTotalPages);

                for (let pageNumber = 1; pageNumber <= pdfTotalPages; pageNumber++) {
                    const pdfPage = await createPDFPage(pdfDocument, pageNumber);
                    const viewport = pdfPage.getViewport({ scale });
                    const { height, width } = viewport;

                    const perPageContainer = document.createElement("div");
                    perPageContainer.style.position = "relative";
                    perPageContainer.style.width = width + 'px';
                    perPageContainer.style.height = height + 'px';

                    perPageContainer.setAttribute("data-page-number", String(pageNumber));
                    fullPdfContainer.appendChild(perPageContainer);

                    // Create canvas for each page
                    const canvas = document.createElement("canvas");
                    canvas.height = height;
                    canvas.width = width;
                    canvas.style.border = "1px solid var(--tertiary-color)";
                    canvas.style.boxShadow = "0px 0px 3px var(--tertiary-color)";
                    const pdfPageCanvas = await renderPDFToCanvas(pdfPage, canvas, { scale });
                    perPageContainer.appendChild(pdfPageCanvas);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error rendering PDF:', error);
            }
        };

        if (fileAsBase64) {
            renderPdf();
        }

        return () => {
            // Cleanup if needed
            pdfDocumentRef.current = null;
        };
    }, [fileAsBase64, scale]);

    return { isLoading, numPages, pdfDocumentRef };
};