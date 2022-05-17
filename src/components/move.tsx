import { useCallback, useEffect, useState, useRef, useContext } from "react"
import styled from "styled-components"
import { SettingContext } from "../context/setting";

interface CanvasProps {
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
    const setting = useContext(SettingContext)

    const MoveRef = useRef<HTMLDivElement | null>(null)
    const [ firstScreenPosition, setFirstScreenPosition ] = useState(setting.setting.drawerScreenPosition)
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
        setFirstScreenPosition(setting.setting.drawerScreenPosition)
        const mousePos = getMousePos(event);
        if (!mousePos) return
        setIsMoving(true);
        setFirstMousePosition(mousePos)
    }, [getMousePos, setting.setting.drawerScreenPosition]);

    // 이동
    const move = useCallback((event: MouseEvent) => {
        event.preventDefault();
        const newMousePosition = getMousePos(event);
        if (!isMoving) return
        if (!newMousePosition) return
        if (!firstMousePosition) return
        
        const newScreenPosition = {
            x: firstScreenPosition.x + (newMousePosition.x - firstMousePosition.x) / setting.setting.drawerScreenZoom,
            y: firstScreenPosition.y + (newMousePosition.y - firstMousePosition.y) / setting.setting.drawerScreenZoom
        }
        setting.updateSetting('drawerScreenPosition', newScreenPosition)

    }, [firstMousePosition, firstScreenPosition.x, firstScreenPosition.y, getMousePos, isMoving, setting]);

    // 이동 끝
    const endMove = useCallback(() => {
        if (!isMoving) return
        setIsMoving(false);
    }, [isMoving]);

    useEffect(() => {
        if (!MoveRef.current) return
        MoveRef.current.addEventListener('mousedown', startMove);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', endMove);
        window.addEventListener('mouseleave', endMove);

        return () => {
            if (!MoveRef.current) return
            MoveRef.current.removeEventListener('mousedown', startMove);
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseleave', endMove);
            window.removeEventListener('mouseup', endMove);
        }
    }, [endMove, move, startMove])

    return (
        <MoveDiv isMoving={isMoving} ref={MoveRef} />
    )
}
