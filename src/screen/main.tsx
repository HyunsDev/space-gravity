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

import type { CursorMode, NewPlanet, NewPlanetOption, UpdateNewPlanetOption, DrawerOption, UpdateDrawerOption } from "../types/";
import { SettingContext } from "../context/setting";
import { WorkerContext } from "../context/worker";

// 상수
// const PLANET_MIN_WEIGHT = 4
// const PLANET_MIN_RADIUS = 4
// const WHEEL_STEP = 0.25

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
    const setting = useContext(SettingContext)
    const worker = useContext(WorkerContext)
    const planets = useRef<{[key: string]: NewPlanet}>({})

    // const newPlanetOptionRef = useRef<NewPlanetOption>({
    //     color: '',
    //     isFixed: false,
    //     radius: 8,
    //     mass: 8
    // })
    // const [ newPlanetOption, setNewPlanetOption ] = useState(newPlanetOptionRef.current)
    
    // const drawerOptionRef = useRef<DrawerOption>({
    //     isShowPlanetVector: true,
    //     isShowPlanetInfo: false,
    //     isShowGrid: true,
    //     gridBrightness: 15,
    //     gridStep: 20,
    //     isShowFPS_UPS: false,
    //     DEBUG_isShowPlanetInfo: false,
    //     DEBUS_isShowFPS: false,
    // })
    // const [ drawerOption, setDrawerOption ] = useState(drawerOptionRef.current)

    // const [ screenPosition, setScreenPosition ] = useState({x: 0, y: 0})
    // const [ screenZoom, setScreenZoom ] = useState(1)

    // const [ isPlay, setPlay ] = useState(true) // 재생 여부
    // const [ speed, setSpeed ] = useState(1) // 스피드
    // const [ cursorMode, setCursorMode ] = useState<CursorMode>('create') // 커서 모드
    const [ mouseVector, setMouseVector ] = useState({x: 0, y: 0})

    const [ fps, setFps ] = useState(0)
    const [ ups, setUps ] = useState(0)
    // const fps = useRef(0)
    // const ups = useRef(0)

    // 커서 라벨 지정
    let cursorLabel
    switch (setting.setting.cursorMode) {
        case 'create':
            cursorLabel = [`질량 ${setting.setting.newPlanetMass}`]
            if (setting.setting.newPlanetIsFixed) cursorLabel.push(`고정`)
            break;
        case 'create-vector':
            cursorLabel = [`속도 (${mouseVector.x}, ${mouseVector.y})`]
            if (setting.setting.newPlanetIsFixed) cursorLabel = ['고정됨']
            break

        default:
            break;
    }

    // 화면 포커스 여부
    useEffect(() => {
        const focus = () => toast.off()
        const blur = () => toast.on('화면에 포커스가 없습니다.\n키보드 콤보를 사용하려면 이곳을 클릭하세요')
        window.addEventListener("focus", focus);
        window.addEventListener("blur", blur);
        return () => {
            document.body.removeEventListener("focus", focus);
            document.body.removeEventListener("blur", blur);
        }
    }, [toast])

    const addNewPlanet = useCallback((newPlanet) => {
        worker.requestWorker('addPlanet', { id: uuidv4(), data: newPlanet })
    }, [worker])

    // 실행 속도 변경
    const changeSpeed = useCallback((speed: number) => {
        setting.updateSetting('simulatorSpeed', speed)
        worker.requestWorker('updateSpeed', { speed: speed })
    }, [setting, worker])

    // 반지름 변경
    const changeRadius = useCallback((newRadius: number) => {
        if (newRadius >= setting.setting.PLANET_MIN_RADIUS) setting.updateSetting('newPlanetRadius', newRadius)
    }, [setting])

    // 무게 변경
    const changeMass = useCallback((newMass: number) => {
        if (newMass >= setting.setting.PLANET_MIN_WEIGHT) setting.updateSetting('newPlanetMass', newMass)
    }, [setting])

    const play = useCallback(() => {
        setting.updateSetting('isPlay', true)
        worker.requestWorker('play')
    }, [setting, worker])

    const pause = useCallback(() => {
        setting.updateSetting('isPlay', false)
        worker.requestWorker('pause')
    }, [setting, worker])

    // 시뮬레이터 리셋
    const reset = useCallback(() => worker.requestWorker('reset'), [worker])


    // 시뮬레이터
    useEffect(() => {
        const resultListener = worker.addListener('result', (data) => planets.current = data)
        const pongListener = worker.addListener('pong', () => toast('시뮬레이터 연결됨'))
        const upsListener = worker.addListener('ups', (data) => setUps(data))
        return () => {
            worker.removeListener(resultListener)
            worker.removeListener(pongListener)
            worker.removeListener(upsListener)
        }

    }, [toast, worker])

    // 초기화
    useEffect(() => {
        reset()
        toast('행성 정보 초기화')
        return reset
    }, [reset, toast])

    // 키보드 입력 이벤트
    const keyPress = useCallback((e:any) => {
        switch(e.key) {
            case '=': // 질량 증가
                changeMass(setting.setting.newPlanetMass+4);
                break

            case '-': // 질량 감소
                changeMass(setting.setting.newPlanetMass-4);
                break

            case '+': // 크기 증가
                changeRadius(setting.setting.newPlanetRadius+4)
                break

            case '_': // 크기 감소
                changeRadius(setting.setting.newPlanetRadius-4)
                break

            case '.':
            case '>':
                setting.setting.simulatorSpeed+0.5 <= 3 && setting.updateSetting('simulatorSpeed', setting.setting.simulatorSpeed+0.5)
                break

            case ',':
            case '<':
                setting.setting.simulatorSpeed-0.5 > 0 && setting.updateSetting('simulatorSpeed', setting.setting.simulatorSpeed-0.5)
                break

            case 'r':
                reset()
                break

            case 'v':
                setting.updateSetting('cursorMode', 'move')
                break

            case 'c':
                setting.updateSetting('cursorMode', 'create')
                break

            default:
                break
        }
    }, [changeRadius, setting, changeMass, reset])

    const keydown = useCallback((e:KeyboardEvent) => {
        switch(e.key) {
            case 'Control':
                setting.updateSetting('newPlanetIsFixed', true)
                break
            
            case 'ArrowUp':
            case 'w':
                setting.updateSetting('drawerScreenPosition', {x: setting.setting.drawerScreenPosition.x, y: setting.setting.drawerScreenPosition.y + 10})
                break

            case 'ArrowDown':
            case 's':
                setting.updateSetting('drawerScreenPosition', {x: setting.setting.drawerScreenPosition.x, y: setting.setting.drawerScreenPosition.y - 10})
                break

            case 'ArrowLeft':
            case 'a':
                setting.updateSetting('drawerScreenPosition', {x: setting.setting.drawerScreenPosition.x + 10, y: setting.setting.drawerScreenPosition.y})
                break

            case 'ArrowRight':
            case 'd':
                setting.updateSetting('drawerScreenPosition', {x: setting.setting.drawerScreenPosition.x - 10, y: setting.setting.drawerScreenPosition.y})
                break

            case ' ':
                ;(setting.setting.isPlay ? pause : play)()
                break

            default: 
                break
        }
    }, [pause, play, setting])

    const keyup = useCallback((e:any) => {
        switch(e.key) {
            case 'Control':
                setting.updateSetting('newPlanetIsFixed', false)
                // updateNewPlanetOption({isFixed: false})
                break

            default: 
                break
        }
    }, [setting])

    const wheel = useCallback((e:WheelEvent) => {
        if (e.deltaY < 0) {
            if (setting.setting.drawerScreenZoom + setting.setting.WHEEL_STEP > 8) return
            setting.updateSetting('drawerScreenZoom', setting.setting.drawerScreenZoom + setting.setting.WHEEL_STEP)
            toast(`확대 ${(setting.setting.drawerScreenZoom + setting.setting.WHEEL_STEP) * 100}%`)
        } else {
            if (setting.setting.drawerScreenZoom - setting.setting.WHEEL_STEP <= 0) return
            setting.updateSetting('drawerScreenZoom', setting.setting.drawerScreenZoom - setting.setting.WHEEL_STEP)
            toast(`확대 ${(setting.setting.drawerScreenZoom + setting.setting.WHEEL_STEP) * 100}%`)
        }
    }, [setting, toast])

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
                    (setting.setting.drawerIsShowGrid) && <GridCanvas />
                }

                <PlanetCanvas 
                    setFps={setFps}
                />
                
                {
                    (setting.setting.cursorMode === 'create' || setting.setting.cursorMode === 'create-vector') &&
                    <VectorCanvas
                        setMouseVector={setMouseVector}
                        addNewPlanet={addNewPlanet}
                    />
                }

{
                    (setting.setting.cursorMode === 'move') &&
                    <Move />
                }


            </Canvases>
            {
                (setting.setting.cursorMode === 'create' || setting.setting.cursorMode === 'create-vector') &&
                <Cursor
                    label={cursorLabel}
                />
            }
            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>
            <a href="https://github.com/HyunsDev/space-gravity" target={"_blank"} rel="noreferrer">
                <GithubIcon /> 
            </a>

            {setting.setting.DEBUG_drawerIsShowFPS && <FPSStats />}
            <Statistics 
                fps_ups={`${fps} / ${ups}`}
            />
            <Setting />

            <RandomGenerator
                addNewPlanet={addNewPlanet}
            />
            
            <Controller left={20} bottom={140}>
                <Button content={<CursorIcon />} tooltip='선택' onClick={() => setting.updateSetting('cursorMode', 'select')} />
                <Button content={<ArrowsOutCardinal />} tooltip='이동 [ v ]' onClick={() => setting.updateSetting('cursorMode', 'move')} />
                <Button content={<PlusCircle />} tooltip='생성 [ c ]' onClick={() => setting.updateSetting('cursorMode', 'create')} />
            </Controller>

            <Controller left={20} bottom={100}>
                <Button content={<ArrowsIn />} tooltip='작게 [ Shift - ]' onClick={() => changeRadius(setting.setting.newPlanetRadius-4)} />
                <Button content={`${setting.setting.newPlanetRadius}`} tooltip='반지름' onClick={() => null} />
                <Button content={<ArrowsOut />} tooltip='크게 [ Shift + ]' onClick={() => changeRadius(setting.setting.newPlanetRadius+4)} />
            </Controller>

            <Controller left={20} bottom={60}>
                <Button content={<Minus />} tooltip='가볍게 [ - ]' onClick={() => changeMass(setting.setting.newPlanetMass-4)} />
                <Button content={`${setting.setting.newPlanetMass}`} tooltip='질량' onClick={() => null} />
                <Button content={<Plus />} tooltip='무겁게 [ + ]' onClick={() => changeMass(setting.setting.newPlanetMass+4)} />
            </Controller>

            <Controller left={20} bottom={20}>
                <Button content={setting.setting.isPlay ? <Pause /> : <Play />} tooltip={setting.setting.isPlay ? '일시정지' : '재생'} onClick={(setting.setting.isPlay ? pause : play)} />
                <Button content={<Trash />} tooltip='행성 지우기 [ r ]' onClick={() => reset()} />
                <Button content={<ArrowClockwise />} tooltip='새로고침 [ ctrl r ]' onClick={() => window.location.reload() } />
                <Button content={<CaretLeft  />} tooltip='느리게 [ < ]' onClick={() => setting.setting.simulatorSpeed-0.5 > 0 && changeSpeed(setting.setting.simulatorSpeed-0.5)} />
                <Button content={`${setting.setting.simulatorSpeed}x`} tooltip='시뮬레이션 속도' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='빠르게 [ > ]' onClick={() => setting.setting.simulatorSpeed+0.5 < 4 && changeSpeed(setting.setting.simulatorSpeed+0.5)} />
            </Controller>
        </>
    )
}