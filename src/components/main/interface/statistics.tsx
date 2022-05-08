import { Controller, Label, Labels } from "../..";
import type { DrawerOption } from '../../../types'

interface StatisticsProps {
    fps_ups: string
    drawerOption: DrawerOption
    planetQuota: number
}

export function Statistics(props: StatisticsProps) {
    return (
        <Controller right={20} top={20} minWidth={200}>
            <Labels>
                <Label name={'현재 행성 수'} value={props.planetQuota}/>
                { props.drawerOption.isShowFPS_UPS && <Label name={'FPS / UPS'} value={props.fps_ups}/> }
            </Labels>
        </Controller>
    )
}