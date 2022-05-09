/* eslint-disable no-restricted-globals */


let loopId = 0
let loopTimer
let planets = {}
let speed = 1
let isPlay = true
let speedRate = 500
let spaceG = 100

const getSquaredDistance = (planet, targetPlanet) => {
    return (planet.x - targetPlanet.x)**2 + (planet.y - targetPlanet.y)**2
}

const getDistance = (planet, targetPlanet) => {
    return Math.sqrt((planet.x - targetPlanet.x)**2 + (planet.y - targetPlanet.y)**2)
}

const getGravitationalAcceleration = (planet, targetPlanet) => {
    const r = getDistance(planet, targetPlanet)
    const g = spaceG * planet.mass * targetPlanet.mass / ( getSquaredDistance(planet, targetPlanet) )
    const sinA = (targetPlanet.y - planet.y) / r
    const cosA = (targetPlanet.x - planet.x) / r

    return {
        ax: g * cosA,
        ay: g * sinA
    }
}

function simulationLoop() {
    loopId++
    const newPlanets = {...planets}

    // 주요 로직
    planetLoop:
    for (let planetId of Object.keys(planets)) {
        const planet = newPlanets[planetId]
        if ( !planet ) continue // 삭제된 행성 계산 무시
        if ( planet.isFixed ) continue // 고정된 행성 무시
        
        // 다른 사물간의 상호작용
        for (let [targetPlanetId, targetPlanet] of Object.entries(newPlanets)) {
            if (targetPlanetId === planetId) continue

            // 충돌 감지
            if (getSquaredDistance(planet, targetPlanet) < (planet.radius + targetPlanet.radius)**2) {
                const mass = newPlanets[planetId].mass + newPlanets[targetPlanetId].mass
                const radius = Math.round(Math.sqrt(newPlanets[planetId].radius**2 + newPlanets[targetPlanetId].radius**2))

                if (planet.mass >= targetPlanet.mass && !targetPlanet.isFixed) {
                    newPlanets[planetId].mass = mass
                    newPlanets[planetId].radius = radius
                    delete newPlanets[targetPlanetId]
                } else {
                    if (targetPlanet.isFixed) {
                        newPlanets[targetPlanetId].mass = mass
                        delete newPlanets[planetId]
                    } else {
                        newPlanets[targetPlanetId].mass = mass
                        newPlanets[targetPlanetId].radius = radius
                        delete newPlanets[planetId]
                    }
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
            ...planets[planetId],
            x: planet.x + planet.vx / speedRate,
            y: planet.y + planet.vy / speedRate,
        }
    }

    planets = newPlanets
    self.postMessage({kind: 'newPlanets', planets: newPlanets})
}

let updateRateCount = 0
let updateRateStartTime = new Date()
const loop = () => {
    if (updateRateCount === 0) updateRateStartTime = new Date()

    isPlay && simulationLoop()
    updateRateCount++ 

    if (updateRateCount === 60) {
        updateRateCount = 0
        const updateRate = Math.round(60 / (new Date() - updateRateStartTime) * 1000)
        self.postMessage({kind: 'ups', ups: updateRate})
    }
}

const reset = () => {
    planets = {}
    loopId = 0
    loopTimer && clearInterval(loopTimer)
    loopTimer = setInterval(loop, Math.round(16.6 / speed))
    self.postMessage({kind: 'spaceG', spaceG: spaceG})
    self.postMessage({kind: 'speedRate', speedRate: speedRate})
}

// IO
self.addEventListener('message', event => {
    switch (event.data.kind) {
        case 'ping':
            reset()
            self.postMessage({kind: 'pong'})
            break

        case 'planetAdd':
            planets[event.data.newPlanet.id] = event.data.newPlanet.data
            self.postMessage({kind: 'newPlanets', planets: planets})
            break

        case 'planetList':
            planets = event.data.newPlanetList
            break

        case 'speedUpdate':
            speed = event.data.speed;
            loopTimer && clearInterval(loopTimer)
            loopTimer = setInterval(loop, Math.round(16 / speed))
            break

        case 'stopSimulate':
            clearInterval(loopTimer)
            break

        case 'isPlay':
            isPlay = event.data.isPlay
            break

        case 'reset':
            reset()
            break

        case 'updateSpaceG':
            spaceG = event.data.value
            console.log('updateSpaceG', spaceG)
            break

        case 'updateSpeedRate':
            speedRate = event.data.value
            console.log('updateSpeedRate', speedRate)
            break

        case 'SquawkYourParrot':
            self.postMessage({kind: 'Squawk', data: {
                loopId,
                planets,
                speed,
                isPlay,
                speedRate,
                spaceG
            }})
            console.log( {
                loopId,
                planets,
                speed,
                isPlay,
                speedRate,
                spaceG
            })
            break

        default:
            console.error(`Wrong Command: '${event.data.kind}' `)
    }
})
