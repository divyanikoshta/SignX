import { UploadCloud, ChevronDown } from 'lucide-react';
import Button from './ui/Button/Button';
import { useState } from 'react';

interface FileUploaderProps {
    fileInputRef: any;
    handleFileClick: any;
    handleFileChange: any
}

const FileUploader = ({ fileInputRef, handleFileClick, handleFileChange }: FileUploaderProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            console.log('Files dropped:', files);
            handleFileChange(files?.[0])
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };
    return (
        <div className="border-dashed border-2 border-gray-300 bg-gray-50 flex flex-col justify-center items-center  p-10 rounded-lg" style={{ width: "60%" }} onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}>
            <UploadCloud size={64} className="text-gray-400 mb-2" />
            <p className="text-lg text-gray-600 mb-4">Drop your files here or</p>
            <input ref={fileInputRef} name="file" type="file" multiple style={{ display: 'none' }} onChange={(e) => handleFileChange(e.target.files?.[0])}></input>
            <Button size="small" onClick={handleFileClick} variant="primary">Browse Files</Button>
        </div>
    )

}

export default FileUploader;