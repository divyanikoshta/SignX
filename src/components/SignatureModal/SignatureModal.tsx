import React, { useRef, useState } from "react";
import classes from "./SignatureModal.module.css";
import ReactSignatureCanvas from "react-signature-canvas";
import Button from "../ui/Button/Button";

interface SignatureModalProp {
    onConfirm: (signatureDataUrl: string) => void;
    onClose: () => void;
    children?: React.ReactNode;
}

const SignatureModal = ({ children, onConfirm, onClose }: SignatureModalProp) => {
    const signRef = useRef<ReactSignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const clearSignature = () => {
        if (signRef.current) {
            signRef.current.clear();
            setIsEmpty(true);
        }
    };

    const handleBeginSign = () => {
        setIsEmpty(false);
    };

    const handleConfirm = () => {
        if (signRef.current && !isEmpty) {
            const signatureDataUrl = signRef.current.getTrimmedCanvas().toDataURL('image/png');
            onConfirm(signatureDataUrl);
        }
    };
    return (
        <div className={classes['overlay-container']}>
            <div className={classes['dialogBox']}>
                <div id="header" className={classes['header']}>
                    <div>
                        Signature
                    </div>
                    <button onClick={onClose}>
                        X
                    </button>
                </div>
                <div onClick={clearSignature} className={classes['subheader']}>Clear Signature</div>
                <div id="body" className={classes['body']}>
                    <ReactSignatureCanvas
                        ref={signRef}
                        penColor="black"
                        minWidth={1.6}
                        maxWidth={3.0}
                        canvasProps={{
                            className: classes.canvasSign,
                            width: 500,
                            height: 200
                        }}
                        onBegin={handleBeginSign}
                    />
                </div>
                <div id="footer" className="flex gap-2 justify-end p-4" >
                    <Button onClick={onClose} variant="tertiary">Cancel</Button>
                    <Button onClick={handleConfirm} variant="primary">Confirm</Button>
                </div>
            </div>
        </div>
    )
};

export default SignatureModal;