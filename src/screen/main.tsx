import { Controller, Button, Label } from "../components";
import { Play, Cursor , CaretRight, CaretLeft, HandPointing, ArrowUpRight, Plus, Planet  } from "phosphor-react";
import Logo from '../assets/lettering.png'
import styled from "styled-components";

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
    return (
        <>
            <LogoDiv>
                <img src={Logo} alt='스페이스 그래비티 로고' />
            </LogoDiv>
            <Controller right={20} top={20}>
                <Label>
                    <Planet /> 123 | <Planet /> 123
                </Label>
            </Controller>
            <Controller left={20} bottom={20}>
                <Button content={<Plus  />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<Cursor />} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<HandPointing  />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<ArrowUpRight   />} tooltip='Pause' onClick={() => console.log('play')} />
            </Controller>
            <Controller left={20} bottom={60}>
                <Button content={<Play />} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretLeft  />} tooltip='fast' onClick={() => console.log('play')} />
                <Button content={'1x'} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='fast' onClick={() => console.log('play')} />
            </Controller>
        </>
    )
}