<script>
  import { createEventDispatcher } from 'svelte'

  export let title: string
  export let large: boolean = false
  export let noClose: boolean = false
  export let preciseClose: boolean = false

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

  .large {
    width: min(100%, 40rem);
  }

  h1 {
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

<svelte:window
  on:keydown={e => {
    if (preciseClose) return
    if (e.key === 'Escape') closeModal()
  }}
/>

<section class:large>
  <header>
    <h1>{title}</h1>
    {#if !noClose}
      <button on:click={closeModal}><slot name="close">Close</slot></button>
    {/if}
  </header>
  <slot />
</section>
<div on:click={() => !noClose && !preciseClose && closeModal()} />
