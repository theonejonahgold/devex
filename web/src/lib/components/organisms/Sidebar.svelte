<script>
  import { userProfile, userToken } from '$lib/stores/user'
  import { getSocketURL } from '$lib/utils/fetch'
  import { io } from 'socket.io-client'
  import type { Socket } from 'socket.io-client'
  import { onDestroy } from 'svelte'
  import Followee from '../molecules/Followee.svelte'

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
    width: 16.6666667vw;
  }

  .collapsed {
    padding: var(--base-space) var(--half-space);
    width: var(--quadruple-space);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  h2 {
    font-size: var(--step-1);
    font-weight: bold;
  }
</style>

<aside class:collapsed>
  {#if !collapsed}
    <h2 class="h3">Following</h2>
  {/if}
  <ul>
    {#each [...streamerMap.entries()] as [_, streamer]}
      <li>
        <Followee bind:collapsed bind:streamer />
      </li>
    {/each}
  </ul>
</aside>
