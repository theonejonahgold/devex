<script>
  import { userProfile } from '$lib/stores/user'

  import { createEventDispatcher, tick } from 'svelte'
  import { debounce } from 'ts-debounce'

  const dispatch = createEventDispatcher<{
    previous: undefined
    close: undefined
  }>()

  let keyInput: HTMLInputElement
  let showKey = false
  let keyState = 0
  const unsetKeyCopied = debounce(() => (keyState = 0), 2000)

  async function copyKey() {
    showKey = true
    await tick()
    keyInput.focus()
    keyInput.setSelectionRange(0, keyInput.value.length)
    if (!document.execCommand('copy')) {
      showKey = false
      keyState = 2
      return unsetKeyCopied()
    }
    showKey = false
    keyState = 1
    unsetKeyCopied()
  }
</script>

<style>
  p,
  ol,
  label {
    color: var(--tertiary);
  }

  div {
    display: flex;
  }

  button:first-child {
    margin-right: 0.5rem;
  }

  button:last-child {
    margin-left: 0.5rem;
  }

  video {
    width: 100%;
    border-radius: 12px;
    margin-bottom: var(--base-space);
  }

  form {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: var(--base-space);
  }

  form button {
    margin-top: var(--half-space);
    width: calc(50% - var(--quarter-space));
  }

  label {
    width: 100%;
  }

  input {
    margin-top: var(--quarter-space);
    font-size: var(--step-0);
    padding: 0.125em 0.375em;
    width: 100%;
  }
</style>

<p>
  This part is quite important, because this is not your run-of-the-mill
  streaming service. You're in the big leagues now, baby!
</p>
<p>To get started, follow these steps:</p>
<ol>
  <li>
    Download streaming software like <a
      href="https://obsproject.com"
      target="_blank"
      rel="noopener noreferrer">OBS</a
    >, which you can
    <a href="https://obsproject.com" target="_blank" rel="noopener noreferrer"
      >download here</a
    >.
  </li>
  <li>
    Start OBS, and follow the automatic configuration wizard.
    <ol>
      <li>Optimise for streaming</li>
      <li>Set resolution to 1920x1080p and prefer 60fps</li>
      <li>
        Set streaming service to custom, set Server to
        "rtmp://devex.jonahgold.dev" and copy the stream key from below.
      </li>
      <li>
        Apply the recommended settings, but change them later in the settings as
        they are of very low quality.
      </li>
    </ol>
  </li>
</ol>

<form on:submit|preventDefault>
  <label for="stream-key">Stream Key:</label>
  <input
    id="stream-key"
    bind:this={keyInput}
    type={showKey ? 'text' : 'password'}
    readonly
    value="{$userProfile?.username}?key={$userProfile?.streamKey}"
  />
  <button
    class:highlight={showKey}
    type="button"
    on:click={() => (showKey = !showKey)}
  >
    {showKey ? 'Hide' : 'Show'}
  </button>
  <button class:highlight={keyState === 1} type="button" on:click={copyKey}
    >{keyState === 1
      ? 'Copied'
      : keyState === 2
      ? 'Auto-copy failed'
      : 'Copy'}</button
  >
</form>

<p>
  Confused? No problem, we always provide you with a handy getting started guide
  next to your stream URL and stream key. You cannot show your key to anyone you
  don't trust, otherwise they can overtake your stream.
</p>
<p>Happy streaming!</p>

<!-- svelte-ignore a11y-media-has-caption -->
<video src="/stream-setup.mp4" autoplay muted loop />

<div>
  <button class="large full-width" on:click={() => dispatch('previous')}>
    Previous
  </button>
  <button class="large full-width" on:click={() => dispatch('close')}>
    Live in 5...4...3...2...
  </button>
</div>
