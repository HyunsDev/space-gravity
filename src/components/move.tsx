import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"

interface CanvasProps {
    setScreenPosition: Function
    screenPosition: {x: number, y: number}
    screenZoom: number
}

interface MousePos {
    x: number;
    y: number;
}

const MoveDiv = styled.div<{isMoving: boolean}>`
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    cursor: ${props => props.isMoving ? 'grabbing' : 'grab'};
`

export function Move(props: CanvasProps){
    const [ firstScreenPosition, setFirstScreenPosition ] = useState(props.screenPosition)
    const [ firstMousePosition, setFirstMousePosition ] = useState<MousePos | undefined>(undefined)
    const [ isMoving, setIsMoving ] = useState(false);

    const getMousePos = useCallback((e: MouseEvent): MousePos | undefined => {
        return {
          x: e.pageX,
          y: e.pageY,
        };
    }, []);

    // 이동 시작
    const startMove = useCallback((event: MouseEvent) => {
        setFirstScreenPosition(props.screenPosition)
        const mousePos = getMousePos(event);
        if (!mousePos) return
        setIsMoving(true);
        setFirstMousePosition(mousePos)
    }, [getMousePos, props.screenPosition]);

    // 이동
    const move = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const newMousePosition = getMousePos(event);
        if (!isMoving) return
        if (!newMousePosition) return
        if (!firstMousePosition) return
        
        const newScreenPosition = {
            x: firstScreenPosition.x + (newMousePosition.x - firstMousePosition.x) / props.screenZoom,
            y: firstScreenPosition.y + (newMousePosition.y - firstMousePosition.y) / props.screenZoom
        }
        props.setScreenPosition(newScreenPosition)

    },[firstMousePosition, firstScreenPosition.x, firstScreenPosition.y, getMousePos, isMoving, props]);

    // 이동 끝
    const endMove = useCallback(() => {
        if (!isMoving) return
        setIsMoving(false);
    }, [isMoving]);

    useEffect(() => {
        document.addEventListener('mousedown', startMove);
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', endMove);
        document.addEventListener('mouseleave', endMove);

        return () => {
            document.removeEventListener('mousedown', startMove);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', endMove);
            document.removeEventListener('mouseleave', endMove);
        }
    }, [endMove, move, startMove])

    return (
        <MoveDiv isMoving={isMoving} />
    )
}