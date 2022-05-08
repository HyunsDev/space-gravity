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

import type { CursorMode, Planet, NewPlanetOption, UpdateNewPlanetOption } from "../types/";

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

const Canvases = styled.div`
    position: relative;
    width: 100vw;
    min-height: 100vh;
`

export default function Main() {
    const toast = useContext(ToastContext)
    // const [ newPlanet, setNewPlanet ] = useState<Planet>() // 새로운 행성 임시 저장
    const [ planets, setPlanets ] = useState<{[key: string]: Planet}>({}) // 현재의 행성 정보
    const newPlanetOptionRef = useRef<any>({
        color: '',
        isFixed: false,
        radius: 8,
        weight: 8
    })
    const [ newPlanetOption, setNewPlanetOption ] = useState<NewPlanetOption>({
        color: '',
        isFixed: false,
        radius: 8,
        weight: 8
    })
    const _worker = useRef<any>(null)

    const [ isPlay, setPlay ] = useState(true) // 재생 여부
    const [ speed, setSpeed ] = useState(1) // 스피드
    const [ cursorMode, setCursorMode ] = useState<CursorMode>('create') // 커서 모드
    const [ mouseVector, setMouseVector ] = useState({x: 0, y: 0})

    const fps = useRef(0)
    const ups = useRef(0)

    // 커서 라벨 지정
    let cursorLabel
    switch (cursorMode) {
        case 'create':
            cursorLabel = [`질량 ${newPlanetOption.weight}`]
            if (newPlanetOption.isFixed) cursorLabel.push(`고정`)
            break;
        case 'create-vector':
            cursorLabel = [`벡터 (${mouseVector.x}, ${mouseVector.y})`]
            if (newPlanetOption.isFixed) cursorLabel = ['고정됨']
            break

        default:
            break;
    }

    // updateNewPlanetOption
    const updateNewPlanetOption = useCallback((newOption: UpdateNewPlanetOption) => {
        const _newOption = {
            ...newPlanetOptionRef.current,
            ...newOption
        }

        newPlanetOptionRef.current = _newOption
        setNewPlanetOption(_newOption)
    }, [])

    // 백그라운드
    useEffect(() => {
        const focus = () => {
            toast.off()
        }

        const blur = () => {
            toast.on('화면에 포커스가 없습니다.\n키보드 콤보를 사용하려면 이곳을 클릭하세요')
        }

        window.addEventListener("focus", focus);
        window.addEventListener("blur", blur);
        return () => {
            document.body.removeEventListener("focus", focus);
            document.body.removeEventListener("blur", blur);
        }
    }, [toast])

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
                case 'ups':
                    ups.current = msg.data.ups
                    break
                default:
                    break;
            }
        }
    }, [toast])


    // 새로운 행성 추가
    const addNewPlanet = useCallback((newPlanet) => {
        if (!_worker.current) return
        _worker.current.postMessage({kind: 'planetAdd', newPlanet: { id: uuidv4(), data: newPlanet }})
    }, [])

    // 속도 변경
    useEffect(() => {
        if (!_worker.current) return
        _worker.current.postMessage({kind: 'speedUpdate', speed})
    }, [speed])

    // 반지름 변경
    const changeRadius = useCallback((newRadius: number) => {
        if (!_worker.current) return
        if (newRadius >= PLANET_MIN_RADIUS)
        updateNewPlanetOption({radius: newRadius})
    }, [updateNewPlanetOption])

    // 무게 변경
    const changeWeight = useCallback((newWeight: number) => {
        if (!_worker.current) return
        if (newWeight >= PLANET_MIN_WEIGHT)
        // setWeight(newWeight)
        updateNewPlanetOption({weight: newWeight})
    }, [updateNewPlanetOption])

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
        // _worker.current.terminate()
        // _worker.current = new Worker('./simulator.js')
        // _worker.current.postMessage({kind: 'ping'})
    }, [])

    // 초기화
    useEffect(() => {
        reset()
        toast('초기화')
        return reset
    }, [reset, toast])

    // 키보드 입력 이벤트
    const keyPress = useCallback((e:any) => {
        switch(e.key) {
            case '=': // 질량, 크기 증가
                changeRadius(newPlanetOption.radius+4)
                changeWeight(newPlanetOption.weight+4)
                break

            case '-': // 질량, 크기 감소
                changeRadius(newPlanetOption.radius-4)
                changeWeight(newPlanetOption.weight-4)
                break

            case '+': // 크기 증가
                changeRadius(newPlanetOption.radius+4)
                break

            case '_': // 크기 감소
                changeRadius(newPlanetOption.radius-4)
                break

            case '.':
            case '>':
                speed+0.5 <= 3 && setSpeed(speed+0.5)
                break

            case ',':
            case '<':
                speed-0.5 > 0 && setSpeed(speed-0.5)
                break

            case 'r':
                reset()
                break

            default:
                break
        }
    }, [changeRadius, changeWeight, newPlanetOption.radius, newPlanetOption.weight, reset, speed])

    const Keydown = useCallback((e:KeyboardEvent) => {
        switch(e.key) {
            case 'Control':
                updateNewPlanetOption({isFixed: true})
                break

            default: 
                break
        }
    }, [updateNewPlanetOption])

    const Keyup = useCallback((e:any) => {
        switch(e.key) {
            case 'Control':
                updateNewPlanetOption({isFixed: false})
                break

            default: 
                break
        }
    }, [updateNewPlanetOption])

    // 이벤트
    useEffect(() => {
        document.addEventListener('keypress', keyPress)
        document.addEventListener('keydown', Keydown)
        document.body.addEventListener('keyup', Keyup)

        return () => {
            document.removeEventListener('keypress', keyPress)
            document.removeEventListener('keydown', Keydown)
            document.body.removeEventListener('Keyup', Keyup)
        }
    }, [Keydown, keyPress, Keyup])

    return (
        <>  
            <Canvases>
                <VectorCanvas
                    newPlanetOption={newPlanetOption}
                    setCursorMode={setCursorMode}
                    setMouseVector={setMouseVector}
                    addNewPlanet={addNewPlanet}
                ></VectorCanvas>

                <PlanetCanvas
                    planets={planets}
                    fps={fps}
                ></PlanetCanvas>
            </Canvases>
            <Cursor
                NewPlanetOption={newPlanetOption}
                cursorMode={cursorMode}
                radius={newPlanetOption.radius}
                label={cursorLabel}
            />
            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>

            <FPSStats />
            <Statistics 
                items={{
                    'FPS / UPS': `${fps.current} / ${ups.current}`,
                    '현재 행성 수': Object.keys(planets).length,
                }}
            />
            <Controller left={20} bottom={100}>
                <Button content={<ArrowsIn />} tooltip='작게 [ Shift - ]' onClick={() => changeRadius(newPlanetOption.radius-4)} />
                <Button content={`${newPlanetOption.radius}`} tooltip='반지름' onClick={() => null} />
                <Button content={<ArrowsOut />} tooltip='크게 [ Shift + ]' onClick={() => changeRadius(newPlanetOption.radius+4)} />
            </Controller>

            <Controller left={20} bottom={60}>
                <Button content={<Minus />} tooltip='가볍게 [ - ]' onClick={() => changeWeight(newPlanetOption.weight-4)} />
                <Button content={`${newPlanetOption.weight}`} tooltip='질량' onClick={() => null} />
                <Button content={<Plus />} tooltip='무겁게 [ + ]' onClick={() => changeWeight(newPlanetOption.weight+4)} />
            </Controller>

            <Controller left={20} bottom={20}>
                <Button content={isPlay ? <Pause /> : <Play />} tooltip={isPlay ? '일시정지' : '재생'} onClick={pauseToggle} />
                <Button content={<ArrowClockwise />} tooltip='초기화 [ r ]' onClick={() => reset()} />
                <Button content={<CaretLeft  />} tooltip='느리게 [ < ]' onClick={() => speed-0.5 > 0 && setSpeed(speed-0.5)} />
                <Button content={`${speed}x`} tooltip='시뮬레이션 속도' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='빠르게 [ > ]' onClick={() => speed+0.5 < 4 && setSpeed(speed+0.5)} />
            </Controller>
        </>
    )
}