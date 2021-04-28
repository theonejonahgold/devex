<script lang="ts">
  import { debounce } from 'ts-debounce'
  import { browser } from '$app/env'
  import {
    fullscreen,
    levels,
    level,
    showOverlay,
    autoLevel,
    paused,
  } from '$lib/stores/stream'
  import Hls from 'hls.js'
  import { afterUpdate, onDestroy, onMount } from 'svelte'
  import { get } from 'svelte/store'
  import VideoElement from '../atoms/VideoElement.svelte'
  import StreamControls from '../molecules/StreamControls.svelte'
  import BufferOverlay from '../atoms/BufferOverlay.svelte'
  import VideoOverlay from '../atoms/VideoOverlay.svelte'
  import PlayOverlay from '../atoms/PlayOverlay.svelte'
  import StreamHeader from '../molecules/StreamHeader.svelte'
  import { getStreamURL } from '$lib/utils/fetch'

  export let streamer: Streamer
  $: stream = `${getStreamURL()}/live/${streamer.username}.m3u8`
  $: poster = `${getStreamURL()}/thumbnails/${streamer.username}.jpg`

  let hls: Hls
  let section: any
  let videoEl: HTMLVideoElement
  let buffering: boolean
  let initialPlay: boolean = true

  const debounceHideOverlay = debounce(() => showOverlay.set(false), 2000)

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
    } else if (
      document.fullscreenElement ||
      (<any>document).webkitFullscreenElement
    ) {
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

  function overlayHandler() {
    const currentStatus = get(showOverlay)
    if (!currentStatus) showOverlay.set(true)
    debounceHideOverlay()
  }

  function toggleBuffering(e: Event) {
    buffering = e.type === 'waiting'
  }

  onMount(() => debounceHideOverlay())

  afterUpdate(() => {
    if (!streamer.live && hls && videoEl) {
      hls?.destroy()
      if (browser) {
        document.removeEventListener(
          'fullscreenchange',
          fullscreenChangeHandler
        )
        document.removeEventListener(
          'webkitfullscreenchange',
          fullscreenChangeHandler
        )
        videoEl.removeEventListener('waiting', toggleBuffering)
        videoEl.removeEventListener('playing', toggleBuffering)
      }
      return
    }
    if ((hls && streamer.live) || !streamer.live) return
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
        if (currentSavedLevel === -1) autoLevel.set(data.level)
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError()
            break
          default:
            hls.destroy()
            break
        }
      })
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = stream
    }
    videoEl.addEventListener('waiting', toggleBuffering)
    videoEl.addEventListener('playing', toggleBuffering)
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
      videoEl?.removeEventListener('waiting', toggleBuffering)
      videoEl?.removeEventListener('playing', toggleBuffering)
    }
    paused.set(true)
  })
</script>

<style>
  section {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    height: 100%;
    position: relative;
    background: black;
  }

  section.hidden {
    cursor: none;
  }
</style>

<section
  class:hidden={!$showOverlay}
  bind:this={section}
  on:mousemove={overlayHandler}
>
  <StreamHeader bind:streamer />
  {#if streamer.live}
    {#if buffering || initialPlay}
      <VideoOverlay>
        {#if buffering}
          <BufferOverlay />
        {/if}
        {#if initialPlay}
          <PlayOverlay
            on:click={() => {
              paused.set(false)
              initialPlay = false
            }}
          />
        {/if}
      </VideoOverlay>
    {/if}
    <VideoElement {poster} bind:videoEl />
  {/if}
  {#if streamer.live}
    <StreamControls />
  {/if}
</section>
