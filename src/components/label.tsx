import styled from "styled-components"

interface LabelProps {
    name: string;
    value: string;
    icon?: React.ReactNode;
}

const ButtonDiv = styled.div`
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

const ButtonDiv2 = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export function Label(props: LabelProps) {
    return (
        <ButtonDiv>
            <ButtonDiv2>{props.icon} {props.name}</ButtonDiv2>
            <ButtonDiv2>{props.value}</ButtonDiv2>
        </ButtonDiv>
    )
}

interface LabelsProps {
    children: React.ReactNode;
}

const LabelsDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
`

export function Labels(props: LabelsProps) {
    return (
        <LabelsDiv>
            { props.children }
        </LabelsDiv>
    )
}