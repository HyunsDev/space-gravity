import { useCallback, useContext, useState } from "react";
import { Controller, CheckBox, Inputs, NumberField, Divver, InputButton } from "../..";
import { SettingContext } from "../../../context/setting";
import { WorkerContext } from "../../../context/worker";
import { NewPlanet } from "../../../types";

function sleep(ms:number){
    return new Promise(resolve=>setTimeout(resolve,ms));
 }

interface RandomGeneratorProps {
    addNewPlanet: Function
}

function getRandomArbitrary(min:number, max:number) {
    return Math.random() * (max - min) + min;
}

// 함수 명칭이 좀 괴상하긴 합니다. 혹시 더 좋은 이름 있으시다면 PR부탁드립니다..ㅠㅠ
function getRandomArbitrary2(min:number, max:number, dontGenerateRadius:number) {
    while (true) {
        const x = Math.random() * (max - min) + min;
        const y = Math.random() * (max - min) + min;
        if (Math.abs(x) > dontGenerateRadius || Math.abs(y) > dontGenerateRadius) return {x, y}
    }
}

export function RandomGenerator(props: RandomGeneratorProps) {
    const setting = useContext(SettingContext)
    const worker = useContext(WorkerContext)

    const [ showOption, setShowOption ] = useState(false)
    const [ amount, setAmount ] = useState(100)
    const [ speed, setSpeed ] = useState(50)
    const [ mass, setMass ] = useState(8)
    const [ radius, setRadius ] = useState(8)
    const [ generateRadius, setGenerateRadius ] = useState(1024)
    const [ dontGenerateRadius, setDontGenerateRadius ] = useState(0)

    const pause = useCallback(() => {
        setting.updateSetting('isPlay', false)
        worker.requestWorker('pause')
    }, [setting, worker])

    const randomGenerate = useCallback(async () => {
        pause()
        await sleep(500)
        for (let i = 0; i < amount; i++) {
            const xy = getRandomArbitrary2(-generateRadius, generateRadius, dontGenerateRadius)
            const x = Math.round(xy.x)
            const y = Math.round(xy.y)

            const newPlanet:NewPlanet = {
                mass,
                radius,
                isFixed: false,
                x,
                y,
                vx: Math.round(getRandomArbitrary(-speed, speed)),
                vy: Math.round(getRandomArbitrary(-speed, speed)),
                trajectory: [{x, y}]
            }
            props.addNewPlanet(newPlanet)
        }
    }, [amount, dontGenerateRadius, generateRadius, mass, pause, props, radius, speed])

    return (
        <Controller left={20} bottom={180} minWidth={120}>
            <Inputs>                
                { showOption && <>
                    <InputButton 
                        label="생성" 
                        onClick={randomGenerate} 
                    />
                    <Divver />
                    <NumberField 
                        label="생성 범위" 
                        value={generateRadius} 
                        onChange={(value) => setGenerateRadius(value)} 
                        min={10} 
                        max={3000} 
                        step={1} 
                    />
                    <NumberField 
                        label="수량" 
                        value={amount} 
                        onChange={(value) => setAmount(value)} 
                        min={0} 
                        max={2000} 
                        step={1} 
                    />
                    <NumberField 
                        label="행성 질량" 
                        value={mass} 
                        onChange={(value) => setMass(value)} 
                        min={4} 
                        max={400} 
                        step={4} 
                    />
                    <NumberField 
                        label="행성 반지름" 
                        value={radius} 
                        onChange={(value) => setRadius(value)} 
                        min={4} 
                        max={400} 
                        step={4}
                    />
                    <NumberField 
                        label="행성 속도" 
                        value={speed} 
                        onChange={(value) => setSpeed(value)} 
                        min={0} 
                        max={1000} 
                        step={1} 
                    />
                    <NumberField 
                        label="최소 생성 범위" 
                        value={dontGenerateRadius} 
                        onChange={(value) => setDontGenerateRadius(value)} 
                        min={0} 
                        max={3000} 
                        step={1} 
                    />
                    <Divver />
                </> }
                <CheckBox label="랜덤 생성 옴션 표시" value={showOption} onClick={() => {setShowOption(!showOption)}} />
            </Inputs>
        </Controller>
    )
}