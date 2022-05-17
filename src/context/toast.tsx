import React, { createContext, useState, useCallback, useRef, useEffect } from "react"
import { Toast } from "../components/toast"

const dummyFunc = (text: string, time: number = 2000) => {}
dummyFunc.on = (text: string) => {}
dummyFunc.off = () => {}

export const ToastContext = createContext(dummyFunc)

let timer: NodeJS.Timeout | null = null;

const ToastProvider: React.FC<React.ReactNode> = ({children}) => {
    const [isShow, setShow] = useState(false)
    const [text, setText] = useState('테스트 토스트 메세지')

    const toast:any = useCallback((text:string, time:number = 2000) => {
        setText(text)
        setShow(true)
        timer && clearTimeout(timer)
        timer = setTimeout(() => {setShow(false)}, time)
    }, [])

    toast.on = useCallback((text: string) => {
        timer && clearTimeout(timer)
        setText(text)
        setShow(true)
    }, [])

    toast.off = useCallback(() => {
        if (!isShow) return
        setShow(false)
    }, [isShow])

    return (
        <ToastContext.Provider
            value={toast}
        >
            <Toast isShow={isShow} text={text} setShow={setShow} />
            {children}
        </ToastContext.Provider>
    )
}

export default ToastProvider
