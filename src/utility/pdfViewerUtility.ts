import { getDocument, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import './../pdfWorkerSetup';

export const getPDFDocument = async (arrayBuffer: string) => {

    return new Promise((resolve, reject) => {
        getDocument({ data: arrayBuffer })
            .promise.then((document) => {
                resolve(document);
            })
            .catch((error: any) => reject(error));

    })
};

export const createPDFPage = (document: PDFDocumentProxy, page: number): Promise<PDFPageProxy> => {
    return new Promise((resolve, reject) => {
        if (!document || !page) {
            return reject();
        }
        document
            .getPage(page)
            .then((pageDocument: PDFPageProxy) => {
                resolve(pageDocument);
            })
            .catch((error: any) => reject(error));
    })
};

export const renderPDFToCanvas = (
    pageDocument: PDFPageProxy,
    canvas: HTMLCanvasElement,
    pdfConfig?: { scale?: number; maxWidth?: number; maxHeight?: number }
): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        if (!context) {
            return reject(new Error("Could not get canvas context"));
        }

        // Get device pixel ratio for crisp rendering
        const devicePixelRatio = window.devicePixelRatio || 1;
        const baseScale = pdfConfig?.scale || 1.5;

        // Get initial viewport to determine dimensions
        const initialViewport = pageDocument.getViewport({ scale: baseScale });

        // Apply constraints if provided
        let finalScale = baseScale;
        if (pdfConfig?.maxWidth && initialViewport.width > pdfConfig.maxWidth) {
            finalScale = (pdfConfig.maxWidth / initialViewport.width) * baseScale;
        }
        if (pdfConfig?.maxHeight && initialViewport.height > pdfConfig.maxHeight) {
            const heightScale = (pdfConfig.maxHeight / initialViewport.height) * baseScale;
            finalScale = Math.min(finalScale, heightScale);
        }

        // Get final viewport with constrained scale
        const viewport = pageDocument.getViewport({ scale: finalScale });

        // Set canvas buffer size (accounting for device pixel ratio for crispness)
        canvas.width = Math.floor(viewport.width * devicePixelRatio);
        canvas.height = Math.floor(viewport.height * devicePixelRatio);

        // Set canvas display size (what user sees)
        canvas.style.width = viewport.width + 'px';
        canvas.style.height = viewport.height + 'px';

        // Scale context to account for device pixel ratio
        context.scale(devicePixelRatio, devicePixelRatio);

        // Disable image smoothing for crisp text
        context.imageSmoothingEnabled = false;

        // Render with the display-sized viewport
        const renderContext = {
            canvasContext: context,
            viewport: viewport, // Use the display viewport, not the scaled one
        };

        pageDocument
            .render(renderContext)
            .promise.then(() => {
            resolve(canvas);
        })
            .catch((error: any) => reject(error));
    });
};

// Helper function to render PDF with container constraints
export const renderPDFToContainerCanvas = (
    pageDocument: PDFPageProxy,
    canvas: HTMLCanvasElement,
    containerWidth: number,
    containerHeight: number,
    padding: number = 2
): Promise<HTMLCanvasElement> => {
    const availableWidth = containerWidth - (padding * 2);
    const availableHeight = containerHeight - (padding * 2);

    return renderPDFToCanvas(pageDocument, canvas, {
        scale: 1.5,
        maxWidth: availableWidth,
        maxHeight: availableHeight
    });
};