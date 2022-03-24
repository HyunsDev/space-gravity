import { useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface CanvasProps {
    
}

interface MousePos {
    x: number;
    y: number;
}

const CanvasTag = styled.canvas`
`

export function Canvas(props: CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ mousePosition, setMousePosition ] = useState<MousePos | undefined>(undefined)
    const [isPainting, setIsPainting] = useState(false);

    const getMousePos = (event: MouseEvent): MousePos | undefined => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        return {
          x: event.pageX - canvas.offsetLeft,
          y: event.pageY - canvas.offsetTop
        };
      };

    const drawLine = (originalMousePosition: MousePos, newMousePosition: MousePos) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            context.strokeStyle = "red";  // 선 색깔
            context.lineJoin = 'round';	// 선 끄트머리(?)
            context.lineWidth = 5;		// 선 굵기

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();

            context.stroke();
        }
    };

    const startPaint = useCallback((event: MouseEvent) => {
        const coordinates = getMousePos(event);
        if (coordinates) {
          setIsPainting(true);
          setMousePosition(coordinates);
        }
    }, []);

    const paint = useCallback(
    (event: MouseEvent) => {
        event.preventDefault();   // drag 방지
        event.stopPropagation();  // drag 방지

        if (isPainting) {
        const newMousePosition = getMousePos(event);
        if (mousePosition && newMousePosition) {
            drawLine(mousePosition, newMousePosition);
            setMousePosition(newMousePosition);
        }
        }
    },
    [isPainting, mousePosition]
    );
    
    const exitPaint = useCallback(() => {
        setIsPainting(false);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        canvas.addEventListener('mousemove', paint);
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);

        return () => {
            canvas.removeEventListener('mousedown', startPaint);
            canvas.removeEventListener('mousemove', paint);
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
        }
    }, [exitPaint, paint, startPaint])

    return (
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth}>
            
        </canvas>
    )
}