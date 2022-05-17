import styled from "styled-components"

interface ToastProps {
    text: string,
    isShow: boolean,
    setShow: (isShow:boolean) => void,
}


const ToastDiv = styled.div<ToastProps>`
    display: flex;
    background-color: rgba(44,48,62, 0.4);
    /* backdrop-filter: blur(5px); */
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    transition: 200ms;
    bottom: ${props => props.isShow ? 20 : -60}px;
    color: #CCD2E2;
    width: fit-content;
    box-sizing: border-box;
    gap: 8px;
    padding: 4px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    z-index: 999;
    cursor: pointer;
    text-align: center;
    white-space: pre-wrap;
`


export function Toast(props: ToastProps) {
    return (
        <ToastDiv {...props} onClick={() => props.setShow(false)}>
            {props.text}
        </ToastDiv>
    )
}
