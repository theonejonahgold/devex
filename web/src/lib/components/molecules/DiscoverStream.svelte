<script>
  import { getStreamURL } from '$lib/utils/fetch'
  import { onMount } from 'svelte'

  export let streamer: Streamer
  let image: HTMLImageElement
  onMount(() => {
    const img = new Image()
    img.addEventListener('load', () => (image = img))
    img.src = `${getStreamURL()}/thumbnails/${streamer.username}.jpg`
    img.alt = `Stream thumbnail for ${streamer.username}`
  })
</script>

<style>
  article {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
    grid-template-areas: 'image' 'title' 'name';
    grid-gap: var(--quarter-space);
  }

  img {
    grid-area: image;
    border-radius: 12px;
    border: 4px solid transparent;
    transition: border-color 0.2s ease;
    width: 100%;
  }

  .img-placeholder {
    grid-area: image;
    height: 0;
    overflow: hidden;
    width: 100%;
    padding-top: 56.25%;
    background: var(--tertiary);
    border-radius: 12px;
    border: 4px solid transparent;
  }

  h1 {
    grid-area: title;
    font-size: var(--step-2);
  }

  a {
    text-decoration: none;
  }

  a:hover,
  a:focus {
    color: var(--primary);
  }

  a:hover img,
  a:hover .img-placeholder {
    border-color: var(--green);
  }

  h1,
  p {
    margin: 0;
    margin-left: 5px;
  }

  p:nth-of-type(1) {
    grid-area: name;
  }

  p:last-child {
    grid-area: image;
    align-self: end;
    justify-self: start;
    margin-bottom: var(--base-space);
    margin-left: var(--base-space);
    background: rgba(0, 0, 0, 0.5);
    padding: 0.4em;
    border-radius: 5px;
    line-height: 1;
    font-size: var(--step--1);
  }
</style>

<a href="/{streamer.username}">
  <article>
    {#if image}
      <img
        src="{getStreamURL()}/thumbnails/{streamer.username}.jpg"
        alt="Stream thumbnail for {streamer.username}"
      />
    {:else}
      <div class="img-placeholder" />
    {/if}
    <h1 class="h3">{streamer.streamTitle}</h1>
    <p>{streamer.username}</p>
    <p>{streamer.viewers === 1 ? '1 viewer' : `${streamer.viewers} viewers`}</p>
  </article>
</a>
