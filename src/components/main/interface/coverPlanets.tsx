import { useCallback, useContext, useEffect, useState } from "react";
import { Controller, CheckBox, Inputs, TextArea, InputButton, Divver } from "../..";
import { SettingContext } from "../../../context/setting";
import { ToastContext } from "../../../context/toast";
import { WorkerContext } from "../../../context/worker";

interface CoverPlanetsProps {

}

export function CoverPlanets(props: CoverPlanetsProps) {
    const worker = useContext(WorkerContext)
    const toast = useContext(ToastContext)

    const [ showOption, setShowOption ] = useState(false)
    const [ value, setValue ] = useState("")

    const copyData = (data:any) => {
        const planets:any = {}
        for (let planet in data.planets) {
            planets[planet] = data.planets[planet]
            planets[planet].trajectory = []
        }
        navigator.clipboard.writeText(JSON.stringify({
            ...data,
            planets
        }))
        toast('클립보드에 복사되었습니다.')
    }

    useEffect(() => {
        worker.addListener('extract', copyData)
    })

    const covering = () => {
        let json
        try {
            json = JSON.parse(value)
        } catch (err) {
            toast('올바르지 않은 문자열입니다.')
            return
        }
        
        console.log(json)
        if (!json.planets) {
            toast('올바르지 않은 문자열입니다.')
            return
        }

        worker.requestWorker('planetList', json.planets)
    }


    return (
        <Controller left={20} bottom={180} minWidth={120}>
            <Inputs>         
            { showOption && 
                <>  
                    <InputButton label="현재 시뮬레이션 내보내기" onClick={() => worker.requestWorker('extractReq')} />
                    <Divver />
                    <TextArea onChange={setValue} value={value} placeholder='문자열을 입력하세요' />
                    <InputButton label="시뮬레이션 불러오기" onClick={() => covering()} />
                    <Divver />
                </>
            }       
            <CheckBox label="불러오기 메뉴" value={showOption} onClick={() => {setShowOption(!showOption)}} />
            </Inputs>
        </Controller>
    )
}