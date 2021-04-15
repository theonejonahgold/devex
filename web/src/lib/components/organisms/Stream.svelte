<script lang="ts">
  import Hls, { Level } from 'hls.js'
  import { onDestroy, onMount } from 'svelte'
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
  let volume: number = 0.5
  let paused: boolean = false
  let fullscreen: boolean = false
  let levels: Level[] = []
  let level = -1

  $: {
    if (hls) {
      hls.loadLevel = level
    }
  }

  $: {
    if (fullscreen) {
      if (section.requestFullscreen) {
        section.requestFullscreen() // W3C spec
      } else if (section.mozRequestFullScreen) {
        section.mozRequestFullScreen() // Firefox
      } else if (section.webkitRequestFullscreen) {
        section.webkitRequestFullscreen() // Safari
      } else if (section.msRequestFullscreen) {
        section.msRequestFullscreen() // IE/Edge
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      }
    }
  }

  onMount(() => {
    if (Hls.isSupported()) {
      hls = new Hls({
        startLevel: -1,
      })
      hls.attachMedia(videoEl)
      hls.loadSource(stream)
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        levels = data.levels
      })
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = stream
    }
  })
  onDestroy(() => {
    if (hls) hls.destroy()
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
    z-index: 1;
    grid-row: 1;
    grid-column: 1;
    align-self: start;
  }
</style>

<section bind:this={section}>
  <header>
    <h3>{user.username}</h3>
    <p>Here comes the title!</p>
  </header>
  <VideoElement {poster} bind:volume bind:paused bind:videoEl />
  <StreamControls
    bind:level
    bind:levels
    bind:volume
    bind:paused
    bind:fullscreen
  />
</section>
