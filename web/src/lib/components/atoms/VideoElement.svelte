<script lang="ts">
  export let videoEl: HTMLVideoElement
  export let poster: string = ''
  export let volume: number
  export let paused: boolean
</script>

<style>
  div {
    position: relative;
    grid-row: 1;
    grid-column: 1;
    width: 100%;
    height: 100%;
    background: black;
  }
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>

<div>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video bind:paused bind:this={videoEl} {poster} bind:volume autoplay />
</div>
