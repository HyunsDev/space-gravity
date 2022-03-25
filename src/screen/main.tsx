import { Controller, Button, Label, Labels, VectorCanvas, Cursor } from "../components";
import { Play, Pause, Cursor as CursorIcon , CaretRight, CaretLeft, HandPointing, ArrowUpRight, Plus, Minus } from "phosphor-react";
import Logo from '../assets/lettering.png'
import styled from "styled-components";
import { useState } from "react";

const LogoDiv = styled.div`
    position: fixed;
    top: 32px;
    left: 32px;
    user-select: none;
    -webkit-user-drag: none;

    img {
        height: 32px;
        user-select: none;
        -webkit-user-drag: none;
    }
`

export default function Main() {
    const [ planet, setPlanet ] = useState([])
    const [ isPlay, setPlay ] = useState(false)
    const [ speed, setSpeed ] = useState(1)
    const [ weight, setWeight ] = useState(32)

    return (
        <>  
            <VectorCanvas weight={weight}></VectorCanvas>
            <Cursor weight={weight} />
            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>
            <Controller right={20} top={20} minWidth={200}>
                <Labels>
                    <Label name='현재 행성 수' value={planet.length}/>
                </Labels>
            </Controller>

            <Controller left={20} bottom={100}>
                <Button content={<Minus />} tooltip='lightly' onClick={() => setWeight(weight-8)} />
                <Button content={`${weight}`} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<Plus />} tooltip='heavily' onClick={() => setWeight(weight+8)} />
            </Controller>

            <Controller left={20} bottom={60}>
                <Button content={isPlay ? <Pause /> : <Play />} tooltip='Play' onClick={() => setPlay(!isPlay)} />
                <Button content={<CaretLeft  />} tooltip='fast' onClick={() => setSpeed(speed-1)} />
                <Button content={`${speed}x`} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='fast' onClick={() => setSpeed(speed+1)} />
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