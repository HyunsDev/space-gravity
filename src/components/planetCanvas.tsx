import { useCallback, useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { PlanetsContext } from "../context/planets"
import { SettingContext } from "../context/setting"
import type { NewPlanet, DrawerOption } from '../types'

interface CanvasProps {
    setFps: any;
}

const CanvasTag = styled.canvas`
    cursor: crosshair;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 0;
    z-index: -1;
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
    }, [setting.setting.drawerScreenPosition.x, setting.setting.drawerScreenZoom])

    const getY = useCallback((y:number) => {
        return (window.innerHeight / 2 + (setting.setting.drawerScreenPosition.y + y)*setting.setting.drawerScreenZoom)
    }, [setting.setting.drawerScreenPosition.y, setting.setting.drawerScreenZoom])

    // 선 그리기
    const drawLine = useCallback((x1:number, y1:number, x2:number, y2:number, color: string, context:CanvasRenderingContext2D ) => {
      context.lineJoin = 'round';
      context.lineWidth = 1;
      context.beginPath();
      context.strokeStyle = color;
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.closePath();
      context.stroke();
  }, []);

    // 행성 그리기
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

    // 속도 벡터 그리기
    const drawVelocity = useCallback((planet: NewPlanet, context:CanvasRenderingContext2D ) => {
        drawLine(planet.x, planet.y, planet.x + planet.vx, planet.y + planet.vy, 'green', context)

        // context.beginPath();
        // context.strokeStyle = "red";
        // context.moveTo(planet.x, planet.y);
        // context.lineTo(planet.x + planet.vx, planet.y);
        // context.closePath();
        // context.stroke();

        // context.beginPath();
        // context.strokeStyle = "#24b5ee";
        // context.moveTo(planet.x, planet.y);
        // context.lineTo(planet.x, planet.y + planet.vy);
        // context.closePath();
        // context.stroke();
    }, [drawLine]);

    // 궤적 그리기
    const drawTrajectory = useCallback((planet: NewPlanet, context:CanvasRenderingContext2D) => {
        let i = {x: planet.x, y: planet.y}
        let ii = 0
        for (let trajectory of [...planet.trajectory].reverse()) {
            // context.lineJoin = 'round';
            context.lineWidth = setting.setting.drawerTrajectoryWidth === 0 ? planet.radius * 2 * setting.setting.drawerScreenZoom : setting.setting.drawerTrajectoryWidth;
            context.beginPath();
            context.strokeStyle = `rgba(28, 153, 249, ${0.5-ii})`;
            context.moveTo(getX(i.x), getY(i.y));
            context.lineTo(getX(trajectory.x), getY(trajectory.y));
            context.closePath();
            context.stroke();

            i = trajectory
            ii += setting.setting.drawerTrajectoryBrightnessStep
        }
    }, [getX, getY, setting.setting.drawerScreenZoom, setting.setting.drawerTrajectoryBrightnessStep, setting.setting.drawerTrajectoryWidth])

    // 렌더링 함수
    const render = useCallback(() => {
        if (frameRateCount === 0) frameRateStartTime = new Date()

        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.beginPath()
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (!planets) return
        Object.keys(planets).forEach(e => {
            const _planet = planets[e]
            if (setting.setting.drawerIsShowTrajectory) drawTrajectory(_planet, context)
            const planet = {
                ..._planet,
                x: getX(_planet.x),
                y: getY(_planet.y),
                vx: _planet.vx * setting.setting.drawerScreenZoom,
                vy: _planet.vy * setting.setting.drawerScreenZoom,
            }
            drawPlanet(planet, e, context)
            if (setting.setting.drawerIsShowPlanetVector) drawVelocity(planet, context)
        })
        requestAnimationRef.current = requestAnimationFrame(render);
        frameRateCount++
        if (frameRateCount === 60) {
            frameRateCount = 0
            props.setFps(Math.round(60 / (new Date().getTime() - frameRateStartTime.getTime()) * 1000))
        }
    }, [planets, setting.setting.drawerIsShowTrajectory, setting.setting.drawerScreenZoom, setting.setting.drawerIsShowPlanetVector, drawTrajectory, getX, getY, drawPlanet, drawVelocity, props])

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