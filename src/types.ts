export interface SignatureBox {
  id: string;
  x: number;
  y: number;
  pageNumber: number;
  sign: string;
  width: number;
  height: number;
}

export interface PdfViewHelperProps {
  fileAsBase64: string;
  pdfConfig: { 
    scale: number;
    filename?: string;
  };
}