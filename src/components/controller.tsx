import styled from "styled-components"
import { IconContext, DotsSixVertical } from "phosphor-react";
import { useRef } from "react";


interface ControllerPos {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}
interface ControllerProps {
    children: React.ReactNode | string;
    minWidth?: number;
    top?: ControllerPos['top'];
    left?: ControllerPos['left']; 
    right?: ControllerPos['right'];
    bottom?: ControllerPos['bottom'];
}

interface ControllerMoveProps {
    originRef: any;
}

const ControllerDiv = styled.div<ControllerProps>`
    position: fixed;
    ${props => props.top && `top: ${props.top}px`};
    ${props => props.left && `left: ${props.left}px`};
    ${props => props.right && `right: ${props.right}px`};
    ${props => props.bottom && `bottom: ${props.bottom}px`};
    min-height: 32px;
    height: fit-content;
    ${props => props.minWidth && `min-width: ${props.minWidth}px`};
    display: flex;
    align-items: flex-start;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #1d202c99;
    width: fit-content;
    box-sizing: border-box;
    gap: 8px;
    color: #CCD2E2;
    user-select: none;
    z-index: 999;
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
    ref.current.style.right = 'fit-content';
    ref.current.style.bottom = `none`;
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

const ControllerMoveDiv = styled.div`
    display: flex;
    align-items: flex-start;
    margin-top: 2px;
`

const ControllerMove = (props: ControllerMoveProps) => {
    return (
        <ControllerMoveDiv 
            draggable
            onDragStart={e => dragStartHandler(e, props.originRef)}
            onDrag={e => dragHandler(e, props.originRef)} 
            onDragEnd={e => dragEndHandler(e, props.originRef)}
        >
            <SixDots color="#939DBB"/>
        </ControllerMoveDiv>
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