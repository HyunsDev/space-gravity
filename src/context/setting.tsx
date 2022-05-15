import React, { createContext, useCallback, useState } from "react";
import type { Setting } from '../types/'

// 설정 파일 불러오기
const initSetting: Setting = {
    PLANET_MIN_WEIGHT: 4,
    PLANET_MIN_RADIUS: 4,
    WHEEL_STEP: 0.25,

    drawerIsShowPlanetVector: true,
    drawerIsShowPlanetInfo: false,
    drawerIsShowGrid: true,
    drawerGridBrightness: 15,
    drawerGridStep: 20,
    drawerIsShowFPS_UPS: false,

    drawerScreenPosition: { x: 0, y: 0 },
    drawerScreenZoom: 1,

    isPlay: true,
    simulatorSpeed: 1,
    cursorMode: 'create',

    DEBUG_drawerIsShowPlanetInfo: false,
    DEBUS_drawerIsShowFPS: false,

    newPlanetColor: '',
    newPlanetIsFixed: false,
    newPlanetRadius: 8,
    newPlanetMass: 8
}

export const SettingContext = createContext({
    setting: initSetting,
    setSetting: (setting: Setting) => {},
    updateSetting: <T extends keyof Setting>(key: T, value: Setting[T]) => {}

})

const SettingProvider: React.FC<React.ReactNode> = ({children}) => {
    const [ setting, setSetting ] = useState<Setting>(initSetting)

    const updateSetting = useCallback(<T extends keyof Setting>(key: T, value: Setting[T]) => {
        const newSetting = {
            ...setting,
            [key]: value
        }
        setSetting(newSetting)
    }, [setting])

    return (
        <SettingContext.Provider
            value={{
                setting,
                setSetting,
                updateSetting
            }}
        >
            {children}
        </SettingContext.Provider>
    )
}

export default SettingProvider;