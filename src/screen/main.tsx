import { Controller, Button, Label, Labels, VectorCanvas, Cursor, PlanetCanvas, GridCanvas, Move } from "../components";
import { Statistics, Setting, RandomGenerator } from "../components/main/interface";
import { 
    Play,
    Pause,
    Cursor as CursorIcon,
    CaretRight,
    CaretLeft,
    ArrowsOutCardinal,
    PlusCircle,
    Plus,
    Minus,
    ArrowsOut,
    ArrowsIn,
    ArrowClockwise,
    Trash
} from "phosphor-react";
import Logo from '../assets/lettering.png'
import styled from "styled-components";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import FPSStats from "react-fps-stats";
import { ToastContext } from "../context/toast";
import { ReactComponent as GithubSvg } from '../assets/github.svg'

import type { CursorMode, Planet, NewPlanetOption, UpdateNewPlanetOption, DrawerOption, UpdateDrawerOption } from "../types/";

// 상수
const PLANET_MIN_WEIGHT = 4
const PLANET_MIN_RADIUS = 4
const WHEEL_STEP = 0.25

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

const GithubIcon = styled(GithubSvg)`
    position: fixed;
    width: 24px;
    height: 24px;
    top: 36px;
    left: 220px;   
    user-select: none;
    fill: #ffffff;
`

export default function Main() {
    const toast = useContext(ToastContext)
    const _worker = useRef<any>(null)
    const [ planets, setPlanets ] = useState<{[key: string]: Planet}>({}) // 현재의 행성 정보

    const newPlanetOptionRef = useRef<NewPlanetOption>({
        color: '',
        isFixed: false,
        radius: 8,
        mass: 8
    })
    const [ newPlanetOption, setNewPlanetOption ] = useState(newPlanetOptionRef.current)
    
    const drawerOptionRef = useRef<DrawerOption>({
        isShowPlanetVector: true,
        isShowPlanetInfo: false,
        isShowGrid: true,
        gridBrightness: 15,
        gridStep: 20,
        isShowFPS_UPS: false,
        DEBUG_isShowPlanetInfo: false,
        DEBUS_isShowFPS: false,
    })
    const [ drawerOption, setDrawerOption ] = useState(drawerOptionRef.current)

    const [ screenPosition, setScreenPosition ] = useState({x: 0, y: 0})
    const [ screenZoom, setScreenZoom ] = useState(1)

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
            cursorLabel = [`질량 ${newPlanetOption.mass}`]
            if (newPlanetOption.isFixed) cursorLabel.push(`고정`)
            break;
        case 'create-vector':
            cursorLabel = [`속도 (${mouseVector.x}, ${mouseVector.y})`]
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

    // updateNewPlanetOption
    const updateDrawerOption = useCallback((newOption: UpdateDrawerOption) => {
        const _newOption = {
            ...drawerOptionRef.current,
            ...newOption
        }

        drawerOptionRef.current = _newOption
        setDrawerOption(_newOption)
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
    const changeMass = useCallback((newMass: number) => {
        if (!_worker.current) return
        if (newMass >= PLANET_MIN_WEIGHT)
        // setMass(newMass)
        updateNewPlanetOption({mass: newMass})
    }, [updateNewPlanetOption])

    // 재생, 일시정지
    const pauseToggle = useCallback(() => {
        if (!_worker.current) return
        setPlay(!isPlay)
        _worker.current.postMessage({kind: 'isPlay', isPlay: !isPlay})
    }, [isPlay])

    const play = useCallback(() => {
        if (!_worker.current) return
        setPlay(true)
        _worker.current.postMessage({kind: 'isPlay', isPlay: true})
    }, [])

    const pause = useCallback(() => {
        if (!_worker.current) return
        setPlay(false)
        _worker.current.postMessage({kind: 'isPlay', isPlay: false})
    }, [])

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
        toast('행성 정보 초기화')
        return reset
    }, [reset, toast])

    // 키보드 입력 이벤트
    const keyPress = useCallback((e:any) => {
        switch(e.key) {
            case '=': // 질량, 크기 증가
                changeRadius(newPlanetOption.radius+4)
                changeMass(newPlanetOption.mass+4)
                break

            case '-': // 질량, 크기 감소
                changeRadius(newPlanetOption.radius-4)
                changeMass(newPlanetOption.mass-4)
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

            case 'v':
                setCursorMode('move')
                break

            case 'c':
                setCursorMode('create')
                break

            default:
                break
        }
    }, [changeRadius, changeMass, newPlanetOption.radius, newPlanetOption.mass, reset, speed])

    const keydown = useCallback((e:KeyboardEvent) => {
        switch(e.key) {
            case 'Control':
                updateNewPlanetOption({isFixed: true})
                break
            
            case 'ArrowUp':
            case 'w':
                setScreenPosition({x: screenPosition.x, y: screenPosition.y + 10})
                break

            case 'ArrowDown':
            case 's':
                setScreenPosition({x: screenPosition.x, y: screenPosition.y - 10})
                break

            case 'ArrowLeft':
            case 'a':
                setScreenPosition({y: screenPosition.y, x: screenPosition.x + 10})
                break

            case 'ArrowRight':
            case 'd':
                setScreenPosition({y: screenPosition.y, x: screenPosition.x - 10})
                break

            case ' ':
                pauseToggle()
                break

            default: 
                break
        }
    }, [pauseToggle, screenPosition.x, screenPosition.y, updateNewPlanetOption])

    const keyup = useCallback((e:any) => {
        switch(e.key) {
            case 'Control':
                updateNewPlanetOption({isFixed: false})
                break

            default: 
                break
        }
    }, [updateNewPlanetOption])

    const wheel = useCallback((e:WheelEvent) => {
        if (e.deltaY < 0) {
            if (screenZoom + WHEEL_STEP > 8) return
            setScreenZoom(screenZoom + WHEEL_STEP)
            toast(`확대 ${(screenZoom + WHEEL_STEP) * 100}%`)
        } else {
            if (screenZoom - WHEEL_STEP <= 0) return
            setScreenZoom(screenZoom - WHEEL_STEP)
            toast(`확대 ${(screenZoom - WHEEL_STEP) * 100}%`)
        }
    }, [screenZoom, toast])

    // 이벤트
    useEffect(() => {
        document.addEventListener('keypress', keyPress)
        document.addEventListener('keydown', keydown)
        document.body.addEventListener('keyup', keyup)
        window.addEventListener('wheel', wheel)

        return () => {
            document.removeEventListener('keypress', keyPress)
            document.removeEventListener('keydown', keydown)
            document.body.removeEventListener('Keyup', keyup)
            window.removeEventListener('wheel', wheel)
        }
    }, [keyPress, keydown, keyup, wheel])

    return (
        <>  
            <Canvases>
                

                {
                    (drawerOption.isShowGrid) &&
                    <GridCanvas 
                        drawerOption={drawerOption}
                        screenPosition={screenPosition}
                        screenZoom={screenZoom}
                    />
                }

                <PlanetCanvas
                    planets={planets}
                    fps={fps}
                    drawerOption={drawerOption}
                    screenPosition={screenPosition}
                    screenZoom={screenZoom}
                />
                
                {
                    (cursorMode === 'create' || cursorMode === 'create-vector') &&
                    <VectorCanvas
                        newPlanetOption={newPlanetOption}
                        setCursorMode={setCursorMode}
                        setMouseVector={setMouseVector}
                        addNewPlanet={addNewPlanet}
                        screenPosition={screenPosition}
                        screenZoom={screenZoom}
                    />
                }

{
                    (cursorMode === 'move') &&
                    <Move
                        setScreenPosition={setScreenPosition}
                        screenPosition={screenPosition}
                        screenZoom={screenZoom}
                    />
                }


            </Canvases>
            {
                (cursorMode === 'create' || cursorMode === 'create-vector') &&
                <Cursor
                    NewPlanetOption={newPlanetOption}
                    cursorMode={cursorMode}
                    radius={newPlanetOption.radius}
                    label={cursorLabel}
                    screenZoom={screenZoom}
                />
            }
            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>
            <a href="https://github.com/HyunsDev/space-gravity" target={"_blank"} rel="noreferrer">
                <GithubIcon /> 
            </a>

            {drawerOption.DEBUS_isShowFPS && <FPSStats />}
            <Statistics 
                fps_ups={`${fps.current} / ${ups.current}`}
                planetQuota={Object.keys(planets).length}
                drawerOption={drawerOption}
            />
            <Setting 
                updateDrawerOption={updateDrawerOption}
                drawerOption={drawerOption}
                worker={_worker.current}
            />

            <RandomGenerator
                drawerOption={drawerOption}
                addNewPlanet={addNewPlanet}
                pause={pause}
                play={play}
            />
            
            <Controller left={20} bottom={140}>
                <Button content={<CursorIcon />} tooltip='선택' onClick={() => setCursorMode('select')} />
                <Button content={<ArrowsOutCardinal />} tooltip='이동 [ v ]' onClick={() => setCursorMode('move')} />
                <Button content={<PlusCircle />} tooltip='생성 [ c ]' onClick={() => setCursorMode('create')} />
            </Controller>

            <Controller left={20} bottom={100}>
                <Button content={<ArrowsIn />} tooltip='작게 [ Shift - ]' onClick={() => changeRadius(newPlanetOption.radius-4)} />
                <Button content={`${newPlanetOption.radius}`} tooltip='반지름' onClick={() => null} />
                <Button content={<ArrowsOut />} tooltip='크게 [ Shift + ]' onClick={() => changeRadius(newPlanetOption.radius+4)} />
            </Controller>

            <Controller left={20} bottom={60}>
                <Button content={<Minus />} tooltip='가볍게 [ - ]' onClick={() => changeMass(newPlanetOption.mass-4)} />
                <Button content={`${newPlanetOption.mass}`} tooltip='질량' onClick={() => null} />
                <Button content={<Plus />} tooltip='무겁게 [ + ]' onClick={() => changeMass(newPlanetOption.mass+4)} />
            </Controller>

            <Controller left={20} bottom={20}>
                <Button content={isPlay ? <Pause /> : <Play />} tooltip={isPlay ? '일시정지' : '재생'} onClick={pauseToggle} />
                <Button content={<Trash />} tooltip='행성 지우기 [ r ]' onClick={() => reset()} />
                <Button content={<ArrowClockwise />} tooltip='새로고침 [ ctrl r ]' onClick={() => window.location.reload() } />
                <Button content={<CaretLeft  />} tooltip='느리게 [ < ]' onClick={() => speed-0.5 > 0 && setSpeed(speed-0.5)} />
                <Button content={`${speed}x`} tooltip='시뮬레이션 속도' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='빠르게 [ > ]' onClick={() => speed+0.5 < 4 && setSpeed(speed+0.5)} />
            </Controller>
        </>
    )
}