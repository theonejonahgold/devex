<script>
  import { createEventDispatcher } from 'svelte'

  export let title: string

  const dispatch = createEventDispatcher()

  function closeModal() {
    dispatch('close')
  }
</script>

<style>
  section {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(100%, 25rem);
    min-height: 10%;
    z-index: 10;
    background: var(--primary);
    border-radius: 12px;
    padding: var(--base-space);
  }

  section :global(:not(input):not(button)) {
    color: var(--tertiary);
  }

  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    background: #000000aa;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--base-space);
  }

  h1 {
    line-height: 1;
  }
</style>

<section>
  <header>
    <h1>{title}</h1>
    <button on:click={closeModal}>Close</button>
  </header>
  <slot />
</section>
<div />
