import { ToolTip } from "./tooltip";
import styled from "styled-components"

interface ControllerBtn {
    content: React.ReactNode;
    tooltip: string;
    onClick: () => any;
}

const ButtonDiv = styled.div`
    cursor: pointer;
    border-radius: 4px;
    transition: 200ms, transform 100ms;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    user-select: none;

    &:hover {
        background-color: #4A5060;
    }

    &:active {
        transform: translate(0px, 2px);
    }
`

export function Button (props: ControllerBtn) {
    return (
        <ToolTip text={props.tooltip}>
            <ButtonDiv onClick={props.onClick}>
                {props.content}
            </ButtonDiv>
        </ToolTip>
        
    )
}
