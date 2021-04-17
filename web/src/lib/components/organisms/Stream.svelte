<script lang="ts">
  import { debounce } from 'debounce'
  import { browser } from '$app/env'
  import {
    fullscreen,
    levels,
    level,
    showOverlay,
    autoLevel,
  } from '$lib/stores/stream'
  import Hls from 'hls.js'
  import {
    afterUpdate,
    createEventDispatcher,
    onDestroy,
    onMount,
  } from 'svelte'
  import { get } from 'svelte/store'
  import VideoElement from '../atoms/VideoElement.svelte'
  import StreamControls from '../molecules/StreamControls.svelte'
  import LiveIcon from '../atoms/LiveIcon.svelte'
  import { userProfile } from '$lib/stores/user'

  export let stream: string = ''
  export let poster: string = ''
  export let user: Streamer
  export let following: boolean

  const dispatch = createEventDispatcher()
  let hls: Hls
  let section: any
  let videoEl: HTMLVideoElement

  function onFollowButtonHandler() {
    dispatch('follow-click')
  }

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

  onMount(() => {
    debounceHideOverlay()
  })

  afterUpdate(() => {
    if (!user.live || hls) return
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
    background: black;
  }

  section.hidden {
    cursor: none;
  }

  header {
    padding: var(--base-space) var(--base-space) var(--double-space);
    z-index: 1;
    grid-row: 1;
    grid-column: 1;
    align-self: start;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    transition: opacity 0.2s ease, transform 0.2s ease;
    display: flex;
    justify-content: space-between;
  }

  header.hidden {
    transform: translateY(-10%);
    opacity: 0;
  }

  header h3 {
    font-size: var(--step-1);
    font-weight: bold;
  }

  header p {
    margin: var(--quarter-space) 0;
  }
</style>

<section
  class:hidden={!$showOverlay}
  bind:this={section}
  on:mousemove={overlayHandler}
>
  <header class:hidden={!$showOverlay}>
    <div>
      <h3>{user.username}</h3>
      <p>{user.streamTitle}</p>
      {#if $userProfile && $userProfile.username !== user.username}
        <button on:click={onFollowButtonHandler}>
          {following ? 'Unfollow' : 'Follow'}
        </button>
      {/if}
    </div>
    <div>
      <LiveIcon bind:live={user.live} />
      <p>{user.viewers === 1 ? '1 viewer' : `${user.viewers} viewers`}</p>
    </div>
  </header>
  {#if user.live}
    <VideoElement {poster} bind:videoEl />
  {/if}
  <StreamControls />
</section>
