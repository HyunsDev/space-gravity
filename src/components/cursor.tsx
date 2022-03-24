import { useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface MousePos {
    x: number;
    y: number;
}

interface CursorProps {
    weight: number;
}

const CursorDiv = styled.div`
    position: fixed;
    pointer-events: none;
`

const CursorBorder = styled.div<CursorProps>`
    width: ${props => props.weight}px;
    height: ${props => props.weight}px;
    box-sizing: border-box;
    border-radius: 999999px;
    border: solid 1px #ffffff;
`

export function Cursor(props: CursorProps) {
    const ref = useRef<HTMLDivElement>(null)
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
        const mousePos = getMousePos(e);
        if (!mousePos) return
        ref.current.style.top = `${mousePos.y}px`
        ref.current.style.left = `${mousePos.x}px`
    }, [])

    // 벡터 그리기 시작
    const startVector = useCallback((e:MouseEvent) => {
        setMouseDown(true)
    }, [])

    // 벡터 그리기 끝
    const endVector = useCallback((e: MouseEvent) => {
        setMouseDown(false)
        mouseMoveEvent(e)
    }, [mouseMoveEvent])

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
            {isMouseDown ? <></> : <CursorBorder {...props} />}
        </CursorDiv>
        
    )
}

Cursor.defaultProps = {
    weight: 32
}