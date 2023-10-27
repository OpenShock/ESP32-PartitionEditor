<script lang="ts">
	import { GenerateCSV, ToHex } from "$lib/Utils";
	import { AppBar, CodeBlock } from "@skeletonlabs/skeleton";
	import type { Partition } from "../lib/Partition";
	import PartitionsEditor from "../lib/PartitionsEditor.svelte";

	enum Mode {
		None,
		Edit,
		Export
	}
	let mode: Mode = Mode.None;

	let flashSize = 0x400000;
	let flashStart = 0x9000;
	let partitions: Partition[] = [
		{ name: 'nvs', type: 'data', subType: 'nvs', offset: -1, size: 0x5000 },
		{ name: 'otadata', type: 'data', subType: 'ota', offset: -1, size: 0x2000 },
		{ name: 'app0', type: 'app', subType: 'ota_0', offset: -1, size: 0x300000 },
		{ name: 'spiffs', type: 'data', subType: 'spiffs', offset: -1, size: 0xE0000 },
		{ name: 'coredump', type: 'data', subType: 'coredump', offset: -1, size: 0x10000 }
	];

	$: csv = GenerateCSV(
		['# Name', 'Type', 'SubType', 'Offset', 'Size', 'Flags'],
		partitions.map((p) =>
			[p.name, p.type, p.subType, ToHex(p.offset), ToHex(p.size), '']
		)
	);
</script>

<AppBar>
	<svelte:fragment slot="trail">
		{#if mode === Mode.None}
			<button class="btn variant-filled-secondary" on:click={() => mode = Mode.Edit}>Edit</button>
			<button class="btn variant-filled-secondary" on:click={() => mode = Mode.Export}>Export</button>
		{:else if mode === Mode.Edit}
			<button class="btn variant-filled-secondary" on:click={() => mode = Mode.None}>Back</button>
			<button class="btn variant-filled-secondary" on:click={() => mode = Mode.Export}>Export</button>
		{:else if mode === Mode.Export}
			<button class="btn variant-filled-secondary" on:click={() => mode = Mode.None}>Back</button>
			<button class="btn variant-filled-secondary" on:click={() => mode = Mode.Edit}>Edit</button>
		{/if}
	</svelte:fragment>
</AppBar>
<div class="container h-full mx-auto flex justify-center items-center">
	{#if mode === Mode.None}
		<PartitionsEditor {flashSize} {flashStart} bind:partitions={partitions} />
	{:else if mode === Mode.Edit}
		<PartitionsEditor edit {flashSize} {flashStart} bind:partitions={partitions} />
	{:else if mode === Mode.Export}
		<CodeBlock language="csv" code={csv} class="text-left" />
	{/if}
</div>