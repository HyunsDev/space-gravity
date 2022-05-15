import { useContext } from "react";
import { Controller, Label, Labels } from "../..";
import { PlanetsContext } from "../../../context/planets";
import { SettingContext } from "../../../context/setting";

interface StatisticsProps {
    fps_ups: string
}

export function Statistics(props: StatisticsProps) {
    const setting = useContext(SettingContext)
    const planets = useContext(PlanetsContext)

    return (
        <Controller right={20} top={20} minWidth={200}>
            <Labels>
                <Label name={'현재 행성 수'} value={Object.keys(planets.planets).length}/>
                <Label name={'루프 수'} value={planets.loopId}/>
                { setting.setting.drawerIsShowFPS_UPS && <Label name={'FPS / UPS'} value={props.fps_ups}/> }
            </Labels>
        </Controller>
    )
}