<script lang="ts">
  import { showOverlay } from '$lib/stores/stream'
  import FullscreenButton from '../atoms/FullscreenButton.svelte'
  import LevelSelect from '../atoms/LevelSelect.svelte'
  import PlayPauseButton from '../atoms/PlayPauseButton.svelte'
  import VolumeControls from '../atoms/VolumeControls.svelte'
</script>

<style>
  section {
    grid-row: 1;
    grid-column: 1;
    z-index: 2;
    align-self: end;
    width: 100%;
    display: flex;
    align-items: center;
    padding: var(--double-space) var(--base-space) var(--base-space);
    background: linear-gradient(to top, #000000ff, #00000000);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  section.hidden {
    transform: translateY(10%);
    opacity: 0;
  }
</style>

<section class:hidden={!$showOverlay}>
  <PlayPauseButton />
  <VolumeControls />
  <LevelSelect />
  <FullscreenButton />
</section>
