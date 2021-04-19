<script context="module">
  import { getApiURL, getSocketURL } from '$lib/utils/fetch'

  import type { Load } from '@sveltejs/kit'

  export const load: Load = async function ({ fetch }) {
    const res = await fetch(getApiURL() + '/discovery')
    const json = await res.json()
    return {
      props: {
        streamers: json.data.users,
      },
    }
  }
</script>

<script lang="ts">
  import DiscoverStream from '$lib/components/molecules/DiscoverStream.svelte'
  import { io } from 'socket.io-client'
  import type { Socket } from 'socket.io-client'
  import { onDestroy, onMount } from 'svelte'

  export let streamers: Streamer[] = []
  let socket: Socket

  onMount(() => {
    socket = io(`${getSocketURL()}/discover`, {
      path: '/api/socket.io/',
    })
    socket.on('update', update => {
      streamers = update
    })
  })
  onDestroy(() => {
    socket?.disconnect()
  })
</script>

<style>
  main {
    padding: var(--base-space);
  }

  h2 {
    margin-bottom: var(--base-space);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
  }

  li {
    flex: 0 1 30rem;
  }
</style>

<svelte:head>
  <title>Discover - DevEx</title>
  <meta name="description" content="Discover popular live channels" />
</svelte:head>

<main>
  <h2>Discover</h2>
  <ul>
    <li>
      {#each streamers as streamer}
        <DiscoverStream {streamer} />
      {/each}
    </li>
  </ul>
</main>
