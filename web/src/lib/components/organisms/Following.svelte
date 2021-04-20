<script>
  import { userProfile, userToken } from '$lib/stores/user'
  import { getSocketURL } from '$lib/utils/fetch'
  import { io } from 'socket.io-client'
  import type { Socket } from 'socket.io-client'
  import { onDestroy } from 'svelte'
  import Followee from '../molecules/Followee.svelte'
  import CollapseButton from '../atoms/CollapseButton.svelte'
  import { cubicInOut } from 'svelte/easing'
  import { blur } from 'svelte/transition'
  import { blurTransitionConfig } from '$lib/constants/transition'

  export let collapsed = false

  let socket: Socket | undefined = undefined

  let streamerMap = new Map<string, Streamer>()

  $: if ($userProfile?.following.length && !socket) {
    socket = io(getSocketURL() + '/following', {
      path: '/api/socket.io/',
      auth: {
        token: $userToken,
      },
    })

    socket.on('initial-data', (streamers: Streamer[]) => {
      streamers.forEach(s => streamerMap.set(s.username, s))
      streamerMap = streamerMap
    })

    socket.on('update', (streamer: Streamer) => {
      streamerMap.set(streamer.username, streamer)
      streamerMap = streamerMap
    })
    socket.on('connect_err', console.error)
  } else if ($userProfile?.following.length && socket) {
    socket.emit('update', $userProfile?.following)
  } else if (!$userProfile?.following.length) {
    socket?.disconnect()
    socket = undefined
    streamerMap.clear()
    streamerMap = streamerMap
  }

  onDestroy(() => socket?.disconnect())
</script>

<style>
  aside {
    height: 100%;
    width: 100%;
    padding: var(--base-space);
    background: var(--tertiary);
    grid-area: sidebar;
    width: max(16.6666667vw, 25rem);
    transition: width 0.2s ease, padding 0.2s ease;
    border-right: 2px solid rgba(255, 255, 255, 0.3);
  }

  .collapsed {
    padding: var(--base-space) var(--half-space);
    width: var(--quadruple-space);
  }

  .collapsed header {
    justify-content: center;
  }

  .collapsed header :global(button) {
    margin-left: initial;
  }

  header {
    display: flex;
    align-items: flex-start;
  }

  header :global(button) {
    margin-left: auto;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  h2 {
    font-size: var(--step-1);
    font-weight: bold;
    line-height: 1;
  }
</style>

<aside class:collapsed>
  <header>
    {#if !collapsed}
      <h2 transition:blur|local={blurTransitionConfig} class="h3">Following</h2>
    {/if}
    <CollapseButton bind:collapsed invert={false} />
  </header>
  <ul>
    {#each [...streamerMap.entries()] as [_, streamer]}
      <li>
        <Followee bind:collapsed bind:streamer />
      </li>
    {/each}
  </ul>
</aside>
