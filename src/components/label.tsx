import styled from "styled-components"

interface LabelsProps {
    children: React.ReactNode;
}

const LabelsDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    padding: 2px 0px;
`

export function Labels(props: LabelsProps) {
    return (
        <LabelsDiv>
            { props.children }
        </LabelsDiv>
    )
}

interface LabelProps {
    name: string;
    value: string | number;
    icon?: React.ReactNode;
}

const ButtonDivver = styled.div`
    border-radius: 4px;
    transition: 200ms;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 8px;
    width: 100%;
    font-size: 14px;
`

const ButtonDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export function Label(props: LabelProps) {
    return (
        <ButtonDivver>
            <ButtonDiv>{props.icon} {props.name}</ButtonDiv>
            <ButtonDiv>{props.value}</ButtonDiv>
        </ButtonDivver>
    )
}
