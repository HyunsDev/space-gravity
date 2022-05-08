import { useState } from "react";
import { Controller, CheckBox, Inputs, NumberField, Divver } from "../..";

import type { DrawerOption, UpdateDrawerOption } from '../../../types'

interface SettingProps {
    drawerOption: DrawerOption
    updateDrawerOption: (newOption: UpdateDrawerOption) => void
}

export function Setting(props: SettingProps) {
    const [ showOption, setShowOption ] = useState(false)
    const [ showDebugOption, setShowDebugOption ] = useState(false)

    return (
        <Controller right={20} bottom={20} minWidth={240}>
            <Inputs>
                { showOption && showDebugOption && <>
                    <CheckBox
                        label="FPS / UPS 표시" 
                        value={props.drawerOption.isShowFPS_UPS} 
                        onClick={() => {props.updateDrawerOption({'isShowFPS_UPS': !props.drawerOption.isShowFPS_UPS})}} 
                    />
                    <CheckBox label="FPS 그래프 표시" value={props.drawerOption.DEBUS_isShowFPS} onClick={() => {props.updateDrawerOption({'DEBUS_isShowFPS': !props.drawerOption.DEBUS_isShowFPS})}} />
                    <CheckBox label="디버그 행성 정보" value={props.drawerOption.DEBUG_isShowPlanetInfo} onClick={() => {props.updateDrawerOption({'DEBUG_isShowPlanetInfo': !props.drawerOption.DEBUG_isShowPlanetInfo})}} />
                    <Divver />
                </> }

                { showOption && <>
                    <CheckBox 
                        label="행성 속도"
                        value={props.drawerOption.isShowPlanetVector} 
                        onClick={() => {props.updateDrawerOption({'isShowPlanetVector': !props.drawerOption.isShowPlanetVector})}} 
                    />
                    <CheckBox 
                        label="행성 정보" 
                        value={props.drawerOption.isShowPlanetInfo} 
                        onClick={() => {props.updateDrawerOption({'isShowPlanetInfo': !props.drawerOption.isShowPlanetInfo})}} 
                    />
                    <Divver />
                    <CheckBox 
                        label="그리드" 
                        value={props.drawerOption.isShowGrid} 
                        onClick={() => {props.updateDrawerOption({'isShowGrid': !props.drawerOption.isShowGrid})}} 
                    />
                    { props.drawerOption.isShowGrid && <>
                        <NumberField 
                            label="그리드 간격" 
                            value={props.drawerOption.gridStep} 
                            onChange={(value) => props.updateDrawerOption({'gridStep': value})} 
                            min={10} 
                            max={1000} 
                            step={10} 
                        />
                        <NumberField 
                            label="그리드 밝기" 
                            value={props.drawerOption.gridBrightness} 
                            onChange={(value) => props.updateDrawerOption({'gridBrightness': value})} 
                            min={0} 
                            max={100} 
                            step={1} 
                        />
                    </> }
                    <Divver />
                    <CheckBox label="디버그 설정 표시" value={showDebugOption} onClick={() => {setShowDebugOption(!showDebugOption)}} />
                </> }
                <CheckBox label="설정" value={showOption} onClick={() => {setShowOption(!showOption)}} />
            </Inputs>
        </Controller>
    )
}