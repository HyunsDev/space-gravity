import styled from "styled-components"
import { IconContext, DotsSixVertical } from "phosphor-react";
import { useEffect, useState } from "react";


interface ControllerProps {
    x: number | string;
    y: number | string;
    children: React.ReactNode | string;
}

interface ControllerPos {
    x: number | string;
    y: number | string;
}

const ControllerDiv = styled.div<ControllerPos>`
    position: fixed;
    left: ${props => typeof props.x === 'number' ? `${props.x}px` : props.x};
    top: ${props => typeof props.y=== 'number' ? `${props.y}px` : props.y};
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0px 8px;
    border-radius: 4px;
    background-color: #2C303E;
    width: fit-content;
    box-sizing: border-box;
    gap: 8px;
`

const SixDots = styled(DotsSixVertical)`
    cursor: pointer;
`

const dragStartHandler = (e: any, setX:((x: number) => void), setY:(y: number) => void) => {
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);

    setX(e.clientX);
    setY(e.clientY);
}

const dragHandler = (e: any, setX:((x: number) => void), setY:(y: number) => void) => {
    setX(e.clientX);
    setY(e.clientY);
}

export function Controller(props: ControllerProps) {
    const [ x, setX ] = useState(props.x);
    const [ y, setY ] = useState(props.y);

    useEffect(() => {

    }, [])

    return (
        <IconContext.Provider
            value={{
                color: '#CCD2E2',
                size: 20,
                weight: "bold"
            }}    
        >
            <ControllerDiv x={x} y={y} draggable onDragStart={e => dragStartHandler(e, setX, setY)} onDrag={e => dragHandler(e, setX, setY)} >
                <SixDots color="#939DBB"/>
                {props.children}
            </ControllerDiv>
        </IconContext.Provider>
    )
}