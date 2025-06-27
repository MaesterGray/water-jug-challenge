import { getContext, setContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

class AppState {
    animating = $derived(false);
    solutionFound = $state(false);
    visited = new SvelteSet<string>();
    capacityOfCupA = $state(1);
     capacityOfCupB = $state(1);
     capacityOfTarget = $state(1);
     animationArrayA:number[] = [];
     animationArrayB :number[] = [];
    framesLoopedA = $state(0);
    framesLoopedB = $state(0);
    searchingForSolution = $state();
    animationSpeed = $state(0.01);
    solutionPath:[number,number][] = $state([])
    parentMap = new Map<string, string>()
     
    findSolution(x: number, y: number, target: number){
        this.searchingForSolution = true;
        let arr = [[0, 0]];
        this.animationArrayA.push(0);
        this.animationArrayB.push(0);

        this.visited.add(arr[0].join(","));
        while (arr.length > 0) {
            let [i, j] = arr.shift() as number[];
    
            if(i === target || j === target || i+j === target){
                this.solutionFound = true;
                
                this.searchingForSolution = false;
                this.animating=true
                const path: [number, number][] = [];
let currentState = `${i},${j}`;
while (currentState) {
    const [a, b] = currentState.split(",").map(Number);
    path.push([a, b]);
    currentState = this.parentMap.get(currentState) ?? '';
}
path.reverse();

this.solutionPath = path;

                return;
            }
            let newState;
            let newAddToSet;
            // Empty 0
            newState = [0, j];
            this.animationArrayA.push(0);
            this.animationArrayB.push(j);
            newAddToSet = newState.join(",");
            if (!this.visited.has(newAddToSet)) {
                this.visited.add(newAddToSet);
                arr.push(newState);
            }
            // Empty 1
            newState = [i, 0];
            this.animationArrayA.push(i);
            this.animationArrayB.push(0);
            newAddToSet = newState.join(",");
            if (!this.visited.has(newAddToSet)) {
                this.visited.add(newAddToSet);
                arr.push(newState);
            }
            // Fill 0
            newState = [x, j];
            this.animationArrayA.push(x);
            this.animationArrayB.push(j);
            newAddToSet = newState.join(",");
            if (!this.visited.has(newAddToSet)) {
                this.visited.add(newAddToSet);
                arr.push(newState);
            }
    
            // Fill 1
            newState = [i, y];
            this.animationArrayA.push(i);
            this.animationArrayB.push(y);
            newAddToSet = newState.join(",");
            if (!this.visited.has(newAddToSet)) {
                this.visited.add(newAddToSet);
                arr.push(newState);
            }
    
            // 0->1
            let newY = ((j + i) >= y) ? y : j + i;
            newState = [i - (newY - j), newY];
            this.animationArrayA.push(i - (newY - j));
            this.animationArrayB.push(newY);
            newAddToSet = newState.join(",");
            if (!this.visited.has(newAddToSet)) {
                this.visited.add(newAddToSet);
                arr.push(newState);
            }
    
            // 1->0
            let newX = ((j + i) >= x) ? x : j + i;
            newState = [newX, j - (newX - i)];
            this.animationArrayA.push(newX);
            this.animationArrayB.push(j - (newX - i));
            newAddToSet = newState.join(",");
            if (!this.visited.has(newAddToSet)) {
                this.visited.add(newAddToSet);
                arr.push(newState);
            }
    
        }
        this.solutionFound = false;
        this.searchingForSolution = false;
        this.animating=true
        // this.visited.clear();
    }
    
}
export default AppState;


const APP_KEY = Symbol('appState');

export function setAppState(){
    return setContext(APP_KEY,new AppState());
}

export function getAppState(){
    return getContext<ReturnType<typeof setAppState>>(APP_KEY);
}