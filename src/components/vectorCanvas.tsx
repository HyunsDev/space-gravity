import { useCallback, useEffect, useRef, useState, useContext } from "react"
import styled from "styled-components"
import { SettingContext } from "../context/setting";
import { ToastContext } from "../context/toast";

import type { NewPlanet } from '../types'

interface CanvasProps {
    setMouseVector: Function;
    addNewPlanet: (planet:NewPlanet) => void;
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
    z-index: ${(props: {isPainting: boolean}) => props.isPainting ? 9999 : 0};
`

let paintTimer: NodeJS.Timeout | null = null;

export function VectorCanvas(props: CanvasProps){
    const toast = useContext(ToastContext)
    const setting = useContext(SettingContext)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestAnimationRef = useRef<any>(null);
    const [ firstMousePosition, setFirstMousePosition ] = useState<MousePos | undefined>(undefined)
    const [ mousePosition, setMousePosition ] = useState<MousePos | undefined>(undefined)
    const [ isPainting, setIsPainting ] = useState(false);

    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width=window.innerWidth
                canvasRef.current.height=window.innerHeight
            }
        }

        resize()
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])

    const getMousePos = useCallback((event: MouseEvent): MousePos | undefined => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        return {
          x: event.pageX - canvas.offsetLeft,
          y: event.pageY - canvas.offsetTop
        };
    }, []);

    // 선 그리기
    const drawLine = useCallback((originalMousePosition: MousePos, newMousePosition: MousePos) => {
        if (!canvasRef.current) return;
        if (setting.setting.newPlanetIsFixed) return;
        
        

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
    }, [setting.setting.newPlanetIsFixed]);

    // 원 그리기
    const drawCircle = useCallback((mousePos: MousePos) => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return
        
        context.beginPath()
        context.arc(mousePos.x, mousePos.y, setting.setting.newPlanetRadius*setting.setting.drawerScreenZoom, 0, 2*Math.PI) 
        context.fillStyle = setting.setting.newPlanetIsFixed ? '#f93d1c33' : '#f9951c33'
        context.fill()
        context.strokeStyle = setting.setting.newPlanetIsFixed ? '#f93d1c' : "#f9951c";
        context.lineWidth = 1;
        context.stroke()
    }, [setting.setting.newPlanetIsFixed, setting.setting.newPlanetRadius, setting.setting.drawerScreenZoom])

    // 선 시작
    const startPaint = useCallback((event: MouseEvent) => {
        toast.on('행성 생성을 취소하려면 ESC를 누르세요')
        setting.updateSetting('cursorMode', 'create-vector')
        const mousePos = getMousePos(event);
        if (!mousePos) return
        setIsPainting(true);
        setMousePosition(mousePos);
        setFirstMousePosition(mousePos)
    }, [getMousePos, setting, toast]);

    const paint = useCallback((event: MouseEvent) => {
        event.preventDefault();
        if (!isPainting) return
        if (paintTimer) return
        paintTimer = setTimeout(() => {
            const newMousePosition = getMousePos(event);
            props.setMouseVector(newMousePosition)

            if (firstMousePosition && newMousePosition) {
                setMousePosition(newMousePosition)
            }
            paintTimer = null
        }, 16)
    },[firstMousePosition, getMousePos, isPainting, props]);

    const cancelPaint = useCallback(() => {
        setting.updateSetting('cursorMode', 'create')
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        if (isPainting) {
            if (!mousePosition || !firstMousePosition) return
            toast.off()
            setIsPainting(false);
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [firstMousePosition, isPainting, mousePosition, setting, toast])
    
    useEffect(() => {
        const cancel = (e:KeyboardEvent) => {
            if (e.code === 'Escape') cancelPaint()
        }
        document.addEventListener('keydown', cancel)
        return () => {
            document.removeEventListener('keydown', cancel)
        }
    }, [cancelPaint])
    
    const exitPaint = useCallback(() => {
        setting.updateSetting('cursorMode', 'create')

        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        if (isPainting) {
            if (!mousePosition || !firstMousePosition) return
            toast.off()
            const x = (firstMousePosition.x - (window.innerWidth / 2 + setting.setting.drawerScreenPosition.x)) / setting.setting.drawerScreenZoom
            const y = (firstMousePosition.y - (window.innerHeight / 2 + setting.setting.drawerScreenPosition.y)) / setting.setting.drawerScreenZoom
            const xy = {x, y}

            const planet:NewPlanet = {
                x,
                y,
                vx: setting.setting.newPlanetIsFixed ? 0 : (mousePosition.x-firstMousePosition.x) / setting.setting.drawerScreenZoom,
                vy: setting.setting.newPlanetIsFixed ? 0 : (mousePosition.y-firstMousePosition.y) / setting.setting.drawerScreenZoom,
                mass: setting.setting.newPlanetMass,
                radius: setting.setting.newPlanetRadius,
                isFixed: setting.setting.newPlanetIsFixed,
                trajectory: [xy],
            }
            props.addNewPlanet(planet)
            setIsPainting(false);
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [firstMousePosition, isPainting, mousePosition, props, setting, toast]);

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
    }, [drawCircle, drawLine, firstMousePosition, isPainting, mousePosition])

    // 렌더링
    useEffect(() => {
        requestAnimationRef.current = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(requestAnimationRef.current);
        };
    }, [render])

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
        <CanvasTag isPainting={isPainting} ref={canvasRef} />
    )
}