/* eslint-disable no-restricted-globals */


let loopId
let planets = {}
let speed = 1
let isPlay = true
const SPEED_RADIUS = 200
const SPACE_G = 100

const getSquaredDistance = (planet, targetPlanet) => {
    return (planet.x - targetPlanet.x)**2 + (planet.y - targetPlanet.y)**2
}

const getDistance = (planet, targetPlanet) => {
    return Math.sqrt((planet.x - targetPlanet.x)**2 + (planet.y - targetPlanet.y)**2)
}

const getGravitationalAcceleration = (planet, targetPlanet) => {
    const r = getDistance(planet, targetPlanet)
    const g = SPACE_G * planet.weight * targetPlanet.weight / ( getSquaredDistance(planet, targetPlanet) )
    const sinA = (targetPlanet.y - planet.y) / r
    const cosA = (targetPlanet.x - planet.x) / r

    return {
        ax: g * cosA,
        ay: g * sinA
    }
}

function simulationLoop() {
    const newPlanets = {...planets}

    // 주요 로직
    planetLoop:
    for (let planetId of Object.keys(planets)) {
        const planet = newPlanets[planetId]
        if ( !planet ) continue // 삭제된 행성 계산 무시

        
        // 다른 사물간의 상호작용
        for (let [targetPlanetId, targetPlanet] of Object.entries(newPlanets)) {
            if (targetPlanetId === planetId) continue

            // 충돌 감지
            if (getSquaredDistance(planet, targetPlanet) < (planet.radius + targetPlanet.radius)**2) {
                const weight = newPlanets[planetId].weight + newPlanets[targetPlanetId].weight
                const radius = Math.round(Math.sqrt(newPlanets[planetId].radius**2 + newPlanets[targetPlanetId].radius**2))

                if (planet.weight >= targetPlanet.weight) {
                    newPlanets[planetId].weight = weight
                    newPlanets[planetId].radius = radius
                    delete newPlanets[targetPlanetId]
                } else {
                    newPlanets[targetPlanetId].weight = weight
                    newPlanets[targetPlanetId].radius = radius
                    delete newPlanets[planetId]
                    continue planetLoop;
                }
                continue
            }

            // 중력 가속도
            const a = getGravitationalAcceleration(planet, targetPlanet)
            newPlanets[planetId].vx = newPlanets[planetId].vx + a.ax
            newPlanets[planetId].vy = newPlanets[planetId].vy + a.ay
        }

        newPlanets[planetId] =  {
            weight: planet.weight,
            radius: planet.radius,
            x: planet.x + planet.vx / SPEED_RADIUS,
            y: planet.y + planet.vy / SPEED_RADIUS,
            vx: planet.vx,
            vy: planet.vy,
            color: planet.color
        }
    }

    planets = newPlanets
    self.postMessage({kind: 'newPlanets', planets: newPlanets})
}

loopId = setTimeout(function loop() {
    simulationLoop()
    setTimeout(loop, 128/speed)
}, 1024/speed)

// IO
self.addEventListener('message', event => {
    switch (event.data.kind) {
        case 'ping':
            self.postMessage({kind: 'pong'})
            break

        case 'planetAdd':
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
            console.error(`Wrong Command: '${event.data.kind}' `)
    }
})
