import { useState, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { SignatureBox } from '../types';

export const usePdfModifier = (fileAsBase64: string, scale: number, boxes: SignatureBox[]) => {
  const [modifiedPdf, setModifiedPdf] = useState<string | null>(null);
  
  const modifyPdf = useCallback(async () => {
    if (!fileAsBase64 || boxes.length === 0) {
      setModifiedPdf(null);
      return;
    }

    try {
      const pdfBytes = Uint8Array.from(atob(fileAsBase64), c => c.charCodeAt(0));
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      // Get all page containers
      const pageContainers = document.querySelectorAll('[data-page-number]');
      const pageRects = Array.from(pageContainers).map(container => ({
        pageNumber: parseInt(container.getAttribute('data-page-number') || '1'),
        rect: (container as HTMLElement).getBoundingClientRect()
      }));

      for (const box of boxes) {
        if (!box.sign) continue;
        
        // Process image data
        const imageBase64 = box.sign.replace("data:image/png;base64,", "");
        const imageBytes = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
        const pngImage = await pdfDoc.embedPng(imageBytes);
        
        // Find element in DOM to get its position
        const boxElement = document.getElementById(box.id);
        if (!boxElement) continue;
        
        const boxRect = boxElement.getBoundingClientRect();
        
        // Find the page container that contains this signature box
        const pageInfo = pageRects.find(page => 
          boxRect.top >= page.rect.top &&
          boxRect.top <= page.rect.bottom
        );
        
        if (!pageInfo) continue;
        
        const pageIndex = pageInfo.pageNumber - 1;
        if (pageIndex < 0 || pageIndex >= pages.length) continue;
        
        const page = pages[pageIndex];
        const pageHeight = page.getHeight();
        
        // Calculate position relative to the specific page container
        const relativeX = boxRect.left - pageInfo.rect.left;
        const relativeY = boxRect.top - pageInfo.rect.top;
        
        // Convert to PDF coordinates
        const pdfX = (relativeX / scale);
        const pdfY = pageHeight - (relativeY / scale) - (box.height / scale);
        
        // Convert dimensions to PDF units
        const pdfWidth = box.width / scale;
        const pdfHeight = box.height / scale;
        
        page.drawImage(pngImage, {
          x: pdfX,
          y: pdfY,
          width: pdfWidth,
          height: pdfHeight,
        });
      }

      const modifiedPdfBytes = await pdfDoc.save();
      let str = '';
      for (let i = 0; i < modifiedPdfBytes.length; i++) {
        str += String.fromCharCode(modifiedPdfBytes[i]);
      }

      const modifiedBase64 = btoa(str);
      setModifiedPdf(`data:application/pdf;base64,${modifiedBase64}`);
    } catch (error) {
      console.error('Error modifying PDF:', error);
      setModifiedPdf(null);
    }
  }, [fileAsBase64, scale, boxes]);

  useEffect(() => {
    if (boxes.some(box => box.sign)) {
      modifyPdf();
    }
  }, [boxes, modifyPdf]);

  const downloadPdf = useCallback((filename = 'signed_document.pdf') => {
    if (!modifiedPdf) return;
    
    try {
      const base64String = modifiedPdf.replace(/^data:application\/pdf;base64,/, '');
      const byteCharacters = atob(base64String); 
      const byteArray = new Uint8Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); 
      link.download = filename;  
      link.click();
      
      // Clean up
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  }, [modifiedPdf]);

  return {
    modifiedPdf,
    downloadPdf
  };
};