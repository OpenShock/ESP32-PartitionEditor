<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton";
    import type { Partition } from "./Partition";
    import { SelectColor, ToBytes, ToHex } from "./Utils";

    interface ViewPartition extends Partition {
        color: string;
        invalid: boolean;
        sizeStr: string;
        offsetStr: string;
        backgroundStyle: string;
        style: string;
    }

    export let edit: boolean = false;
	export let flashSize: number;
	export let flashStart: number;
    export let partitions: Partition[];

    let hoveredPartition: Partition | null = null;

    const modalStore = getModalStore();

    function GenerateViewPartitions(partitions: Partition[], flashSize: number): ViewPartition[] {
        const viewPartitions: ViewPartition[] = [];

        let cursor = flashStart;

        for (let i = 0; i < partitions.length; i++) {
            const partition = partitions[i];

            const size = partition.size;
            const offset = partition.offset;

            let sizeStr = ToHex(size) + ' (' + ToBytes(size) + ')';
            let offsetStr = ToHex(offset) + ' (' + ToBytes(offset) + ')';
            const color = SelectColor(i, partitions.length);
            const backgroundStyle = `background: ${color};`;

            let invalid = false;
            if (offset + size > flashSize) {
                sizeStr = 'INVALID (too large)';
                offsetStr = 'INVALID (too large)';
                invalid = true;
            }
            if (offset < cursor) {
                offsetStr = 'INVALID (overlaps)';
                invalid = true;
            }
            
            viewPartitions.push({
                ...partition,
                color,
                invalid,
                sizeStr,
                offsetStr,
                backgroundStyle,
                style: `left: ${(offset / flashSize) * 100}%; width: ${(size / flashSize) * 100}%; ${backgroundStyle}`
            });

            cursor = offset + size;
        }

        return viewPartitions;
    }

    function AddPartition() {
        let name = 'new';

        for (let i = 0; i < partitions.length; i++) {
            if (partitions.findIndex((p) => p.name === name) < 0) {
                break;
            }

            name = `new (${i})`;
        }

        partitions = [...partitions, { name, type: 'data', subType: 'data', offset: -1, size: 0x1000 }];
    }
    function EditPartition(partition: Partition) {
        modalStore.trigger({
            type: 'component',
            component: 'partitionEditor',
            meta: { partition },
            response: (r) => {
                if (!r) return;
                const part = r as Partition;
                // Find the definition, and update it
                const index = partitions.findIndex((p) => p.name === part.name);
                if (index >= 0) {
                    partitions[index] = part;
                }
                partitions = [...partitions];
            }
        });
    }
    function DeletePartition(partition: Partition) {
        // Find the definition, and remove it
        const index = partitions.findIndex((p) => p.name === partition.name);
        if (index >= 0) {
            partitions.splice(index, 1);
        }

        partitions = [...partitions];
    }
    function AlignPartitions() {
        let cursor = flashStart;

        for (let i = 0; i < partitions.length; i++) {
            const partition = partitions[i];

            partition.offset = cursor;

            cursor += partition.size;
        }

        partitions = [...partitions];
    }

	$: viewPartitions = GenerateViewPartitions(partitions, flashSize);
</script>

<div class="w-full space-y-5 text-center flex flex-col items-center">
    {#if edit}
        <div class="flex justify-between w-full">
            <button class="btn variant-filled-primary" on:click={AddPartition}>
                Add Partition
            </button>
            <button class="btn variant-filled-primary" on:click={AlignPartitions}>
                Align Partitions
            </button>
        </div>
    {/if}

    <div class="w-[100%] h-16 bg-black relative">
        {#each viewPartitions as partition (partition.name)}
            <div class={'absolute top-0 bottom-0' + (partition.name == hoveredPartition?.name ? ' scale-y-125' : '')} style={partition.style}>

            </div>
        {/each}
    </div> 

    <table class="table table-hover">
        <colgroup>
            <col span="1" class="w-[5%]" /> <!-- Color -->
            <col span="1" class="w-[30%]" /> <!-- Name -->
            <col span="1" class="w-[10%]" /> <!-- Type -->
            <col span="1" class="w-[10%]" /> <!-- SubType -->
            <col span="1" class="w-[20%]" /> <!-- Offset -->
            <col span="1" class="w-[20%]" /> <!-- Size -->
            {#if edit}
                <col span="1" class="w-[5%]" /> <!-- Actions -->
            {/if}
        </colgroup>
        <thead>
            <tr>
                <th>Color</th>
                <th>Name</th>
                <th>Type</th>
                <th>SubType</th>
                <th>Offset</th>
                <th>Size</th>
                {#if edit}
                    <th></th>
                {/if}
            </tr>
        </thead>
        <tbody>
            {#each viewPartitions as partition (partition.name)}
                <tr class={'font-bold text-left cursor-pointer' + (partition.invalid ? ' text-red-500' : '')} on:mouseenter={() => hoveredPartition = partition} on:mouseleave={() => hoveredPartition = null}>
                    <td style={partition.backgroundStyle}></td>
                    <td>{partition.name}</td>
                    <td>{partition.type}</td>
                    <td>{partition.subType}</td>
                    <td>{partition.offsetStr}</td>
                    <td>{partition.sizeStr}</td>
                    {#if edit}
                        <td class="flex gap-2">
                            <button class="btn variant-filled-primary" on:click={() => EditPartition(partition)}>
                                Edit
                            </button>
                            <button class="btn variant-filled-primary" on:click={() => DeletePartition(partition)}>
                                Delete
                            </button>
                        </td>
                    {/if}
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <tr class="font-bold text-left">
                <td colspan="5">Total</td>
                <td>{ToHex(flashSize)}</td>
            </tr>
        </tfoot>
    </table>
</div>