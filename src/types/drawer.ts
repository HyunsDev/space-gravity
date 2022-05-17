interface DrawerOption {
    isShowPlanetVector: boolean
    isShowPlanetInfo: boolean
    isShowGrid: boolean
    gridBrightness: number
    gridStep: number
    isShowFPS_UPS: boolean
    DEBUG_isShowPlanetInfo: boolean
    DEBUS_isShowFPS: boolean
}

interface UpdateDrawerOption {
    isShowPlanetVector?: boolean
    isShowPlanetInfo?: boolean
    isShowGrid?: boolean
    gridBrightness?: number
    gridStep?: number
    isShowFPS_UPS?: boolean
    DEBUG_isShowPlanetInfo?: boolean
    DEBUS_isShowFPS?: boolean
}

export type { DrawerOption, UpdateDrawerOption }
