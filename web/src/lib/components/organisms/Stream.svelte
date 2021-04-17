<script lang="ts">
  import { browser } from '$app/env'
  import { fullscreen, levels, level } from '$lib/stores/stream'
  import Hls from 'hls.js'
  import { onDestroy, onMount } from 'svelte'
  import { get } from 'svelte/store'
  import VideoElement from '../atoms/VideoElement.svelte'
  import StreamControls from '../molecules/StreamControls.svelte'

  export let stream: string = ''
  export let poster: string = ''
  export let user: {
    username: string
    viewers: number
    live: boolean
  }

  let hls: Hls

  let section: any
  let videoEl: HTMLVideoElement

  $: if (hls) hls.loadLevel = $level

  $: if (browser) {
    if ($fullscreen) {
      if (section.requestFullscreen) {
        section.requestFullscreen()
      } else if (section.mozRequestFullScreen) {
        section.mozRequestFullScreen()
      } else if (section.webkitRequestFullscreen) {
        section.webkitRequestFullscreen()
      } else if (section.msRequestFullscreen) {
        section.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((<any>document).mozCancelFullScreen) {
        ;(<any>document).mozCancelFullScreen()
      } else if ((<any>document).webkitExitFullscreen) {
        ;(<any>document).webkitExitFullscreen()
      }
    }
  }

  function fullscreenChangeHandler() {
    const fullscreenStatus = get(fullscreen)
    if ('webkitFullscreenElement' in <any>document)
      if (!!(<any>document).webkitFullscreenElement !== fullscreenStatus)
        return fullscreen.set(!fullscreenStatus)
    if ('fullscreenElement' in document)
      if (!!document.fullscreenElement !== fullscreenStatus)
        fullscreen.set(!fullscreenStatus)
  }

  onMount(() => {
    if (Hls.isSupported()) {
      hls = new Hls({ startLevel: -1 })
      hls.attachMedia(videoEl)
      hls.loadSource(stream)
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        levels.set(data.levels)
      })
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const currentSavedLevel = get(level)
        if (data.level !== currentSavedLevel && currentSavedLevel !== -1)
          level.set(data.level)
      })
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = stream
    }
    document.addEventListener('fullscreenchange', fullscreenChangeHandler)
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler)
  })
  onDestroy(() => {
    hls?.destroy()
    if (browser) {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler)
      document.removeEventListener(
        'webkitfullscreenchange',
        fullscreenChangeHandler
      )
    }
  })
</script>

<style>
  section {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    height: 100%;
    position: relative;
  }

  header {
    padding: var(--double-space) var(--base-space);
    z-index: 1;
    grid-row: 1;
    grid-column: 1;
    align-self: start;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }

  header h3 {
    font-size: var(--step-1);
    font-weight: bold;
  }

  header p {
    margin: 0;
  }
</style>

<section bind:this={section}>
  <header>
    <h3>{user.username}</h3>
    <p>Here comes the title!</p>
  </header>
  <VideoElement {poster} bind:videoEl />
  <StreamControls />
</section>
