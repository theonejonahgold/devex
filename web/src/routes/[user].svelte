<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async function ({ page, fetch, session, context }) {
    const url = import.meta.env.PROD
      ? `https://devex.jonahgold.dev/api/user/${page.params.user}`
      : `http://localhost:5000/api/user/${page.params.user}`
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

  export let user: {
    username: string
    live: boolean
    viewers: number
    streamTitle: string
  }

  $: following = !!$userProfile?.following.includes(user.username)

  function followHandler() {
    let url: string = `${getApiURL()}/follow`
    if (following) url = `${getApiURL()}/unfollow`
    console.log(url, get(userToken))
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${get(userToken)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: user.username,
      }),
    }).catch(console.error)
  }

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
    grid-template-columns: auto min-content;
    height: 100%;
  }
  div:not(:only-child) {
    height: 80%;
  }
  aside {
  }
</style>

<svelte:head>
  <title>{user.username} - DevEx</title>
  <meta name="description" content="The DevEx channel of {user.username}" />
</svelte:head>

<div>
  <Stream
    on:follow-click={followHandler}
    bind:user
    bind:following
    stream={`${getStreamURL()}/live/${user.username}.m3u8`}
    poster={`${getStreamURL()}/thumbnails/${user.username}.jpg`}
  />
  <Chat channel={user.username} />
</div>
{#if user.username === $userProfile?.username}
  <Settings />
{/if}
