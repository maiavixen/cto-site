<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { show = false, header, children, close } = $props();

	function handleContentClick(event: Event) {
		event.stopPropagation();
	}

	function handleContentKeydown(event: KeyboardEvent) {
		event.stopPropagation();
	}

	function handleGlobalKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && show) {
			close();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleGlobalKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleGlobalKeydown);
	});
</script>

{#if show}
	<!-- I get ARIA role issues here, not sure how to fix without turning the whole thing into a button. -->
	<div class="modal-overlay" onclick={() => close()}>
		<div
			class="modal-content"
			role="dialog"
			tabindex="0"
			onclick={handleContentClick}
			onkeydown={handleContentKeydown}
		>
			<header>
				{@render header()}
			</header>
			<main>
				{@render children?.()}
			</main>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal-content {
		background: white;
		padding: 1rem;
		max-width: 90%;
		max-height: 90%;
		min-width: 25%;
		overflow-y: auto;
		outline: none;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}
	main {
		padding: 0.5rem 0;
	}
</style>
