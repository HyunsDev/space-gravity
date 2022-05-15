import { useState, useContext } from "react";
import { Controller, CheckBox, Inputs, NumberField, Divver, InputButton } from "../..";
import { SettingContext } from "../../../context/setting";
import { ToastContext } from "../../../context/toast";
import { WorkerContext } from "../../../context/worker";

interface SettingProps {

}

export function Setting(props: SettingProps) {
    const toast = useContext(ToastContext)
    const worker = useContext(WorkerContext)
    const setting = useContext(SettingContext)

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
                        value={setting.setting.drawerIsShowPlanetVector}
                        onClick={() =>  setting.updateSetting('drawerIsShowPlanetVector', !setting.setting.drawerIsShowPlanetVector)} 
                    />
                    <CheckBox 
                        label="행성 정보" 
                        value={setting.setting.drawerIsShowPlanetInfo} 
                        onClick={() => setting.updateSetting('drawerIsShowPlanetInfo', !setting.setting.drawerIsShowPlanetInfo)} 
                    />
                    <Divver />
                    <CheckBox 
                        label="그리드" 
                        value={setting.setting.drawerIsShowGrid} 
                        onClick={() => setting.updateSetting('drawerIsShowGrid', !setting.setting.drawerIsShowGrid)} 
                    />
                    { setting.setting.drawerIsShowGrid && <>
                        <NumberField 
                            label="그리드 간격" 
                            value={setting.setting.drawerGridStep} 
                            onChange={(value) => setting.updateSetting('drawerGridStep', value)} 
                            min={10} 
                            max={1000} 
                            step={10} 
                        />
                        <NumberField 
                            label="그리드 밝기" 
                            value={setting.setting.drawerGridBrightness} 
                            onChange={(value) => setting.updateSetting('drawerGridBrightness', value)} 
                            min={0} 
                            max={100} 
                            step={1} 
                        />
                    </> }
                    <Divver />
                    <CheckBox 
                        label="궤적" 
                        value={setting.setting.drawerIsShowTrajectory} 
                        onClick={() => setting.updateSetting('drawerIsShowTrajectory', !setting.setting.drawerIsShowTrajectory)} 
                    />
                    { setting.setting.drawerIsShowTrajectory && <>
                        <NumberField 
                            label="궤적 힙 길이" 
                            value={setting.setting.drawerTrajectoryLength} 
                            onChange={(value) => {setting.updateSetting('drawerTrajectoryLength', value); worker.requestWorker('updateTrajectoryLength', value)}} 
                            min={1} 
                            max={1000} 
                            step={1} 
                        />
                        <NumberField 
                            label="궤적 캡쳐 간격" 
                            value={setting.setting.drawerTrajectoryStep} 
                            onChange={(value) => {setting.updateSetting('drawerTrajectoryStep', value); worker.requestWorker('updateTrajectoryStep', value)}} 
                            min={1} 
                            max={1000} 
                            step={1} 
                        />
                        <NumberField 
                            label="궤적 밝기 스텝" 
                            value={setting.setting.drawerTrajectoryBrightnessStep} 
                            onChange={(value) => {setting.updateSetting('drawerTrajectoryBrightnessStep', value);}} 
                            min={0} 
                            max={0.1} 
                            step={0.00001} 
                        />
                        <NumberField 
                            label="궤적 굵기" 
                            value={setting.setting.drawerTrajectoryWidth} 
                            onChange={(value) => {setting.updateSetting('drawerTrajectoryWidth', value);}} 
                            min={0} 
                            max={100} 
                            step={1} 
                        />
                    </> }


                    <Divver />
                    <NumberField 
                        label="중력상수" 
                        value={spaceG} 
                        onChange={value => {setSpaceG(value); worker.requestWorker('updateSpaceG', value)}} 
                        min={1} 
                        max={10000} 
                        step={1} 
                    />
                </> }

                { showOption && showDebugOption && <>
                    <Divver />
                    <CheckBox
                        label="FPS / UPS 표시" 
                        value={setting.setting.drawerIsShowFPS_UPS} 
                        onClick={() => setting.updateSetting('drawerIsShowFPS_UPS', !setting.setting.drawerIsShowFPS_UPS)} 
                    />
                    <CheckBox label="FPS 그래프 표시" value={setting.setting.DEBUG_drawerIsShowFPS} onClick={() => setting.updateSetting('DEBUG_drawerIsShowFPS', !setting.setting.DEBUG_drawerIsShowFPS)} />
                    <CheckBox label="디버그 행성 정보" value={setting.setting.DEBUG_drawerIsShowPlanetInfo} onClick={() => setting.updateSetting('DEBUG_drawerIsShowPlanetInfo', !setting.setting.DEBUG_drawerIsShowPlanetInfo)} />
                    <NumberField 
                        label="SpeedRate" 
                        value={speedRate} 
                        onChange={value => {setSpeedRate(value); worker.requestWorker('updateSpeedRate', value)}} 
                        min={0} 
                        max={1000} 
                        step={1} 
                    />
                    
                    <InputButton 
                        label="Squawk"
                        onClick={() => {worker.requestWorker('SquawkYourParrot'); toast('개발자 도구를 확인하세요.')}}
                    />
                </> }
            </Inputs>
        </Controller>
    )
}