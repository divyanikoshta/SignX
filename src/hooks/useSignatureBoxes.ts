import { useState, useRef, useCallback } from 'react';
import { SignatureBox } from '../types';

export const useSignatureBoxes = () => {
    const [boxes, setBoxes] = useState<SignatureBox[]>([]);
    const [isAddingBox, setIsAddingBox] = useState(false);
    const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

    const dragItemIndex = useRef<number | null>(null);
    const offset = useRef({ x: 0, y: 0 });
    const isMoving = useRef(false);

    const generateBoxId = useCallback(() => {
        return `box_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const addBox = useCallback((x: number, y: number, pageNumber: number) => {
        const newBox: SignatureBox = {
            id: generateBoxId(),
            x,
            y,
            pageNumber,
            sign: '',
            width: 200,
            height: 100
        };

        setBoxes(prevBoxes => [...prevBoxes, newBox]);
        setIsAddingBox(false);
        document.body.style.cursor = 'default';
    }, [generateBoxId]);

    const startAddingBox = useCallback(() => {
        setIsAddingBox(true);
        document.body.style.cursor = 'crosshair';
    }, []);

    const updateSignature = useCallback((boxId: string, signatureDataUrl: string) => {
        setBoxes(prevBoxes =>
            prevBoxes.map(box =>
                box.id === boxId
                    ? { ...box, sign: signatureDataUrl }
                    : box
            )
        );
        setSelectedBoxId(null);
    }, []);

    const deleteBox = useCallback((boxId: string) => {
        setBoxes(prevBoxes => prevBoxes.filter(box => box.id !== boxId));
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (dragItemIndex.current === null) return;
        isMoving.current = true;

        const containerElement = document.getElementById('pdf-container');
        if (!containerElement) return;

        const containerRect = containerElement.getBoundingClientRect();

        // Find current page based on mouse position
        const pageContainers = Array.from(containerElement.querySelectorAll('[data-page-number]'));
        let targetPage: { element: Element; number: number; rect: DOMRect } | null = null;

        // Find which page the mouse is currently over
        for (const container of pageContainers) {
            const rect = container.getBoundingClientRect();
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                targetPage = {
                    element: container,
                    number: parseInt(container.getAttribute('data-page-number') || '1'),
                    rect
                };
                break;
            }
        }

        // If mouse is not over any page, don't update the position
        if (!targetPage) return;

        // Get the box being dragged
        const boxIndex = dragItemIndex.current;
        const currentBox = boxes[boxIndex];
        if (!currentBox) return;

        // Calculate position relative to container
        let newX = e.clientX - containerRect.left;
        let newY = e.clientY - containerRect.top;

        // Constrain the box within container bounds
        const maxX = containerRect.width - currentBox.width;
        const maxY = containerRect.height - currentBox.height;

        // Clamp values to keep box within container
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        // Update box position and page number
        setBoxes(prevBoxes => {
            const newBoxes = [...prevBoxes];
            if (boxIndex >= 0 && boxIndex < newBoxes.length) {
                newBoxes[boxIndex] = {
                    ...newBoxes[boxIndex],
                    x: newX,
                    y: newY,
                    pageNumber: targetPage?.number || 1
                };
            }
            return newBoxes;
        });
    }, [boxes]);

    const handleBoxMouseDown = useCallback((e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        dragItemIndex.current = index;
        isMoving.current = false;

        const box = boxes[index];
        const containerElement = document.getElementById('pdf-container');
        if (!containerElement) return;

        const containerRect = containerElement.getBoundingClientRect();
        
        // Calculate the initial offset from mouse to box position using screen coordinates
        offset.current = {
            x: e.clientX - box.x,
            y: e.clientY - box.y
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [boxes, handleMouseMove]);

    const handleMouseUp = useCallback(() => {
        const wasDragging = isMoving.current;
        dragItemIndex.current = null;
        isMoving.current = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        return wasDragging;
    }, [handleMouseMove]);

    const handleBoxClick = useCallback((e: React.MouseEvent, boxId: string) => {
        if (isMoving.current) return;

        e.stopPropagation();
        setSelectedBoxId(boxId);
    }, []);

    return {
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
    };
};