import { Controller, Button, Label, Labels, VectorCanvas, Cursor, PlanetCanvas } from "../components";
import { Statistics } from "../components/main/interface";
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
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import FPSStats from "react-fps-stats";
import { ToastContext } from "../context/toast";

// 상수
const PLANET_MIN_WEIGHT = 4
const PLANET_MIN_RADIUS = 4





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
    const toast = useContext(ToastContext)
    const [ newPlanet, setNewPlanet ] = useState<Planet>() // 새로운 행성 임시 저장
    const [ planets, setPlanets ] = useState<{[key: string]: Planet}>({}) // 현재의 행성 정보
    const _worker = useRef<any>(null)

    const [ isPlay, setPlay ] = useState(true) // 재생 여부
    const [ speed, setSpeed ] = useState(1) // 스피드
    const [ radius, setRadius ] = useState(8) // 반지름
    const [ weight, setWeight ] = useState(16) // 무게
    const [ cursorMode, setCursorMode ] = useState<'create' | 'create-vector'>('create') // 커서 모드
    const [ mouseVector, setMouseVector ] = useState({x: 0, y: 0})

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

    // 시뮬레이터
    useEffect(() => {
        if (_worker.current) return
        _worker.current = new Worker('./simulator.js')
        _worker.current.postMessage({kind: 'ping'})

        // 메세지 수신
        _worker.current.onmessage = (msg:any) => {
            switch (msg.data.kind) {
                case 'newPlanets':
                    setPlanets(msg.data.planets)
                    break;
                case 'pong':
                    toast('시뮬레이터 연결됨')
                    break
                default:
                    break;
            }
        }
    }, [toast])

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
    }, [speed])

    // 반지름 변경
    const changeRadius = useCallback((newRadius: number) => {
        if (!_worker.current) return
        if (newRadius >= PLANET_MIN_RADIUS)
        setRadius(newRadius)
    }, [])

    // 무게 변경
    const changeWeight = useCallback((newWeight: number) => {
        if (!_worker.current) return
        if (newWeight >= PLANET_MIN_WEIGHT)
        setWeight(newWeight)
    }, [])

    // 재생, 일시정지
    const pauseToggle = useCallback(() => {
        if (!_worker.current) return
        setPlay(!isPlay)
        _worker.current.postMessage({kind: 'isPlay', isPlay: !isPlay})
    }, [isPlay])


    // 시뮬레이터 리셋
    const reset = useCallback(() => {
        if (!_worker.current) return
        _worker.current.postMessage({kind: 'reset'})
    }, [])

    // 초기화
    useEffect(() => {
        reset()
        return reset
    }, [reset])

    const keyPress = useCallback((e:any) => {
        switch(e.key) {
            case '=':
                changeWeight(weight+4)
                break

            case '-':
                changeWeight(weight-4)
                break

            case '+':
                changeRadius(radius+4)
                break

            case '_':
                changeRadius(radius-4)
                break

            default:
                break
        }
    }, [changeRadius, changeWeight, radius, weight])

    // 이벤트
    useEffect(() => {
        document.addEventListener('keypress', keyPress)

        return () => {
            document.removeEventListener('keypress', keyPress)
        }
    }, [keyPress])

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
                radius={radius}
                label={cursorLabel}
            />
            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>

            <FPSStats />
            <Statistics 
                items={{
                    '현재 행성 수': Object.keys(planets).length
                }}
            />
            <Controller left={20} bottom={100}>
                <Button content={<ArrowsIn />} tooltip='작게' onClick={() => changeRadius(radius-4)} />
                <Button content={`${radius}`} tooltip='반지름' onClick={() => null} />
                <Button content={<ArrowsOut />} tooltip='크게' onClick={() => changeRadius(radius+4)} />
            </Controller>

            <Controller left={20} bottom={60}>
                <Button content={<Minus />} tooltip='가볍게' onClick={() => changeWeight(weight-4)} />
                <Button content={`${weight}`} tooltip='질량' onClick={() => null} />
                <Button content={<Plus />} tooltip='무겁게' onClick={() => changeWeight(weight+4)} />
            </Controller>

            <Controller left={20} bottom={20}>
                <Button content={isPlay ? <Pause /> : <Play />} tooltip={isPlay ? '일시정지' : '재생'} onClick={pauseToggle} />
                <Button content={<ArrowClockwise />} tooltip='초기화' onClick={() => reset()} />
                <Button content={<CaretLeft  />} tooltip='느리게' onClick={() => speed-0.5 > 0 && setSpeed(speed-0.5)} />
                <Button content={`${speed}x`} tooltip='시뮬레이션 속도' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='빠르게' onClick={() => speed+0.5 < 4 && setSpeed(speed+0.5)} />
            </Controller>
        </>
    )
}