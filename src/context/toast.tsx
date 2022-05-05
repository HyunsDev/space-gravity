import React, { createContext, useState } from "react"
import { Toast } from "../components/toast"

export const ToastContext = createContext((text: string, time: number = 2000) => {})

const ToastProvider: React.FC<React.ReactNode> = ({children}) => {
    const [isShow, setShow] = useState(false)
    const [text, setText] = useState('테스트 토스트 메세지')

    const toast = (text:string, time:number = 2000) => {
        setText(text)
        setShow(true)
        setTimeout(() => {setShow(false)}, time)
    }

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