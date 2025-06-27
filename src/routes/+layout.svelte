<script lang="ts">
	import '../app.css';

	let { children } = $props();
	import { setAppState } from '$lib/app-state.svelte';
    setAppState();
</script>

<div class='flex-1'>
	{@render children()}

</div>
