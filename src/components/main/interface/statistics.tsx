import { Controller, Label, Labels } from "../..";

interface StatisticsProps {
    items: {
        [key: string]: string | number
    }
}

export function Statistics(props: StatisticsProps) {
    return (
        <Controller right={20} top={20} minWidth={200}>
            <Labels>
                {
                    Object.keys(props.items).map(e => <Label key={e} name={e} value={props.items[e]}/>)
                }
            </Labels>
        </Controller>
    )
}