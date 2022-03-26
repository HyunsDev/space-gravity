import { useCallback, useEffect, useRef } from "react"
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
    planets: {[key: string]: Planet};
}

const CanvasTag = styled.canvas`
    cursor: crosshair;
`

export function PlanetCanvas(props: CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestAnimationRef = useRef<any>(null);

    // 원 그리기
    const drawPlanet = useCallback((planet: Planet, context:CanvasRenderingContext2D ) => {
        context.beginPath()

        context.arc(planet.x, planet.y, planet.radius, 0, 2*Math.PI) 
        context.fillStyle = '#061B33'
        context.fill()
    
        context.strokeStyle = "#1C99F9";
        context.lineWidth = 1;
        context.stroke()
    }, [])

    // 선 그리기
    const drawLine = (planet: Planet, context:CanvasRenderingContext2D ) => {
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
    };

    // 렌더링 함수
    const render = useCallback(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.beginPath()
        context.clearRect(0, 0, canvas.width, canvas.height);

        Object.values(props.planets).forEach(e => {
            drawPlanet(e, context)
            drawLine(e, context)
        })

        requestAnimationRef.current = requestAnimationFrame(render);
    }, [drawPlanet, props.planets])

    // 렌더링
    useEffect(() => {
        requestAnimationRef.current = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(requestAnimationRef.current);
        };
    })

    return (
        <CanvasTag ref={canvasRef} width={window.innerWidth} height={window.innerHeight}>
        </CanvasTag>
    )
}