import { Controller, Button, Label, Labels, VectorCanvas, Cursor, PlanetCanvas } from "../components";
import { Play, Pause, Cursor as CursorIcon , CaretRight, CaretLeft, HandPointing, ArrowUpRight, Plus, Minus } from "phosphor-react";
import Logo from '../assets/lettering.png'
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import simulator from "../worker/simulator";
import { Webworker } from "../worker/WebWorker";

const LogoDiv = styled.div`
    position: fixed;
    top: 32px;
    left: 32px;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;

    img {
        height: 32px;
        user-select: none;
        -webkit-user-drag: none;
        pointer-events: none;
    }
`

interface Planet {
    size: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color?: string;
}

const Canvases = styled.div`
    position: relative;
    width: 100vw;
    min-height: 100vh;
`

export default function Main() {
    const [ newPlanet, setNewPlanet ] = useState<Planet>()
    const [ planets, setPlanets ] = useState<Planet[]>([])
    const [ isPlay, setPlay ] = useState(false)
    const [ speed, setSpeed ] = useState(1)
    const [ weight, setWeight ] = useState(32)
    const [ cursorMode, setCursorMode ] = useState<'create' | 'create-vector'>('create')
    const [ mouseVector, setMouseVector ] = useState({x: 0, y: 0})
    const _worker = useRef<any>(null)

    let cursorLabel
    switch (cursorMode) {
        case 'create':
            cursorLabel = `질량 ${weight}`
            break;
        case 'create-vector':
            cursorLabel = `벡터 (${mouseVector.x}, ${mouseVector.y})`
            break

        default:
            break;
    }

    useEffect(() => {
        _worker.current = Webworker(simulator)

        // 메세지 수신
        _worker.current.onmessage = (msg:any) => {
            switch (msg.data.kind) {
                case 'newPlanets':
                    setPlanets(msg.data.planets)
                    break;
            
                default:
                    
                    break;
            }
        }

        // return () => {
        //     _worker.current.onmessage = null
        // }
    }, [])

    // 새로운 행성 추가
    useEffect(() => {
        if (!_worker.current) return
        if (!newPlanet) return
        _worker.current.postMessage({kind: 'planetAdd', newPlanet})
        setNewPlanet(undefined)
    }, [newPlanet])

    // 속도 변경
    useEffect(() => {
        if (!_worker.current) return
        _worker.current.postMessage({kind: 'speedUpdate', speed})
    }, [newPlanet, speed])

    return (
        <>  
            <Canvases>
                <VectorCanvas
                    weight={weight}
                    setCursorMode={setCursorMode}
                    setMouseVector={setMouseVector}
                    setNewPlanet={setNewPlanet}
                ></VectorCanvas>

                <PlanetCanvas
                    planets={planets}
                ></PlanetCanvas>
            </Canvases>
            <Cursor
                cursorMode={cursorMode}
                weight={weight}
                label={cursorLabel}
            />

            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>
            <Controller right={20} top={20} minWidth={200}>
                <Labels>
                    <Label name='현재 행성 수' value={planets.length}/>
                </Labels>
            </Controller>

            <Controller left={20} bottom={100}>
                <Button content={<Minus />} tooltip='가볍게' onClick={() => weight-8 > 0 && setWeight(weight-8)} />
                <Button content={`${weight}`} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<Plus />} tooltip='무겁게' onClick={() => setWeight(weight+8)} />
            </Controller>

            <Controller left={20} bottom={60}>
                <Button content={isPlay ? <Pause /> : <Play />} tooltip='Play' onClick={() => setPlay(!isPlay)} />
                <Button content={<CaretLeft  />} tooltip='느리게' onClick={() => speed-1 > 0 && setSpeed(speed-1)} />
                <Button content={`${speed}x`} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='빠르게' onClick={() => setSpeed(speed+1)} />
            </Controller>

            <Controller left={20} bottom={20}>
                <Button content={<Plus />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<CursorIcon />} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<HandPointing />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<ArrowUpRight />} tooltip='Pause' onClick={() => console.log('play')} />
            </Controller>
        </>
    )
}