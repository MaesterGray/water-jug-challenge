import type { DotLottie } from '@lottiefiles/dotlottie-svelte';
import type AppState from './app-state.svelte';

export type Frame ={
    from:number,
    to:number,
    duration:number,
    speed:number,
    direction:'up'|'down'|'static'
}

export function calculateDuration(
    from: number,
    to: number,
    capacity: number,
    ): number {
    const minDuration = 500; 
    
    const relativeChange = Math.abs(to - from) / capacity;
    
    const scaledDuration = relativeChange * 2000;
    
    return Math.max(minDuration, scaledDuration);
    }

export function createAnimationFrames(animationArray:number[],capacity:number,lottieInstance:DotLottie,adjacentAnimationArray:number[],adjacentCapacity:number){
    let arr:Frame[] = [];
    console.log(animationArray.length,'array-length')
    for(let i = 0; i < animationArray.length; i++){
        arr.push({
            from: animationArray[i],
            to: animationArray[i+1],
            duration: animationArray[i] === animationArray[i+1] ? 0 : calculateDuration(animationArray[i],animationArray[i+1],capacity),
            direction: determineDirection(animationArray[i],animationArray[i+1]),
            speed: calcSpeed(calculateDuration(animationArray[i],animationArray[i+1],capacity),calculateDuration(adjacentAnimationArray[i],adjacentAnimationArray[i+1],adjacentCapacity))
        })
    }
    return  arr;
}

export function calcSpeed(duration: number, adjacentDuration: number): number {
    const baseSpeed = 2000;
  
    if (duration === adjacentDuration) return baseSpeed;
  
    return baseSpeed * (duration / adjacentDuration);
  }
          function determineDirection(from:number,to:number){
              if(from === to){
                  return 'static';
              }
              if(from > to){
                  return 'down';
              }
              return 'up';
          }
      export function playAnimation(lottieInstance:DotLottie,speed:number,frame:number,direction:'up'|'down'|'static',directionState:'up'|'down'|'static',framesLooped:number,adjacentFramesArray:Frame[]){
          lottieInstance.setSpeed(speed);
          lottieInstance.setFrame(frame);
          lottieInstance.play()
          if(directionState === 'static'){
              let durationToWait = adjacentFramesArray[framesLooped].duration;
              setTimeout(() => {
                  lottieInstance.pause();
              }, durationToWait);
          }
      }
  
      export function animate(lottieInstance:DotLottie, appState:AppState, directionState:'up'|'down'|'static'){
          new Promise<void>((resolve, reject) => {
              if(appState.animating){
                  let framesArray = createAnimationFrames(
                    appState.animationArrayA,
                    appState.capacityOfCupA,
                    lottieInstance,
                    appState.animationArrayB,
                    appState.capacityOfCupB
                  );
                  let adjacentFramesArray = createAnimationFrames(
                    appState.animationArrayB,
                    appState.capacityOfCupB,
                    lottieInstance,
                    appState.animationArrayA,
                    appState.capacityOfCupA
                  );
                  playAnimation(
                    lottieInstance,
                    framesArray[appState.framesLoopedA].speed,
                    framesArray[appState.framesLoopedA].from,
                    framesArray[appState.framesLoopedA].direction,
                    directionState,
                    appState.framesLoopedA,
                    adjacentFramesArray
                  );
                  setTimeout(() => {
                      lottieInstance.pause();
                  }, framesArray[appState.framesLoopedA].duration);
              }
          })
      }

   export function checkInputValidity(value:number){
        if(typeof value === 'number'  && Number.isInteger(value)){
            return true;
        }
        return false;
    }