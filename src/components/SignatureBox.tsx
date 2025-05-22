import React, { memo } from 'react';
import { SignatureBox as SignatureBoxType } from '../types';

interface SignatureBoxProps {
  box: SignatureBoxType;
  index: number;
  onBoxClick: (e: React.MouseEvent, boxId: string) => void;
  onMouseDown: (e: React.MouseEvent, index: number) => void;
  onDelete: (boxId: string) => void;
}

const SignatureBox: React.FC<SignatureBoxProps> = memo(({
  box,
  index,
  onBoxClick,
  onMouseDown,
  onDelete
}) => {
  return (
    <div
      id={box.id}
      data-page-number={box.pageNumber}
      style={{
        position: 'absolute',
        border: '2px dotted grey',
        height: box.height,
        width: box.width,
        left: `${box.x}px`,
        top: `${box.y}px`,
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto'
      }}
      onClick={(e) => onBoxClick(e, box.id)}
      onMouseDown={(e) => onMouseDown(e, index)}
    >
      <button
        style={{
          position: 'absolute',
          top: '-25px',
          right: '-2px',
          color: 'black',
          border: 'none',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          fontSize: '12px',
          cursor: 'pointer',
          background: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(box.id);
        }}
        title="Delete"
      >
        ×
      </button>
      {box.sign && (
        <img 
          src={box.sign} 
          alt="Signature" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '80%',
            pointerEvents: 'none'
          }} 
        />
      )}
    </div>
  );
});

export default SignatureBox;