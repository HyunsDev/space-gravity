import type {} from './cursorMode'

type CursorMode = 'create' | 'create-vector' | 'move' | 'select'

interface Setting {
    PLANET_MIN_WEIGHT: Number,
    PLANET_MIN_RADIUS: Number,
    WHEEL_STEP: Number,

    newPlanetColor: String,
    newPlanetIsFixed: Boolean,
    newPlanetRadius: Number,
    newPlanetMass: Number,

    drawerIsShowPlanet_Vector: Boolean,
    drawerIsShowPlanetInfo: Boolean,
    drawerIsShowGrid: Boolean,
    drawerGridBrightness: Number,
    drawerGridStep: Number,
    drawerIsShowFPS_UPS: Boolean,
    drawerScreenPosition: {x: Number, y: Number},
    drawerScreenZoom: Number,

    isPlay: Boolean,
    simulatorSpeed: Number,
    cursorMode: CursorMode,

    DEBUG_drawerIsShowPlanetInfo: Boolean,
    DEBUS_drawerIsShowFPS: Boolean,
}

export type { Setting } 