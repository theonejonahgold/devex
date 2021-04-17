<script lang="ts">
  import { level, levels } from '$lib/stores/stream'

  $: console.log($levels)
</script>

<style>
  label {
    margin: 0 var(--half-space) 0 auto;
    color: var(--primary);
    font-size: var(--step-0);
    font-family: var(--text-running);
  }
  select {
    appearance: none;
    background: none;
    border: none;
    color: var(--primary);
    font-size: var(--step-0);
    font-family: var(--text-running);
    border-radius: 0;
  }
  select:focus,
  select:active {
    outline: none;
  }
</style>

{#if $levels}
  <label>
    Quality:
    <select bind:value={$level}>
      <option value={-1}>Auto</option>
      {#each $levels as level, i (level.height)}
        <option value={i}>{level.height}p</option>
      {/each}
    </select>
  </label>
{/if}
