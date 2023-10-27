<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
    import type { Partition } from './Partition';

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

    const partition = $modalStore[0]?.meta?.partition as Partition | undefined;

	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(partition);
		modalStore.close();
	}
</script>

{#if partition}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<header class="text-2xl font-bold">Editing: {partition.name}</header>

		<form class="border border-surface-500 p-4 space-y-4 rounded-container-token">
			<label class="label">
				<span>Name</span>
				<input class="input" type="text" bind:value={partition.name} placeholder="Enter name..." />
			</label>
			<label class="label">
				<span>Type</span>
                <select class="input" bind:value={partition.type}>
                    <option value="app">Application</option>
                    <option value="data">Data</option>
                </select>
			</label>
			<label class="label">
                <span>Sub-Type</span>
                <input class="input" type="text" bind:value={partition.subType} placeholder="Enter sub-type..." />
			</label>
            <label class="label">
                <span>Offset</span>
                <input class="input" type="number" bind:value={partition.offset} placeholder="Enter offset..." />
            </label>
            <label class="label">
                <span>Size</span>
                <input class="input" type="number" bind:value={partition.size} placeholder="Enter size..." />
            </label>
		</form>
        
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={() => modalStore.close()}>Cancel</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Apply</button>
    </footer>
	</div>
{/if}