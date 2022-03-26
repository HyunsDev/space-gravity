/* eslint-disable no-restricted-globals */



interface Planet {
    weight: number;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color?: string;
}

export default function simulator() {
    let loopId:NodeJS.Timer
    let planets: {[key: string]: Planet} = {}
    let speed = 1
    const SPEED_RADIUS = 200
    const SPACE_G = 1

    const getSquaredDistance = (planet:Planet, targetPlanet: Planet) => {
        return Math.round((planet.x - targetPlanet.x)**2 + (planet.y - targetPlanet.y)**2)
    }

    // const getVector = ( a1, a2 ) => {

    // }


    const getGravitationalAcceleration = (planet:Planet, targetPlanet: Planet) => {
        return {
            ax: - SPACE_G * planet.weight * targetPlanet.weight * ( planet.x - targetPlanet.x ) / Math.abs((planet.x - targetPlanet.x))**3,
            ay: - SPACE_G * planet.weight * targetPlanet.weight * ( planet.y - targetPlanet.y ) / Math.abs((planet.y - targetPlanet.y))**3
        }
    }

    loopId = setTimeout(function loop() {
        const newPlanets: {[key: string]: Planet} = {...planets}

        // 주요 로직
        Object.keys(planets).forEach(planetId => {
            const planet = newPlanets[planetId]
            if ( !planet ) return // 삭제된 행성 계산 무시

            newPlanets[planetId] =  {
                weight: planet.weight,
                radius: planet.radius,
                x: planet.x + planet.vx / SPEED_RADIUS,
                y: planet.y + planet.vy / SPEED_RADIUS,
                vx: planet.vx,
                vy: planet.vy,
                color: planet.color
            }

            for (let [targetPlanetId, targetPlanet] of Object.entries(newPlanets)) { // 충돌 감지 & 중력
                if (targetPlanetId === planetId) continue

                // 충돌 감지
                if (getSquaredDistance(planet, targetPlanet) < (planet.radius + targetPlanet.radius)**2) {
                    const weight = newPlanets[planetId].weight + newPlanets[targetPlanetId].weight
                    const radius = Math.round(Math.sqrt(newPlanets[planetId].radius**2 + newPlanets[targetPlanetId].radius**2))

                    if (planet.radius >= targetPlanet.radius) {
                        newPlanets[planetId].weight = weight
                        newPlanets[planetId].radius = radius
                        delete newPlanets[targetPlanetId]
                    } else {
                        newPlanets[targetPlanetId].weight = weight
                        newPlanets[targetPlanetId].radius = radius
                        delete newPlanets[planetId]
                    }

                    continue
                }

                // 중력 가속도
                const a = getGravitationalAcceleration(planet, targetPlanet)
                newPlanets[planetId].vx = newPlanets[planetId].vx + a.ax
                newPlanets[planetId].vy = newPlanets[planetId].vy + a.ay
            }
        })

        planets = newPlanets
        self.postMessage({kind: 'newPlanets', planets: newPlanets})
        setTimeout(loop, 128/speed)
    }, 128/speed)

    // IO
    self.addEventListener('message', event => {
        switch (event.data.kind) {
            case 'planetAdd':
                // self.postMessage(event.data.planets)
                console.log(event.data.newPlanet.data)
                planets[event.data.newPlanet.id] = event.data.newPlanet.data
                break

            case 'speedUpdate':
                speed = event.data.speed;
                break

            case 'stopSimulate':
                clearInterval(loopId)
                break

            default:
                console.error('Wrong Command')
        }
    })
}