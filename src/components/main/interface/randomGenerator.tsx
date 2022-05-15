import { useCallback, useContext, useState } from "react";
import { Controller, CheckBox, Inputs, NumberField, Divver, InputButton } from "../..";
import { SettingContext } from "../../../context/setting";
import { WorkerContext } from "../../../context/worker";

function sleep(ms:number){
    return new Promise(resolve=>setTimeout(resolve,ms));
 }

interface RandomGeneratorProps {
    addNewPlanet: Function
}

function getRandomArbitrary(min:number, max:number) {
    return Math.random() * (max - min) + min;
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

    const pause = useCallback(() => {
        setting.updateSetting('isPlay', false)
        worker.requestWorker('pause')
    }, [setting, worker])

    const randomGenerate = useCallback(async () => {
        pause()
        await sleep(500)
        for (let i = 0; i < amount; i++) {
            const newPlanet = {
                mass,
                radius,
                isFixed: false,
                x: Math.round(getRandomArbitrary(-generateRadius, generateRadius)),
                y: Math.round(getRandomArbitrary(-generateRadius, generateRadius)),
                vx: Math.round(getRandomArbitrary(-speed, speed)),
                vy: Math.round(getRandomArbitrary(-speed, speed)),
            }
            props.addNewPlanet(newPlanet)
        }
    }, [amount, generateRadius, mass, pause, props, radius, speed])

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
                    <Divver />
                </> }
                <CheckBox label="랜덤 생성 옴션 표시" value={showOption} onClick={() => {setShowOption(!showOption)}} />
            </Inputs>
        </Controller>
    )
}