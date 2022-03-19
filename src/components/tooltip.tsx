import styled from "styled-components";

const ToolTipBox = styled.div`
    visibility: hidden;
    background-color: #2C303E;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 4px 8px;
    position: absolute;
    z-index: 1;
    transition: 400ms;
    transition-delay: 600ms;
    opacity: 0;
    font-size: 12px;
    left: 50%;
    transform: translate(-50%, 0%);

    &::after {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 5px;
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
    direction?: 'top' | 'right' | 'bottom' | 'left'
}

export function ToolTip(props: ToolTipProps) {
    if (props.direction === 'right') {

    }

    return (
        <ToolTipDiv>
            <ToolTipBoxTop>{props.text}</ToolTipBoxTop>
            {props.children}
        </ToolTipDiv>
    )
}