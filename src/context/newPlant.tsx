import React, { createContext, useState } from "react";

export const NewPlanetContext = createContext({
    isCreating: false,
})

const NewPlanetProvider: React.FC<React.ReactNode> = ({children}) => {
    const [isCreating, setCreating] = useState(false)
    const [speed, setSpeed] = useState(3)
    const [radius, setRadius] = useState(16)
    const [mass, setMass] = useState(32)

    return (
        <NewPlanetContext.Provider
            value={{
                isCreating,
                
                
            }}
        >
            {children}
        </NewPlanetContext.Provider>
    )
}

export default NewPlanetProvider;