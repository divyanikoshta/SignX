import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

const PdfTextRenderer = ({ base64, scale = 2 }: any) => {
    GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
    ).toString();

    // const containerRef = useRef(null);

    // useEffect(() => {
    //     const renderText = async () => {
    //         if (!base64) return;

    //         const cleanBase64 = base64.split(',').pop()!;
    //         const binary = atob(cleanBase64);
    //         const byteArray = new Uint8Array(binary.length);
    //         for (let i = 0; i < binary.length; i++) {
    //             byteArray[i] = binary.charCodeAt(i);
    //         }

    //         const pdf = await pdfjsLib.getDocument({ data: byteArray }).promise;
    //         const container: any = containerRef.current!;
    //         container.innerHTML = '';

    //         for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    //             const page = await pdf.getPage(pageNum);
    //             const viewport = page.getViewport({ scale: 1.5 });
    //             const textContent = await page.getTextContent();

    //             const pageDiv = document.createElement('div');
    //             pageDiv.style.position = 'relative';
    //             pageDiv.style.width = `${viewport.width}px`;
    //             pageDiv.style.height = `${viewport.height}px`;
    //             pageDiv.className = 'textLayer';

    //             for (const item of textContent.items) {
    //                 const textItem = item as any;
    //                 const span = document.createElement('span');
    //                 span.textContent = textItem.str;
    //                 span.style.position = 'absolute';
    //                 span.style.whiteSpace = 'pre';

    //                 const [a, b, c, d, e, f] = textItem.transform;
    //                 const fontHeight = Math.hypot(c, d);
    //                 const left = e;
    //                 const top = viewport.height - f;

    //                 span.style.left = `${left}px`;
    //                 span.style.top = `${top - fontHeight}px`;
    //                 span.style.fontSize = `${fontHeight}px`;

    //                 pageDiv.appendChild(span);
    //             }

    //             container.appendChild(pageDiv);
    //         }
    //     };

    //     renderText();
    // }, [base64]);


    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const convertPDFToImages = async () => {
            try {
                const base64Clean = base64.split(',').pop()!;
                const binary = atob(base64Clean);
                const uint8Array = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    uint8Array[i] = binary.charCodeAt(i);
                }

                const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
                const urls: string[] = [];

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) continue;

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: ctx, viewport }).promise;

                    const imgUrl = canvas.toDataURL('image/png');
                    urls.push(imgUrl);

                    // Clean up
                    canvas.width = 0;
                    canvas.height = 0;
                }

                setImageUrls(urls);
                setLoading(false);
            } catch (err) {
                console.error('Error rendering PDF:', err);
                setLoading(false);
            }
        };

        if (base64) {
            setLoading(true);
            convertPDFToImages();
        }
    }, [base64, scale]);


    const loadImage = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });

    const createHighQualityPDF = async (imageUrls: string[]) => {
        const firstImg = await loadImage(imageUrls[0]);
        const { width: imgWidth, height: imgHeight } = firstImg;

        // Use jsPDF in 'px' units, match page size to image size
        const pdf = new jsPDF({
            orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
            unit: 'pt',
            format: [imgWidth, imgHeight],
            compress: false,
            precision: 100
        });

        for (let i = 0; i < imageUrls.length; i++) {
            if (i > 0) pdf.addPage([imgWidth, imgHeight]);

            const imgData = imageUrls[i];
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        }

        return pdf;
    };

    const handleDownload = async () => {
        const pdf = await createHighQualityPDF(imageUrls);
        pdf.save('converted.pdf');
    };

    return (
        <div>
            {/* <div
                ref={containerRef}
                style={{
                    fontFamily: 'sans-serif',
                    lineHeight: 1,
                    color: '#000',
                }}
            /> */}

            <button onClick={handleDownload} disabled={imageUrls.length === 0}>
                Download as PDF
            </button>

            {imageUrls.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`PDF page ${i + 1}`}
                    style={{
                        maxWidth: '100%',
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                />
            ))}
        </div>
    )
}

export default PdfTextRenderer;