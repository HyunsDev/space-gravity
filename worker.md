# Worker Message

## Main Thread -> Worker Thread
---
|code|설명|data|
|-|-|-|
|reset|시뮬레이터를 초기화합니다.||
|ping|시뮬레이터가 실행 여부를 요청합니다.||
|play|일시정지된 시뮬레이터를 계속 실행합니다||
|pause|시뮬레이터를 일시정지합니다.||
|updateSpeed|시뮬레이션 속도를 변경합니다.|{ speed: number }|
|addPlanet|새로운 행성을 추가합니다|{ 행성 }|
|updateSpaceG|중력가속도를 변경합니다|value|
|updateSpeedRate|SpeedRate를 변경합니다|value|
|SquawkYourParrot|시뮬레이션의 정보를 요청합니다|

## Worker Thread
---
|code|설명|data|
|-|-|-|
|result|시뮬레이터 결과|{ 시뮬레이터 결과 }|