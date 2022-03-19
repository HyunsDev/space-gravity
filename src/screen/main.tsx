import { Controller, Button } from "../components";
import { Play, Pause, Cursor , CaretRight, CaretLeft, HandPointing, ArrowUpRight, Plus } from "phosphor-react";

export default function Main() {

    return (
        <>
            <Controller x='10px' y='10px'>
                <Button content={<Plus  />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<Cursor />} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<HandPointing  />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<ArrowUpRight   />} tooltip='Pause' onClick={() => console.log('play')} />
            </Controller>
            <Controller x='80px' y='40px'>
                <Button content={<Play />} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretLeft  />} tooltip='fast' onClick={() => console.log('play')} />
                <Button content={'1x'} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='fast' onClick={() => console.log('play')} />
            </Controller>
        </>
    )
}