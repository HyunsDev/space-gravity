import styled from "styled-components";

const ToolTipBox = styled.div`
    visibility: hidden;
    background-color: #2C303E;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 4px 8px;
    position: absolute;
    z-index: 10;
    transition: 400ms;
    transition-delay: 600ms;
    opacity: 0;
    font-size: 12px;
    left: 50%;
    transform: translate(-50%, 0%);
    white-space: nowrap; 
    pointer-events: none;

    &::after {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 5px;
        pointer-events: none;
    }
`

const ToolTipBoxTop = styled(ToolTipBox)`
    bottom: 150%;

    &::after {
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-color: #2C303E transparent transparent transparent;
    }
`

const ToolTipBoxBottom = styled(ToolTipBox)`
    top: 150%;

    &::after {
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-color: transparent transparent #2C303E transparent;
    }
`

const ToolTipDiv = styled.div`
    width: fit-content;
    height: fit-content;
    position: relative;

    &:hover {
        ${ToolTipBox} {
            visibility: visible;
            opacity: 1;
        }
    }
`

interface ToolTipProps {
    children: React.ReactNode;
    text: string;
    direction?: 'top' | 'bottom'
}

export function ToolTip(props: ToolTipProps) {
    return (
        <ToolTipDiv>
            {props.direction === 'bottom'
                ? <ToolTipBoxBottom>{props.text}</ToolTipBoxBottom>
                : <ToolTipBoxTop>{props.text}</ToolTipBoxTop>}
            {props.children}
        </ToolTipDiv>
    )
}