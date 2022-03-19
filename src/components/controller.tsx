import styled from "styled-components"
import { IconContext, DotsSixVertical } from "phosphor-react";
import { useEffect, useRef, useState } from "react";


interface ControllerPos {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}
interface ControllerProps {
    children: React.ReactNode | string;
    top?: ControllerPos['top'];
    left?: ControllerPos['left'];
    right?: ControllerPos['right'];
    bottom?: ControllerPos['bottom'];
}

interface ControllerMoveProps {
    originRef: any;
}

const ControllerDiv = styled.div<ControllerPos>`
    position: fixed;
    ${props => props.top && `top: ${props.top}px`};
    ${props => props.left && `left: ${props.left}px`};
    ${props => props.right && `right: ${props.right}px`};
    ${props => props.bottom && `bottom: ${props.bottom}px`};
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0px 8px;
    border-radius: 4px;
    background-color: #2C303E;
    width: fit-content;
    box-sizing: border-box;
    gap: 8px;

    &:active {
        cursor: grabbing;
    }
`

const SixDots = styled(DotsSixVertical)`
    cursor: grab;
`

let posX = 0;
let posY = 0;
let originalX = 0;
let originalY = 0;

const dragStartHandler = (e: any, ref: any) => {
    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);

    posX = e.clientX;
    posY = e.clientY;
    originalX = ref.current.offsetLeft;
    originalY = ref.current.offsetTop;
}

const dragHandler = (e: any, ref: any) => {
    ref.current.style.left = `${ref.current.offsetLeft + e.clientX - posX}px`;
    ref.current.style.top = `${ref.current.offsetTop + e.clientY - posY}px`;
    posX = e.clientX;
    posY = e.clientY;
}

const dragEndHandler = (e: any, ref: any) => {
    if (
        0 < e.clientX &&
        e.clientX < window.innerWidth &&
        0 < e.clientY &&
        e.clientY < window.innerHeight
    ) {
        ref.current.style.left = `${ref.current.offsetLeft + e.clientX - posX}px`;
        ref.current.style.top = `${ref.current.offsetTop + e.clientY - posY}px`;
    } else {
        ref.current.style.left = `${originalX}px`;
        ref.current.style.top = `${originalY}px`;
    }
    
}

const ControllerMove = (props: ControllerMoveProps) => {
    return (
        <div 
            draggable
            onDragStart={e => dragStartHandler(e, props.originRef)}
            onDrag={e => dragHandler(e, props.originRef)} 
            onDragEnd={e => dragEndHandler(e, props.originRef)}
        >
            <SixDots color="#939DBB"/>
        </div>
    )
}

export function Controller(props: ControllerProps) {
    const ref = useRef<any>()

    return (
        <IconContext.Provider
            value={{
                color: '#CCD2E2',
                size: 20,
                weight: "bold"
            }}
        >
            <ControllerDiv
                {...props}
                ref={ref}
            >
                <ControllerMove originRef={ref} />
                {props.children}
            </ControllerDiv>
            
        </IconContext.Provider>
    )
}