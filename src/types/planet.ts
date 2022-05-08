interface Planet {
    mass: number;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color?: string;
    isFixed: boolean;
}

interface NewPlanetOption {
    color: string;
    isFixed: boolean;
    mass: number;
    radius: number;
}

interface UpdateNewPlanetOption {
    color?: string;
    isFixed?: boolean;
    mass?: number;
    radius?: number;
}

export type { Planet, NewPlanetOption, UpdateNewPlanetOption}