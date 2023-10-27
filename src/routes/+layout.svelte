<script lang="ts">
  import ParitionEditorModal from '$lib/ParitionEditorModal.svelte';
	import '../app.postcss';
	import { AppShell, Modal, initializeStores, type ModalComponent } from '@skeletonlabs/skeleton';

	initializeStores();

	const modalRegistry: Record<string, ModalComponent> = {
		partitionEditor: { ref: ParitionEditorModal }
	};
</script>

<Modal position="bl" components={modalRegistry} />

<!-- App Shell -->
<AppShell>
	<slot />
</AppShell>
