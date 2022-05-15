import { useCallback, useContext, useEffect, useRef } from "react"
import styled from "styled-components"
import { SettingContext } from "../context/setting"

interface CanvasProps {
    
}

const CanvasTag = styled.canvas`
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
`

export function GridCanvas(props: CanvasProps){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const setting = useContext(SettingContext)

    // 선 그리기
    const drawLine = useCallback((x0: number, y0: number, x1: number, y1: number, level: 'center' | 'bold' | 'thin',  context:CanvasRenderingContext2D ) => {
          // 선 색깔
        context.lineJoin = 'round';	// 선 끄트머리(?)
        context.lineWidth = 1;		// 선 굵기

        context.beginPath();
        if (level === 'center') context.strokeStyle = `rgba(172, 103, 19, ${(setting.setting.drawerGridBrightness) / 100})`;
        else if (level === 'thin') context.strokeStyle = `rgba(59, 69, 109, ${setting.setting.drawerGridBrightness / 100})`;
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.closePath();
        context.stroke();
    }, [setting.setting.drawerGridBrightness]);

    const resize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth
            canvasRef.current.height = window.innerHeight
        }
    }

    // 렌더링 함수
    const render = useCallback(() => {
        resize()

        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.beginPath()
        context.clearRect(0, 0, canvas.width, canvas.height);

        const screenX0 = canvas.width / 2 + (setting.setting.drawerScreenPosition.x) * setting.setting.drawerScreenZoom
        const screenY0 = canvas.height / 2 + (setting.setting.drawerScreenPosition.y) * setting.setting.drawerScreenZoom

        // 축
        drawLine(screenX0, 0, screenX0, canvas.height, 'center', context)
        drawLine(0, screenY0, canvas.width, screenY0, 'center', context)

        let rx = screenX0
        while (true) { // 세로줄 오른쪽
            rx += setting.setting.drawerGridStep * setting.setting.drawerScreenZoom
            drawLine(rx, 0, rx, canvas.height, 'thin', context)
            if (rx >= canvas.width) break
        }

        let lx = screenX0
        while (true) { // 세로줄 왼쪽
            lx -= setting.setting.drawerGridStep * setting.setting.drawerScreenZoom
            drawLine(lx, 0, lx, canvas.height, 'thin', context)
            if (lx <= 0) break
        }

        let ty = screenY0
        while (true) { // 가로줄 위쪽
            ty -= setting.setting.drawerGridStep * setting.setting.drawerScreenZoom
            drawLine(0, ty, canvas.width, ty, 'thin', context)
            if (ty <= 0) break
        }

        let by = screenY0
        while (true) { // 세로줄 아래쪽
            by += setting.setting.drawerGridStep * setting.setting.drawerScreenZoom
            drawLine(0, by, canvas.width, by, 'thin', context)
            if (by >= canvas.height) break
        }
    }, [setting.setting.drawerScreenPosition.x, setting.setting.drawerScreenPosition.y, setting.setting.drawerScreenZoom, setting.setting.drawerGridStep, drawLine])
    useEffect(() => {
        render()
        window.addEventListener('resize', render)
        return () => window.removeEventListener('resize', render)
    }, [render])

    return (
        <CanvasTag ref={canvasRef}>
        </CanvasTag>
    )
}