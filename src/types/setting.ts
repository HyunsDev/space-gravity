import type {} from './cursorMode'

type CursorMode = 'create' | 'create-vector' | 'move' | 'select'

interface Setting {
    PLANET_MIN_WEIGHT: number,
    PLANET_MIN_RADIUS: number,
    WHEEL_STEP: number,

    newPlanetColor: String,
    newPlanetIsFixed: boolean,
    newPlanetRadius: number,
    newPlanetMass: number,

    drawerIsShowPlanetVector: boolean,
    drawerIsShowPlanetInfo: boolean,
    drawerIsShowGrid: boolean,
    drawerGridBrightness: number,
    drawerGridStep: number,
    drawerIsShowFPS_UPS: boolean,
    drawerScreenPosition: {x: number, y: number},
    drawerScreenZoom: number,

    drawerIsShowTrajectory: boolean;
    drawerTrajectoryStep: number;
    drawerTrajectoryLength: number;
    drawerTrajectoryBrightnessStep: number;
    drawerTrajectoryWidth: number;

    isPlay: boolean,
    simulatorSpeed: number,
    cursorMode: CursorMode,

    DEBUG_drawerIsShowPlanetInfo: boolean,
    DEBUG_drawerIsShowFPS: boolean,
}

export type { Setting } 
