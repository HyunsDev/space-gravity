import { useCallback, useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { PlanetsContext } from "../context/planets"
import { SettingContext } from "../context/setting"
import type { NewPlanet, DrawerOption } from '../types'

interface CanvasProps {
    fps: any
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
    const setting = useContext(SettingContext)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestAnimationRef = useRef<any>(null);
    const planets = useContext(PlanetsContext).planets

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
        return (window.innerWidth / 2 + (setting.setting.drawerScreenPosition.x + x)*setting.setting.drawerScreenZoom)
    }, [setting.setting.drawerScreenZoom])

    const getY = useCallback((y:number) => {
        return (window.innerHeight / 2 + (setting.setting.drawerScreenPosition.y + y)*setting.setting.drawerScreenZoom)
    }, [setting.setting.drawerScreenZoom])

    // 원 그리기
    const drawPlanet = useCallback((planet: NewPlanet, id:string, context:CanvasRenderingContext2D ) => {
        context.beginPath()

        context.arc(planet.x, planet.y, planet.radius * setting.setting.drawerScreenZoom, 0, 2*Math.PI) 
        context.fillStyle = planet.isFixed ? '#341014' : '#082340'
        context.fill()
    
        context.strokeStyle = planet.isFixed ? '#f93d1c' : '#1C99F9'
        context.lineWidth = 1;
        context.stroke()

        

        if (setting.setting.drawerIsShowPlanetInfo) {
            context.font = '12px sans-serif';
            context.fillStyle = "#b7b4c5";
            context.textAlign = 'center'
            context.fillText(`질량 ${planet.mass} 반지름 ${planet.radius}`, planet.x, planet.y + planet.radius + 25);
            context.fillText(`위치 (${Math.round(planet.x)}, ${Math.round(planet.y)})`, planet.x, planet.y + planet.radius + 40);
            context.fillText(`속도 (${Math.round(planet.vx)}, ${Math.round(planet.vy)})`, planet.x, planet.y + planet.radius + 55);
        }

        if (setting.setting.DEBUG_drawerIsShowPlanetInfo) {
            context.font = '12px sans-serif';
            context.fillStyle = "#b7b4c5";
            context.textAlign = 'center'
            context.fillText(id, planet.x, planet.y + planet.radius + 70);
        }
    }, [setting.setting.DEBUG_drawerIsShowPlanetInfo, setting.setting.drawerIsShowPlanetInfo, setting.setting.drawerScreenZoom])

    // 선 그리기
    const drawLine = useCallback((planet: NewPlanet, context:CanvasRenderingContext2D ) => {
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

        Object.keys(planets).forEach(e => {
            const _planet = planets[e]
            const planet = {
                ..._planet,
                x: getX(_planet.x),
                y: getY(_planet.y),
                vx: _planet.vx * setting.setting.drawerScreenZoom,
                vy: _planet.vy * setting.setting.drawerScreenZoom,
            }
            drawPlanet(planet, e, context)
            if (setting.setting.drawerIsShowPlanetVector) drawLine(planet, context)
        })
        requestAnimationRef.current = requestAnimationFrame(render);
        frameRateCount++
        if (frameRateCount === 60) {
            frameRateCount = 0
            props.fps.current = Math.round(60 / (new Date().getTime() - frameRateStartTime.getTime()) * 1000)
        }
    }, [planets, getX, getY, setting.setting.drawerScreenZoom, setting.setting.drawerIsShowPlanetVector, drawPlanet, drawLine, props.fps])

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