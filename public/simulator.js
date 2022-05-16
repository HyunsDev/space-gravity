/* eslint-disable no-restricted-globals */


let loopId = 0
let loopTimer
let planets = {}
let speed = 1
let isPlay = true
let speedRate = 500
let spaceG = 100
let trajectoryStep = 5
let trajectoryLength = 50

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
        ax: g * cosA / planet.mass,
        ay: g * sinA / planet.mass
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

        if (loopId % trajectoryStep === 0) {
            while (Object.keys(planet.trajectory).length >= trajectoryLength) {
                planet.trajectory.shift()
            }

            planet.trajectory.push({x: planet.x, y: planet.y})
        }

        newPlanets[planetId] =  {
            ...planets[planetId],
            x: planet.x + planet.vx / speedRate,
            y: planet.y + planet.vy / speedRate,
        }
    }

    planets = newPlanets
    self.postMessage({code: 'result', data: {
        loopId,
        newPlanets
    }})
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
        self.postMessage({code: 'ups', data: updateRate})
    }
}

const reset = () => {
    planets = {}
    loopId = 0
    loopTimer && clearInterval(loopTimer)
    loopTimer = setInterval(loop, Math.round(16.6 / speed))
    self.postMessage({code: 'spaceG', spaceG: spaceG})
    self.postMessage({code: 'speedRate', speedRate: speedRate})
}

// IO
self.addEventListener('message', event => {
    switch (event.data.code) {
        case 'ping':
            reset()
            self.postMessage({code: 'pong'})
            break

        case 'addPlanet':
            planets[event.data.data.id] = event.data.data.data
            self.postMessage({code: 'result', data: {
                loopId,
                newPlanets: planets
            }})
            break

        case 'planetList':
            console.log(planets, event.data.data)
            planets = event.data.data
            break

        case 'updateSpeed':
            speed = event.data.speed;
            loopTimer && clearInterval(loopTimer)
            loopTimer = setInterval(loop, Math.round(16 / speed))
            break

        case 'stopSimulate':
            clearInterval(loopTimer)
            break

        case 'pause':
            isPlay = false
            break

        case 'play':
            isPlay = true
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

        case 'updateTrajectoryStep':
            trajectoryStep = event.data.data
            break

        case 'updateTrajectoryLength':
            trajectoryLength = event.data.data
            break

        case 'SquawkYourParrot':
            self.postMessage({code: 'Squawk', data: {
                loopId,
                planets,
                speed,
                isPlay,
                speedRate,
                spaceG,
                trajectoryStep,
                trajectoryLength
            }})
            console.log( {
                loopId,
                planets,
                speed,
                isPlay,
                speedRate,
                spaceG,
                trajectoryStep,
                trajectoryLength
            })
            break

        case 'extractReq':
            self.postMessage({code: 'extract', data: {
                planets
            }})
            break

        default:
            console.error(`Wrong Command: '${event.data.code}' `)
    }
})
