import React, { createContext, useEffect, useRef, useCallback } from "react";

export const WorkerContext = createContext({
    requestWorker: (code: string, data?:any) => {},
    addListener: (code: string, callback: Function) => {},
    removeListener: (symbol: symbol) => {}
})

interface Listeners {
    [key: symbol]: {
        code: string,
        callback: Function
    }
}

const WorkerProvider: React.FC<React.ReactNode> = ({children}) => {
    const worker = useRef<Worker>(new Worker('./simulator.js'));
    const listeners = useRef<Listeners>({})

    useEffect(() => {
        // 메세지 수신
        worker.current.onmessage = (msg:any) => {          
            for (let lister of Object.values(listeners.current)) {
                if (lister.code === msg.data.code) {
                    lister.callback(msg.data.data)
                }
            }

            switch (msg.data.kind) {
                case 'newPlanets':
            }
        }
    }, [])

    // 워커 쓰레드에 요청
    const requestWorker = useCallback((code: string, data?:any) => {
        worker.current.postMessage({
            code,
            data
        })
    }, [])

    // 리스너 추가
    const addListener = useCallback((code: string, callback: Function):Symbol => {
        const symbol = Symbol(code)
        listeners.current = {
            ...listeners.current,
            [symbol]: {
                code,
                callback
            }
        }
        return symbol
    }, [])

    // 리스너 지우기
    const removeListener = useCallback((symbol: symbol) => {
        const newListeners = listeners.current
        delete newListeners[symbol]
        listeners.current = newListeners
    }, [])

    return (
        <WorkerContext.Provider
            value={{
                requestWorker,
                addListener,
                removeListener
            }}
        >
            {children}
        </WorkerContext.Provider>
    )
}

export default WorkerProvider;