import { useState, useEffect, useContext } from "react";
import { Controller, CheckBox, Inputs, NumberField, Divver, InputButton } from "../..";
import { ToastContext } from "../../../context/toast";

import type { DrawerOption, UpdateDrawerOption } from '../../../types'

interface SettingProps {
    drawerOption: DrawerOption
    worker: any
    updateDrawerOption: (newOption: UpdateDrawerOption) => void
}

export function Setting(props: SettingProps) {
    const toast = useContext(ToastContext)

    const [ showOption, setShowOption ] = useState(false)
    const [ showDebugOption, setShowDebugOption ] = useState(false)

    const [ speedRate, setSpeedRate ] = useState(500)
    const [ spaceG, setSpaceG ] = useState(100)
    

    return (
        <Controller right={230} top={20} minWidth={120}>
            <Inputs>
                <CheckBox label="설정" value={showOption} onClick={() => {setShowOption(!showOption)}} />
                

                { showOption && <>
                    <CheckBox label="디버그 설정 표시" value={showDebugOption} onClick={() => {setShowDebugOption(!showDebugOption)}} />
                    <Divver />
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
                </> }

                { showOption && showDebugOption && <>
                    <Divver />
                    <CheckBox
                        label="FPS / UPS 표시" 
                        value={props.drawerOption.isShowFPS_UPS} 
                        onClick={() => {props.updateDrawerOption({'isShowFPS_UPS': !props.drawerOption.isShowFPS_UPS})}} 
                    />
                    <CheckBox label="FPS 그래프 표시" value={props.drawerOption.DEBUS_isShowFPS} onClick={() => {props.updateDrawerOption({'DEBUS_isShowFPS': !props.drawerOption.DEBUS_isShowFPS})}} />
                    <CheckBox label="디버그 행성 정보" value={props.drawerOption.DEBUG_isShowPlanetInfo} onClick={() => {props.updateDrawerOption({'DEBUG_isShowPlanetInfo': !props.drawerOption.DEBUG_isShowPlanetInfo})}} />
                    <NumberField 
                        label="SpaceG" 
                        value={spaceG} 
                        onChange={value => setSpaceG(value)} 
                        min={0} 
                        max={10000} 
                        step={1} 
                    />
                    <NumberField 
                        label="SpeedRate" 
                        value={speedRate} 
                        onChange={value => setSpeedRate(value)} 
                        min={0} 
                        max={10000} 
                        step={1} 
                    />
                    <InputButton 
                        label="Squawk"
                        onClick={() => {props.worker.postMessage({kind:'SquawkYourParrot'}); toast('개발자 도구를 확인하세요.')}}
                    />
                </> }
            </Inputs>
        </Controller>
    )
}