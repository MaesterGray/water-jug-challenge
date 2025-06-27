<script lang="ts">
    import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
    import { getAppState } from '$lib/app-state.svelte';
    import type { DotLottie } from '@lottiefiles/dotlottie-svelte';
    import { animate, checkInputValidity } from '$lib/helpers';
	import { browser } from '$app/environment'; 
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    let appState = getAppState();
    let pauseCalls = $state(0)
    let inputOfCupAIsInvalid = $state(false);
    let inputOfCupBIsInvalid = $state(false);
    let inputOfTargetIsInvalid = $state(false);
    let inputForCupA:HTMLInputElement | null
    let inputForCupB:HTMLInputElement | null
    let inputForTarget:HTMLInputElement | null
     let dotLottieA:DotLottie | null = null
     let dotLottieB:DotLottie | null = null
    let presentFrameDirectionA = $state<'up'|'down'|'static'>('static');
    let presentFrameDirectionB = $state<'up'|'down'|'static'>('static');

    function onLoaded(cup:'cupA'|'cupB') {
        if(cup === 'cupA'){
            dotLottieA?.setFrame(0);
        }else{
            
            dotLottieB?.setFrame(0);
        }
    }

    function onPause(cup: 'cupA' | 'cupB') {
    if (cup === 'cupA') {
        if (appState.framesLoopedA >= appState.animationArrayA.length - 1) {
            // appState.animating = false;
        } else {

                appState.framesLoopedA++;
            
        }
    } else {
        if (appState.framesLoopedB >= appState.animationArrayB.length - 1) {
            // appState.animating = false;
        } else {
            
                appState.framesLoopedB++;
            
        }
    }
}

 
    function setupListeners(dotLottieInstance:DotLottie,cup:'cupA'|'cupB') {
        dotLottieInstance.addEventListener('load', ()=>onLoaded(cup));
        dotLottieInstance.addEventListener('pause', (e)=>onPause(cup));
    }

    function handleReset(){
        appState.animating = false;
        appState.solutionFound = false;
        appState.visited.clear();
        appState.solutionPath = [];
        appState.parentMap.clear();
        appState.framesLoopedA = 0;
        appState.framesLoopedB = 0;
        appState.animationArrayA = [];
        appState.animationArrayB = [];
        appState.capacityOfCupA = 1;
        appState.capacityOfCupB = 1;
        appState.capacityOfTarget = 1;
    }
    // $inspect(appState.visited)
    $inspect(appState.animating)
    $inspect(appState.searchingForSolution)
    $inspect(appState.solutionPath)
    // $inspect(appState.framesLoopedB)
    // $inspect(appState.visited)
    // $inspect(pauseCalls)
    // $inspect(appState.solutionFound)
    // $inspect(appState.searchingForSolution)
    // $inspect(animationArrayA)
    // $inspect(animationArrayB)
    // $inspect(appState.framesLoopedA)
    // $inspect(appState.framesLoopedB)
    // $inspect(appState.animating)
    $effect(()=>{
       animate(dotLottieA!, appState, presentFrameDirectionA)
    })
    $effect(()=>{
       animate(dotLottieB!, appState, presentFrameDirectionB)
    })
   $effect(()=>{
    if(appState.framesLoopedA === appState.animationArrayA.length ){
        appState.animating = false;    }
    if(appState.framesLoopedB === appState.animationArrayB.length ){
        appState.animating = false;
    }
   })

    
      


    function handleFindSolution(){
        if(checkInputValidity(appState.capacityOfCupA) && checkInputValidity(appState.capacityOfCupB) && checkInputValidity(appState.capacityOfTarget)){
            appState.findSolution(appState.capacityOfCupA,appState.capacityOfCupB,appState.capacityOfTarget)
        }else{
            inputOfCupAIsInvalid = true;
            inputOfCupBIsInvalid = true;
            inputOfTargetIsInvalid = true;
        }
    }
if(browser){
    $effect(() => {
        if (inputForCupA) {
            inputForCupA.addEventListener('focus', () => {
                if (inputOfCupAIsInvalid) {
                    inputOfCupAIsInvalid = false;
                }
            });
        }
        if (inputForCupB) {
            inputForCupB.addEventListener('focus', () => {
                if (inputOfCupBIsInvalid) {
                    inputOfCupBIsInvalid = false;
                }
            });
        }
        if (inputForTarget) {
            inputForTarget.addEventListener('focus', () => {
                if (inputOfTargetIsInvalid) {
                    inputOfTargetIsInvalid = false;
                }
            });
        }
    });
}

function handleViewSolution(){
      appState.visited.clear() 
}
</script>

<Dialog.Root open={ !appState.searchingForSolution && appState.visited.size > 0}>
    <Dialog.Content>
        <Dialog.Title>{appState.solutionFound ? '🎉 We found a solution!' : '😕 No solution found'}</Dialog.Title>
        {#if appState.solutionFound}
        <Dialog.Description>
            View the solution route below:
        </Dialog.Description>
        {/if}
        <div class="flex flex-col items-center justify-center gap-y-6 p-5 bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 font-[\'Comic Neue\']">
            <button onclick={handleReset} class="rounded-full bg-purple-500 px-8 py-3 text-white font-bold shadow-lg hover:bg-purple-600 transition-all">
                ✨ Reset
            </button>
            {#if appState.solutionFound}
                <button class="rounded-full bg-purple-500 px-8 py-3 text-white font-bold shadow-lg hover:bg-purple-600 transition-all" onclick={handleViewSolution}>
                    View Solution Route
                </button>
            {/if}
        </div>
    </Dialog.Content>
</Dialog.Root>
<div class="flex  flex-col items-center justify-center gap-y-6 p-5 bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 font-[\'Comic Neue\']">
    <h1 class="text-center text-4xl font-extrabold text-blue-600 drop-shadow-md">💧 Water Jug Wizard!</h1>
    <p class="max-w-2xl text-center text-lg text-gray-700">Solve the classic riddle with a splash of fun! Enter two jug sizes and a target, then let the magic happen.</p>

    <div class="flex w-full max-w-md justify-center gap-4">
        <div class="flex w-1/2 flex-col items-center aspect-square bg-white rounded-xl shadow-md p-2">
            <p class="font-bold text-blue-700">Cup A {appState.animationArrayA[appState.framesLoopedA]}/{appState.capacityOfCupA}</p>
            <DotLottieSvelte dotLottieRefCallback={(ref)=>{dotLottieA = ref ; setupListeners(dotLottieA,'cupA');}}  src="filling-cup-animation.json"  mode={presentFrameDirectionA==='up'?'forward':'reverse'}/>
        </div>
        <div class="flex w-1/2 flex-col items-center aspect-square bg-white rounded-xl shadow-md p-2">
            <p class="font-bold text-pink-700">Cup B {appState.animationArrayB[appState.framesLoopedB]}/{appState.capacityOfCupB}</p>
            <DotLottieSvelte dotLottieRefCallback={(ref)=>{dotLottieB = ref ; setupListeners(dotLottieB,'cupB');}} src="filling-cup-animation.json" mode={presentFrameDirectionB==='up'?'forward':'reverse'}/>
        </div>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-4">
        <label class="flex flex-col items-start gap-1" for="cupA">
            <span class={inputOfCupAIsInvalid ? 'text-red-500 font-semibold' : 'text-gray-800'}>{inputOfCupAIsInvalid ? '🚫 Invalid input' : '🢨 Capacity of Cup A'}</span>
            <input bind:this={inputForCupA} type="number" name="cupA" bind:value={appState.capacityOfCupA} class="rounded border px-2 py-1 shadow-inner" />
        </label>
        <label class="flex flex-col items-start gap-1" for="cupB">
            <span class={inputOfCupBIsInvalid ? 'text-red-500 font-semibold' : 'text-gray-800'}>{inputOfCupBIsInvalid ? '🚫 Invalid input' : '🥤 Capacity of Cup B'}</span>
            <input bind:this={inputForCupB} type="number" name="cupB" bind:value={appState.capacityOfCupB} class="rounded border px-2 py-1 shadow-inner" />
        </label>
        <label class="flex flex-col items-start gap-1" for="target">
            <span class={inputOfTargetIsInvalid ? 'text-red-500 font-semibold' : 'text-gray-800'}>{inputOfTargetIsInvalid ? '🚫 Invalid input' : '🎯 Target Capacity'}</span>
            <input bind:this={inputForTarget} type="number" name="target" bind:value={appState.capacityOfTarget} class="rounded border px-2 py-1 shadow-inner" />
        </label>
    </div>

    
    <button onclick={handleFindSolution} disabled={appState.animating} class="mt-6 rounded-full bg-purple-500 px-8 py-3 text-white font-bold shadow-lg hover:bg-purple-600 transition-all">
        ✨ Find Solution
    </button>
    {#if  appState.solutionFound}
    <div class="mt-8 w-full max-w-2xl">
        <h2 class="text-xl font-bold text-blue-800 mb-4">🔍 Solution</h2>
        <table class="w-full table-auto border-collapse bg-white shadow rounded">
            <thead>
                <tr class="bg-blue-100">
                    <th class="border px-4 py-2 text-left">Step</th>
                    <th class="border px-4 py-2 text-left">Jug A</th>
                    <th class="border px-4 py-2 text-left">Jug B</th>
                </tr>
            </thead>
            <tbody>
                {#each appState.solutionPath as [a, b], index}
                <tr class="hover:bg-blue-50">
                    <td class="border px-4 py-2">{index + 1}</td>
                    <td class="border px-4 py-2">{a}</td>
                    <td class="border px-4 py-2">{b}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
    {/if}
</div>
