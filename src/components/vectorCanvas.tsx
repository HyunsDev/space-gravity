import { useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface Planet {
    weight: number;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color?: string;
}

interface CanvasProps {
    weight: number;
    radius: number;
    setCursorMode: Function;
    setMouseVector: Function;
    setNewPlanet: Function;
}

interface MousePos {
    x: number;
    y: number;
}

const CanvasTag = styled.canvas`
    cursor: crosshair;
    position: absolute;
    left: 0;
    top: 0;
`

export function VectorCanvas(props: CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestAnimationRef = useRef<any>(null);
    const [ firstMousePosition, setFirstMousePosition ] = useState<MousePos | undefined>(undefined)
    const [ mousePosition, setMousePosition ] = useState<MousePos | undefined>(undefined)
    const [ isPainting, setIsPainting ] = useState(false);

    const getMousePos = (event: MouseEvent): MousePos | undefined => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        return {
          x: event.pageX - canvas.offsetLeft,
          y: event.pageY - canvas.offsetTop
        };
    };

    // 선 그리기
    const drawLine = (originalMousePosition: MousePos, newMousePosition: MousePos) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            context.strokeStyle = "red";  // 선 색깔
            context.lineJoin = 'round';	// 선 끄트머리(?)
            context.lineWidth = 1;		// 선 굵기

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();

            context.stroke();
        }
    };

    // 원 그리기
    const drawCircle = useCallback((mousePos: MousePos) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return
        
        context.beginPath()
        context.arc(mousePos.x, mousePos.y, props.radius, 0, 2*Math.PI) 

        context.fillStyle = '#1C1311'
        context.fill()
    
        context.strokeStyle = "#f9951c";
        context.lineWidth = 1;
        context.stroke()

    }, [props.radius])

    // 선 시작
    const startPaint = useCallback((event: MouseEvent) => {
        props.setCursorMode('create-vector')
        props.setMouseVector({x: 0, y:0})
        const mousePos = getMousePos(event);
        if (!mousePos) return
        setIsPainting(true);
        setMousePosition(mousePos);
        setFirstMousePosition(mousePos)
    }, [props]);

    const paint = useCallback(
        (event: MouseEvent) => {
            event.preventDefault();
            if (isPainting) {
                const newMousePosition = getMousePos(event);
                if (firstMousePosition && newMousePosition) {
                    props.setMouseVector({x: newMousePosition.x-firstMousePosition.x, y:newMousePosition.y-firstMousePosition.y})
                    setMousePosition(newMousePosition)
                }
            }
        },
        [firstMousePosition, isPainting, props]
    );
    
    const exitPaint = useCallback(() => {
        props.setCursorMode('create')
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        if (isPainting) {
            if (!mousePosition || !firstMousePosition) return
            const planet = {
                x: firstMousePosition.x,
                y: firstMousePosition.y,
                vx: mousePosition.x-firstMousePosition.x,
                vy: mousePosition.y-firstMousePosition.y,
                weight: props.weight,
                radius: props.radius
            }
            props.setNewPlanet(planet)
            setIsPainting(false);
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [firstMousePosition, isPainting, mousePosition, props]);

    // 렌더링 함수
    const render = useCallback(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        if (isPainting && firstMousePosition && mousePosition) {
            context.beginPath()
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawCircle(firstMousePosition)
            drawLine(firstMousePosition, mousePosition);
        }

        requestAnimationRef.current = requestAnimationFrame(render);
    }, [drawCircle, firstMousePosition, isPainting, mousePosition])

    // 렌더링
    useEffect(() => {
        requestAnimationRef.current = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(requestAnimationRef.current);
        };
    })

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
        <CanvasTag ref={canvasRef} width={window.innerWidth} height={window.innerHeight}>
        </CanvasTag>
    )
}