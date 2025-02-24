<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let show = false;
    const dispatch = createEventDispatcher();
  
    function close() {
      dispatch('close');
    }
  
    function handleContentClick(event: Event) {
      event.stopPropagation();
    }

    function handleContentKeydown(event: KeyboardEvent) {
      // Prevent propagation for keyboard interactions as well
      event.stopPropagation();
    }
</script>
  
{#if show}
  <div class="modal-overlay" on:click={close}>
    <div
      class="modal-content"
      role="dialog"
      tabindex="0"
      on:click={handleContentClick}
      on:keydown={handleContentKeydown}
    >
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
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
    border-radius: 5px;
    padding: 1rem;
    max-width: 90%;
    max-height: 90%;
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