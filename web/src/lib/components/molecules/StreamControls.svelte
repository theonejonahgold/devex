<script lang="ts">
  import FullscreenButton from '../atoms/FullscreenButton.svelte'
  import LevelSelect from '../atoms/LevelSelect.svelte'
  import PlayPauseButton from '../atoms/PlayPauseButton.svelte'
  import VolumeControls from '../atoms/VolumeControls.svelte'
</script>

<style>
  section {
    grid-row: 1;
    grid-column: 1;
    z-index: 1;
    align-self: end;
    width: 100%;
    display: flex;
    align-items: center;
    padding: var(--double-space) var(--base-space);
    background: linear-gradient(to top, #000000ff, #00000000);
  }
</style>

<section>
  <PlayPauseButton />
  <VolumeControls />
  <LevelSelect />
  <FullscreenButton />
</section>
