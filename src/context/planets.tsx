import React, { createContext, useContext, useEffect, useState } from "react";
import { WorkerContext } from "./worker";

import type { Planet } from "../types";

export const PlanetsContext = createContext<{
    planets: { [key: string]: Planet },
    loopId: number
}>({
    planets: {},
    loopId: 0
})

interface ResultData {
    newPlanets: { [key: string]: Planet },
    loopId: number
}

const PlanetsProvider: React.FC<React.ReactNode> = ({children}) => {
    const worker = useContext(WorkerContext)
    const [planets, setPlanets] = useState<{ [key: string]: Planet }>({})
    const [loopId, setLoopId] = useState(0)

    const result = (data:ResultData) => {
        setPlanets(data.newPlanets)
        setLoopId(data.loopId)
    }

    useEffect(() => {
        const resultSymbol = worker.addListener('result', result)
        return () => {
            worker.removeListener(resultSymbol)
        }
    }, [worker])

    return (
        <PlanetsContext.Provider
            value={{
                planets,
                loopId
                
            }}
        >
            {children}
        </PlanetsContext.Provider>
    )
}

export default PlanetsProvider;
