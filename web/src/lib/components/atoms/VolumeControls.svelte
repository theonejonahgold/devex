<script lang="ts">
  import Volume from '$lib/svg/volume.svelte'
  import { volume, muted } from '$lib/stores/stream'
  import { toggleBoolStore } from '$lib/utils/stores'
</script>

<style>
  div {
    margin: 0 var(--half-space);
    display: flex;
    align-items: center;
  }

  button {
    width: calc(1.2 * var(--step-1));
    height: var(--step-0);
    background: none;
    border: none;
    padding: 0;
  }

  button:hover :global(svg *) {
    fill: var(--green);
  }

  input[type='range'] {
    appearance: none;
    width: 100%;
    background: transparent;
    transition: width 0.2s ease;
    margin-left: var(--half-space);
  }

  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    height: var(--step-0);
    width: var(--step-0);
    border-radius: 50%;
    background: var(--primary);
    margin-top: calc(-0.35 * var(--step-0));
    cursor: col-resize;
  }

  input[type='range']::-moz-range-thumb {
    height: var(--step-0);
    width: var(--step-0);
    border-radius: 50%;
    background: var(--primary);
    cursor: col-resize;
  }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: calc(0.5 * var(--step--2));
    cursor: pointer;
    background: var(--primary);
    border-radius: calc(0.5 * var(--step--2));
  }

  input[type='range']::-moz-range-track {
    width: 100%;
    height: calc(0.5 * var(--step--2));
    cursor: pointer;
    background: var(--primary);
    border-radius: calc(0.5 * var(--step--2));
  }

  input[type='range']::-webkit-slider-thumb:hover,
  input[type='range']::-webkit-slider-thumb:active {
    background: var(--green);
  }

  input[type='range']::-moz-range-thumb:hover,
  input[type='range']:active::-moz-range-thumb:active {
    background: var(--green);
  }
</style>

<div>
  <button on:click={toggleBoolStore(muted)}>
    <Volume />
  </button>
  <input type="range" min="0" max="1" step="0.01" bind:value={$volume} />
</div>
