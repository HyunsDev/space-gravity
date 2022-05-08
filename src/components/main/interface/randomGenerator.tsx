import { useState } from "react";
import { Controller, CheckBox, Inputs, NumberField, Divver } from "../..";

import type { DrawerOption, UpdateDrawerOption } from '../../../types'

interface RandomGeneratorProps {
    drawerOption: DrawerOption
    updateDrawerOption: (newOption: UpdateDrawerOption) => void
}

export function RandomGenerator(props: RandomGeneratorProps) {
    const [ showOption, setShowOption ] = useState(false)
    const [ amount, setAmount ] = useState(100)
    const [ weight, setWeight ] = useState(8)
    const [ radius, setRadius ] = useState(8)
    const [ generateRadius, setGenerateRadius ] = useState(128)

    return (
        <Controller right={230} top={20} minWidth={120}>
            <Inputs>
                <CheckBox label="랜덤 생성 옴션" value={showOption} onClick={() => {setShowOption(!showOption)}} />
                
                { showOption && <>
                    <Divver />
                    <NumberField 
                            label="수량" 
                            value={amount} 
                            onChange={(value) => setAmount(amount)} 
                            min={10} 
                            max={2000} 
                            step={10} 
                        />
                    <CheckBox 
                        label="행성 질량"
                        value={props.drawerOption.isShowPlanetVector} 
                        onClick={() => {props.updateDrawerOption({'isShowPlanetVector': !props.drawerOption.isShowPlanetVector})}} 
                    />
                    <CheckBox 
                        label="행성 정보" 
                        value={props.drawerOption.isShowPlanetInfo} 
                        onClick={() => {props.updateDrawerOption({'isShowPlanetInfo': !props.drawerOption.isShowPlanetInfo})}} 
                    />
                    <Divver />
                </> }
            </Inputs>
        </Controller>
    )
}