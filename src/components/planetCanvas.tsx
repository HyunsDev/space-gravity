import { useCallback, useEffect, useRef } from "react"
import styled from "styled-components"
import type { Planet, DrawerOption } from '../types'

interface CanvasProps {
    planets: {[key: string]: Planet};
    fps: any
    drawerOption: DrawerOption
    screenPosition: {x: number, y: number}
    screenZoom: number
}

const CanvasTag = styled.canvas`
    cursor: crosshair;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
`

let frameRateCount = 0
let frameRateStartTime = new Date()

export function PlanetCanvas(props: CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestAnimationRef = useRef<any>(null);

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

    const getX = useCallback((x:number) => {
        return (window.innerWidth / 2 + (props.screenPosition.x + x)*props.screenZoom)
    }, [props.screenPosition.x, props.screenZoom])

    const getY = useCallback((y:number) => {
        return (window.innerHeight / 2 + (props.screenPosition.y + y)*props.screenZoom)
    }, [props.screenPosition.y, props.screenZoom])

    // 원 그리기
    const drawPlanet = useCallback((planet: Planet, id:string, context:CanvasRenderingContext2D ) => {
        context.beginPath()

        context.arc(planet.x, planet.y, planet.radius * props.screenZoom, 0, 2*Math.PI) 
        context.fillStyle = planet.isFixed ? '#341014' : '#082340'
        context.fill()
    
        context.strokeStyle = planet.isFixed ? '#f93d1c' : '#1C99F9'
        context.lineWidth = 1;
        context.stroke()

        if (props.drawerOption.isShowPlanetInfo) {
            context.font = '12px sans-serif';
            context.fillStyle = "#b7b4c5";
            context.textAlign = 'center'
            context.fillText(`질량 ${planet.mass} 반지름 ${planet.radius}`, planet.x, planet.y + planet.radius + 25);
            context.fillText(`위치 (${Math.round(planet.x)}, ${Math.round(planet.y)})`, planet.x, planet.y + planet.radius + 40);
            context.fillText(`속도 (${Math.round(planet.vx)}, ${Math.round(planet.vy)})`, planet.x, planet.y + planet.radius + 55);
        }

        if (props.drawerOption.DEBUG_isShowPlanetInfo) {
            context.font = '12px sans-serif';
            context.fillStyle = "#b7b4c5";
            context.textAlign = 'center'
            context.fillText(id, planet.x, planet.y + planet.radius + 70);
        }
    }, [props.drawerOption.DEBUG_isShowPlanetInfo, props.drawerOption.isShowPlanetInfo, props.screenZoom])

    // 선 그리기
    const drawLine = useCallback((planet: Planet, context:CanvasRenderingContext2D ) => {
          // 선 색깔
        context.lineJoin = 'round';	// 선 끄트머리(?)
        context.lineWidth = 1;		// 선 굵기

        context.beginPath();
        context.strokeStyle = "green";
        context.moveTo(planet.x, planet.y);
        context.lineTo(planet.x + planet.vx, planet.y + planet.vy);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(planet.x, planet.y);
        context.lineTo(planet.x + planet.vx, planet.y);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.strokeStyle = "#24b5ee";
        context.moveTo(planet.x, planet.y);
        context.lineTo(planet.x, planet.y + planet.vy);
        context.closePath();
        context.stroke();
    }, []);

    // 렌더링 함수
    const render = useCallback(() => {
        if (frameRateCount === 0) frameRateStartTime = new Date()

        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.beginPath()
        context.clearRect(0, 0, canvas.width, canvas.height);

        Object.keys(props.planets).forEach(e => {
            const _planet = props.planets[e]
            const planet = {
                ..._planet,
                x: getX(_planet.x),
                y: getY(_planet.y),
                vx: _planet.vx * props.screenZoom,
                vy: _planet.vy * props.screenZoom,
            }
            drawPlanet(planet, e, context)
            if (props.drawerOption.isShowPlanetVector) drawLine(planet, context)
        })
        requestAnimationRef.current = requestAnimationFrame(render);

        frameRateCount++

        if (frameRateCount === 60) {
            frameRateCount = 0
            props.fps.current = Math.round(60 / (new Date().getTime() - frameRateStartTime.getTime()) * 1000)
        }

    }, [props.planets, props.screenZoom, props.drawerOption.isShowPlanetVector, props.fps, getX, getY, drawPlanet, drawLine])

    // 렌더링
    useEffect(() => {
        requestAnimationRef.current = requestAnimationFrame(render); 
        return () => {
            cancelAnimationFrame(requestAnimationRef.current);
        };
    }, [render])

    return (
        <CanvasTag ref={canvasRef}>
        </CanvasTag>
    )
}