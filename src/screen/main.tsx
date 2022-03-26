import { Controller, Button, Label, Labels, VectorCanvas, Cursor, PlanetCanvas } from "../components";
import { 
    Play,
    Pause,
    Cursor as CursorIcon,
    CaretRight,
    CaretLeft,
    HandPointing,
    ArrowUpRight,
    Plus,
    Minus,
    ArrowsOut,
    ArrowsIn,
    ArrowClockwise
} from "phosphor-react";
import Logo from '../assets/lettering.png'
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import simulator from "../worker/simulator";
import { Webworker } from "../worker/WebWorker";
import { v4 as uuidv4 } from 'uuid';

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
    weight: number;
    radius: number;
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
    const [ planets, setPlanets ] = useState<{[key: string]: Planet}>({})
    const [ isPlay, setPlay ] = useState(false)
    const [ speed, setSpeed ] = useState(3)
    const [ radius, setRadius ] = useState(16)
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
        _worker.current.postMessage({kind: 'planetAdd', newPlanet: { id: uuidv4(), data: newPlanet }})
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
                    radius={radius}
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
                weight={radius}
                label={cursorLabel}
            />

            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>
            <Controller right={20} top={20} minWidth={200}>
                <Labels>
                    <Label name='현재 행성 수' value={Object.keys(planets).length}/>
                </Labels>
            </Controller>

            <Controller left={20} bottom={140}>
                <Button content={<ArrowsIn />} tooltip='작게' onClick={() => radius-4 > 0 && setRadius(radius-4)} />
                <Button content={`${radius}`} tooltip='반지름' onClick={() => null} />
                <Button content={<ArrowsOut />} tooltip='크게' onClick={() => setRadius(radius+4)} />
            </Controller>

            <Controller left={20} bottom={100}>
                <Button content={<Minus />} tooltip='가볍게' onClick={() => weight-8 > 0 && setWeight(weight-8)} />
                <Button content={`${weight}`} tooltip='질량' onClick={() => null} />
                <Button content={<Plus />} tooltip='무겁게' onClick={() => setWeight(weight+8)} />
            </Controller>

            <Controller left={20} bottom={60}>
                <Button content={isPlay ? <Pause /> : <Play />} tooltip='Play' onClick={() => setPlay(!isPlay)} />
                <Button content={<ArrowClockwise />} tooltip='초기화' onClick={() => window.confirm('정말로 초기화하시겠어요?') && window.location.reload()} />
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