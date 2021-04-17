<script lang="ts">
  import { level, levels, autoLevel } from '$lib/stores/stream'
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
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 6px;
    padding: var(--quarter-space);
  }

  select:hover {
  }

  select:focus,
  select:active {
    outline: none;
    border-color: var(--green);
  }
</style>

{#if $levels}
  <label>
    Quality:
    <select bind:value={$level}>
      <option value={-1}>Auto ({$levels[$autoLevel]?.height}p)</option>
      {#each $levels as level, i (level.height)}
        <option value={i}>{level.height}p</option>
      {/each}
    </select>
  </label>
{/if}
