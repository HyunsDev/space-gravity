import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'


interface MonitorProps {
    debug: {
        [key: string]: string | number
    }
    reset: Function
    isPause: boolean;
    setPause: Function;
}

const MonitorDiv = styled.div`
    position: fixed;
    background-color: black;
    padding: 16px;
    bottom: 16px;
    left: 16px;
    color: #ffffff;
    border-radius: 8px;
`

function Monitor (props: MonitorProps) {
    return (
        <MonitorDiv>
            <p>[ Debug Monitor ]</p>
            {
                Object.entries(props.debug).map(e => <p key={e[0]}>{e[0]}: {e[1]}</p>)
            }
            <br /><p onClick={() => props.reset(0)}>[ reset ]</p>
            <p onClick={() => props.setPause(!props.isPause)}>{props.isPause ? '[ 일시정지 ]' : '[ 재생 ]'}</p>
        </MonitorDiv>
    )
}


interface BallProps {
    left: number;
    top: number;
}
const Ball = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: #ffffff;
    position: fixed;
    left: ${(props:BallProps) => props.left}px;
    top: ${(props: BallProps) => props.top}px;
`

// function Ball(props: BallProps) {

//     return (
//         <>
        
//         </>
//     )
// }

export default function StressTest() {
    const [num, setNum] = useState(0)
    const timer = useRef({ old: new Date(), new: new Date() })
    const [isPause, setPause] = useState(true)
    const [ Balls, setBalls ] = useState<any>([])

    useEffect(() => {
        const _ = setInterval(() => {
            if (isPause) return
            const _balls = []
            const maxWidth = window.innerWidth / 32
            timer.current.old = timer.current.new
            timer.current.new = new Date()

            for (let i = 0; i < num + 1; i++) {
                _balls.push(<Ball left={(i%maxWidth)*36} top={Math.floor(i/maxWidth)*36} />)
            }
            setBalls(_balls)
            setNum(num + 1)
        }, 100)

        return () => {
            clearInterval(_)
        }
    }, [isPause, num])

    return (
        <>
            <Monitor debug={{Number: num, width: window.innerWidth, height: window.innerHeight, timer: timer.current.new.getTime() - timer.current.old.getTime()}} reset={setNum} isPause={isPause} setPause={setPause} />
            { Balls }
            <div>Stress</div>
        </>
    )
}
