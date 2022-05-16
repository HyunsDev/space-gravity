import { useEffect, useRef, useState } from "react";
import styled from "styled-components"

interface InputsProps {
    children: React.ReactNode;
}

const InputsDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2px;
    z-index: 999;
`

export function Inputs(props: InputsProps) {
    return (
        <InputsDiv>
            { props.children }
        </InputsDiv>
    )
}

const InputLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const Divver = styled.div`
    border-bottom: solid 1px rgba(255, 255, 255, 0.2);
    margin: 2px 0px; 
`

interface CheckBoxProps {
    label: string;
    value: boolean;
    onClick: Function;
}

const CheckBoxDivver = styled.div`
    border-radius: 4px;
    transition: 200ms;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 8px;
    width: 100%;
    font-size: 14px;
    padding: 2px 4px;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`

const CheckBoxDiv = styled.div`
    /* border: solid 1px #ffffff; */
    width: 8px;
    height: 8px;
    border-radius: 12px;
    background-color: ${(props: {value: boolean}) => props.value ? '#e2e0de' : 'rgba(226, 224, 222, 0.2)'};
    margin-right: 4px;
    transition: 50ms;
`

export function CheckBox(props: CheckBoxProps) {
    return (
        <CheckBoxDivver onClick={() => props.onClick()}>
            <InputLabel>{props.label}</InputLabel>
            <CheckBoxDiv value={props.value}/>
        </CheckBoxDivver>
    )
}


interface ButtonProps {
    label: string;
    onClick: Function;
}

const ButtonDivver = styled.div`
    border-radius: 4px;
    transition: 200ms;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 8px;
    width: 100%;
    font-size: 14px;
    padding: 2px 4px;
    cursor: pointer;
    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`

export function InputButton(props: ButtonProps) {
    return (
        <ButtonDivver onClick={() => props.onClick()}>
            <InputLabel>{props.label}</InputLabel>
        </ButtonDivver>
    )
}

interface NumberFieldProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (num: number) => void;
}

const NumberFieldDivver = styled.div`
    border-radius: 4px;
    transition: 200ms;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 24px;
    width: 100%;
    font-size: 14px;
    padding: 2px 4px;
    z-index: 999;
`

const NumberFieldInput = styled.input`
    width: 32px;
    border: 0;
    border-radius: 2px;
    color: #ffffff;
    background-color: rgba(226, 224, 222, 0);
    text-align: right;
    transition: 100ms;
    padding: 0px 4px;

    &:hover {
        background-color: rgba(226, 224, 222, 0.2);
    }

    &:focus {
        outline: 0;
        background-color: rgba(226, 224, 222, 0.3);
    }

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`

const NumberFieldInputs = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
`

const NumberFieldRangeDiv = styled.div`
    width: 72px;
    position: relative;
    display: flex;
    align-items: center;
    z-index: 999;

    & > div {
        transition: 200ms background-color;
    }

    &:hover > div {
        background-color: rgba(226, 224, 222, 0.2);
    }
`

const FakeNumberFieldRangeOuter = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 72px;
    height: 16px;
    background-color: rgba(226, 224, 222, 0.1);
    pointer-events: none;
`

const FakeNumberFieldRangeInner = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 16px;
    width: ${(props: {value: number, min: number, max: number}) => props.value / (props.max - props.min) * 72}px;
    background-color: rgba(226, 224, 222, 0.2);
    pointer-events: none;
`

const NumberFieldRange = styled.input`
    width: 72px;
    opacity: 0;
    height: 16px;
    cursor: ew-resize;
`

export function NumberField(props: NumberFieldProps) {
    const [value, setValue] = useState(props.value)
    const inputNumberRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    const numberValid = () => {
        if (props.min <= value && props.max >= value) {
            if (!Number.isInteger(value) || value % props.step === 0) {
                props.onChange(value)
            }
        } else {
            setValue(props.value)
        }
    }

    const numberKeydown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputNumberRef.current) inputNumberRef.current.blur()
    }

    return (
        <NumberFieldDivver>
            <InputLabel>{props.label}</InputLabel>
            <NumberFieldInputs>
                <NumberFieldRangeDiv>
                    <FakeNumberFieldRangeOuter />
                    <FakeNumberFieldRangeInner min={props.min} max={props.max} value={props.value} />
                    <NumberFieldRange 
                        type={'range'} 
                        min={props.min} 
                        max={props.max} 
                        step={props.step} 
                        value={props.value} 
                        onChange={e => props.onChange(Number(e.target.value))}
                    />
                </NumberFieldRangeDiv>
                <NumberFieldInput
                    type={'number'} 
                    ref={inputNumberRef}
                    min={props.min} 
                    max={props.max} 
                    step={props.step} 
                    value={value} 
                    onChange={e => setValue(Number(e.target.value))}
                    onBlur={() => numberValid()}
                    onKeyDown={e => numberKeydown(e)}
                />
            </NumberFieldInputs>
        </NumberFieldDivver>
    )
}




interface TextAreaProps {
    value: string;
    onChange: Function;
    placeholder?: string;
}


const TextAreaDivver = styled.div`
    border-radius: 4px;
    transition: 200ms;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: 24px;
    width: 100%;
    font-size: 14px;
    padding: 2px 4px;
    z-index: 999;
`

const TextAreaInput = styled.textarea`
    border: 0;
    border-radius: 2px;
    color: #ffffff;
    background-color: rgba(226, 224, 222, 0);
    transition: 100ms;
    padding: 0px 4px;

    &:hover {
        background-color: rgba(226, 224, 222, 0.1);
    }

    &:focus {
        outline: 0;
        background-color: rgba(226, 224, 222, 0.15);
    }

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`

export function TextArea(props: TextAreaProps) {
    return (
        <TextAreaDivver>
            <TextAreaInput value={props.value} onChange={(e) => props.onChange(e.target.value)} placeholder={props.placeholder} />
        </TextAreaDivver>
    )
}