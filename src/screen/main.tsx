import { Controller, Button } from "../components";
import { Play, Pause, Cursor , CaretRight, CaretLeft, HandPointing, ArrowUpRight, Plus } from "phosphor-react";

export default function Main() {

    return (
        <>
            <Controller left={20} bottom={20}>
                <Button content={<Plus  />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<Cursor />} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<HandPointing  />} tooltip='Pause' onClick={() => console.log('play')} />
                <Button content={<ArrowUpRight   />} tooltip='Pause' onClick={() => console.log('play')} />
            </Controller>
            <Controller right={20} bottom={20}>
                <Button content={<Play />} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretLeft  />} tooltip='fast' onClick={() => console.log('play')} />
                <Button content={'1x'} tooltip='Play' onClick={() => console.log('play')} />
                <Button content={<CaretRight  />} tooltip='fast' onClick={() => console.log('play')} />
            </Controller>
        </>
    )
}