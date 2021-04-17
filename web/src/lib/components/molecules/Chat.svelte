<script lang="ts">
  import { io } from 'socket.io-client'
  import type { Socket } from 'socket.io-client'
  import { onDestroy, onMount, tick } from 'svelte'
  import ChatMessage from '../atoms/ChatMessage.svelte'
  import { hues } from '$lib/stores/chat'
  import { userProfile, userToken } from '$lib/stores/user'
  import ServerMessage from '../atoms/ServerMessage.svelte'
  import { getSocketURL } from '$lib/utils/fetch'

  export let channel: string

  $: userHue = $hues[Math.floor(Math.random() * $hues.length)]

  let socket: Socket
  let messages: (ChatMessageType | ServerMessageType)[] = []
  let message: string
  let list: HTMLUListElement

  function inputPressHandler(this: HTMLInputElement, e: KeyboardEvent) {
    if (e.key !== 'Enter') return
    socket.emit('message', {
      message,
      user: $userProfile!.username,
      hue: userHue,
      type: 'chat',
    } as ChatMessageType)
    this.value = ''
  }

  $: messages.length > 250 ? messages.unshift() : null

  onMount(() => {
    socket = io(getSocketURL() + '/chat', {
      path: '/api/socket.io/',
      auth: {
        token: `Bearer ${$userToken}`,
      },
    })

    socket.on('connect', () => socket.emit('join', { room: channel }))

    socket.on('server-message', async (message: ServerMessageType) => {
      const scroll = list.scrollTop == list.scrollHeight - list.offsetHeight
      messages = [...messages, message]
      await tick()
      if (scroll) list.scrollTop = list.scrollHeight
    })

    socket.on('message', async (message: ChatMessageType) => {
      const scroll = list.scrollTop == list.scrollHeight - list.offsetHeight
      messages = [...messages, message]
      await tick()
      if (scroll) list.scrollTop = list.scrollHeight
    })
  })

  onDestroy(() => socket?.disconnect())
</script>

<style>
  section {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  h2 {
    margin: 0;
    padding: var(--base-space);
    z-index: 1;
    background: var(--secondary);
  }

  ul {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    margin-top: auto;
    overflow-y: scroll;
    list-style: none;
    height: auto;
    max-height: calc(
      100% - ((var(--base-space) * 2) + (var(--step-2) * 1.125))
    );
    padding: 0 var(--base-space);
    margin-top: calc((var(--base-space) * 2) + (var(--step-2) * 1.25));
  }

  .with-input {
    max-height: calc(
      100% - ((var(--base-space) * 2) + (var(--step-2) * 1.125)) -
        (2 * var(--base-space) + (var(--step-4) * 1.125))
    );
  }

  label {
    z-index: 1;
    margin-top: auto;
    padding: var(--base-space);
    font-size: var(--step-0);
    background: var(--secondary);
  }

  input {
    width: 100%;
  }
</style>

<section>
  <h2 class="h3">Chat</h2>
  <ul bind:this={list} class:with-input={!!$userProfile}>
    {#each messages as message}
      {#if message.type === 'chat'}
        <ChatMessage {message} />
      {:else}
        <ServerMessage {message} />
      {/if}
    {/each}
  </ul>
  {#if $userProfile}
    <label>
      <input
        placeholder="Type in chat..."
        on:keypress={inputPressHandler}
        type="text"
        bind:value={message}
      />
    </label>
  {/if}
</section>
