/* eslint-disable no-restricted-globals */

interface Planet {
    size: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color?: string;
}


export default function simulator() {
    let loopId:NodeJS.Timer
    let planets: Planet[] = []
    let speed = 1
    const SPEED_RADIUS = 200

    loopId = setTimeout(function loop() {
        const newPlanets = planets.map(planet => {
            return {
                size: planet.size,
                x: planet.x + planet.vx / SPEED_RADIUS,
                y: planet.y + planet.vy/ SPEED_RADIUS,
                vx: planet.vx,
                vy: planet.vy,
                color: planet.color
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
                planets.push(event.data.newPlanet)
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