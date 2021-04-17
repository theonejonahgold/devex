<script>
  import { getStreamURL } from '$lib/utils/fetch'

  export let streamer: Streamer
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

  h1 {
    grid-area: title;
    font-size: var(--step-2);
  }

  a {
    text-decoration: none;
  }

  a:hover img {
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
    background: rgba(0, 0, 0, 0.25);
    padding: 0.4em;
    border-radius: 5px;
    line-height: 1;
    font-size: var(--step--1);
  }
</style>

<a href="/{streamer.username}">
  <article>
    <img
      src="{getStreamURL()}/thumbnails/{streamer.username}.jpg"
      alt="Stream thumbnail for {streamer.username}"
    />
    <h1 class="h3">{streamer.streamTitle}</h1>
    <p>{streamer.username}</p>
    <p>{streamer.viewers === 1 ? '1 viewer' : `${streamer.viewers} viewers`}</p>
  </article>
</a>
