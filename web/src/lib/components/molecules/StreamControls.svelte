<script lang="ts">
  import type { Level } from 'hls.js'
  export let paused: boolean
  export let volume: number
  export let fullscreen: boolean
  export let levels: Level[]
  export let level: number
</script>

<button on:click={() => (paused = !paused)}>{paused ? 'Play' : 'Pause'}</button>
<input type="range" min="0" max="1" step="0.01" bind:value={volume} />
<button on:click={() => (fullscreen = !fullscreen)}
  >{fullscreen ? 'Close fullscreen' : 'Fullscreen'}</button
>
<select bind:value={level}>
  <option value={-1}>Auto</option>
  {#each levels as level}
    <option value={level.id}>{level.height}p</option>
  {/each}
</select>
