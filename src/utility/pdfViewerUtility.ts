import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";


export const getPDFDocument = async (arrayBuffer: string) => {
    GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
    ).toString();

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

export const renderPDFToCanvas = (pageDocument: PDFPageProxy, canvas: HTMLCanvasElement, pdfConfig?: any): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
        pageDocument
            .render({
                canvasContext: canvas.getContext("2d") as CanvasRenderingContext2D,
                viewport: pageDocument.getViewport({ scale: pdfConfig?.scale || 1.5 }),
            })
            .promise.then(() => {
                resolve(canvas);
            })
    })
};