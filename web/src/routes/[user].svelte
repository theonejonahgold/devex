<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async function ({ page, fetch }) {
    const url = `${getApiURL()}/user/${page.params.user}`
    const res = await fetch(url)
    const data = await res.json()

    if (!res.ok) return { status: res.status, error: data.error }
    return {
      props: {
        user: data.data.user,
      },
    }
  }
</script>

<script lang="ts">
  import Chat from '$lib/components/molecules/Chat.svelte'
  import Settings from '$lib/components/molecules/Settings.svelte'
  import Stream from '$lib/components/organisms/Stream.svelte'
  import { userProfile, userToken } from '$lib/stores/user'
  import { getApiURL, getSocketURL, getStreamURL } from '$lib/utils/fetch'
  import { onDestroy, onMount } from 'svelte'
  import { io } from 'socket.io-client'
  import type { Socket } from 'socket.io-client'
  import { get } from 'svelte/store'

  let socket: Socket

  export let user: Streamer

  onMount(() => {
    socket = io(getSocketURL() + '/watch', {
      path: '/api/socket.io/',
    })

    socket.on('connect', () => socket.emit('watch', { channel: user.username }))
    socket.on('update', update => (user = update))
  })

  onDestroy(() => socket?.disconnect())
</script>

<style>
  div {
    display: grid;
    grid-template-columns: auto min-content min-content;
    grid-template-rows: 1fr;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>

<svelte:head>
  <title>{user.username} - DevEx</title>
  <meta name="description" content="The DevEx channel of {user.username}" />
</svelte:head>

<div>
  <Stream bind:streamer={user} />
  <Chat channel={user.username} />
  {#if user.username === $userProfile?.username}
    <Settings />
  {/if}
</div>
