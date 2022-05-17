import { useCallback, useContext, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { SettingContext } from "../context/setting";

interface MousePos {
    x: number;
    y: number;
}

interface CursorProps {
    label?: string[];
}

const CursorDiv = styled.div`
    position: fixed;
    pointer-events: none;
`

interface CursorBorderType {
    radius: number
    screenZoom: number
    isFixed: boolean
}

const CursorBorder = styled.div<CursorBorderType>`
    width: ${props => props.radius*2*props.screenZoom}px;
    height: ${props => props.radius*2*props.screenZoom}px;
    box-sizing: border-box;
    border-radius: 99999px;
    border: solid 1px ${props => props.isFixed ? '#d45e5e' : '#ffffff' };
`

const Divver = styled.div`
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translate(-50%, 0);
`

const Label = styled.div`
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translate(-50%, 0);
    color: #CCD2E2;
    white-space: nowrap;
    user-select: none;
    font-size: 14px;
    text-align: center;
`

export function Cursor(props: CursorProps) {
    const setting = useContext(SettingContext)

    const ref = useRef<HTMLDivElement>(null)
    const lastMousePos = useRef<any>()
    const [ isMouseDown, setMouseDown ] = useState(false)

    // 마우스 위치
    const getMousePos = (event: MouseEvent): MousePos | undefined => {
        if (!ref.current) return;
        const div: HTMLDivElement = ref.current;
        return {
            x: event.pageX - div.offsetWidth/2 ,
            y: event.pageY - div.offsetHeight/2
        };
    };

    // 커서 위치 이동
    const mouseMoveEvent = useCallback((e: MouseEvent) => {
        if (!ref.current) return
        lastMousePos.current = e
        const mousePos = getMousePos(e);
        if (!mousePos) return
        ref.current.style.top = `${mousePos.y}px`
        ref.current.style.left = `${mousePos.x}px`
    }, [])

    // 사이즈 변경
    useEffect(() => {
        if (!ref.current) return
        if (!lastMousePos.current) return
        const mousePos = getMousePos(lastMousePos.current);
        if (!mousePos) return
        ref.current.style.top = `${mousePos.y}px`
        ref.current.style.left = `${mousePos.x}px`
    }, [setting.setting.drawerScreenZoom, setting.setting.newPlanetRadius, setting.setting.newPlanetMass])

    // 벡터 그리기 시작
    const startVector = useCallback(() => {
        setMouseDown(true)
    }, [])

    // 벡터 그리기 끝
    const endVector = useCallback(() => {
        setMouseDown(false)
    }, [])

    
    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveEvent)
        document.addEventListener('mousedown', startVector)
        document.addEventListener('mouseup', endVector)
        return () => { 
            document.removeEventListener('mousemove', mouseMoveEvent)
            document.removeEventListener('mousedown', startVector)
            document.removeEventListener('mouseup', endVector)
        }
    }, [endVector, mouseMoveEvent, startVector])

    return (
        <CursorDiv ref={ref}>
            {isMouseDown ? <></> : <CursorBorder
                isFixed={setting.setting.newPlanetIsFixed}
                radius={setting.setting.newPlanetRadius}
                screenZoom={setting.setting.drawerScreenZoom}
                />}
            { 
                props.label && <Divver><Label>{props.label.map((e,i) => <p key={i}>{e}</p>)}</Label></Divver>
            }
        </CursorDiv>
    )
}

Cursor.defaultProps = {
    mass: 32
}
