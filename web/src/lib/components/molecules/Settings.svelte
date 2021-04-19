<script>
  import { userProfile, userToken } from '$lib/stores/user'
  import { getApiURL, getRtmpURL } from '$lib/utils/fetch'
  import { tick } from 'svelte'
  import { get } from 'svelte/store'
  import { debounce } from 'ts-debounce'

  let streamTitle = $userProfile?.streamTitle ?? ''
  let showKey = false
  let keyInput: HTMLInputElement
  let titleSaved = false
  let keyCopied = false

  const unsetSaved = debounce(() => (titleSaved = false), 2000)
  const unsetCopied = debounce(() => (keyCopied = false), 2000)

  function setStreamTitle() {
    fetch(`${getApiURL()}/title`, {
      method: 'POST',
      body: JSON.stringify({ streamTitle }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get(userToken)}`,
      },
    }).then(res => {
      titleSaved = res.ok
      unsetSaved()
    })
  }

  async function copyKey() {
    showKey = true
    await tick()
    keyInput.focus()
    keyInput.setSelectionRange(0, keyInput.value.length)
    document.execCommand('copy')
    showKey = false
    keyCopied = true
    unsetCopied()
  }
</script>

<style>
  aside {
    padding: var(--base-space);
    grid-column: 3 / span 1;
    height: 100%;
    width: max(16.6666667vw, 20rem);
    border-left: 2px solid rgba(255, 255, 255, 0.5);
    overflow-y: scroll;
  }

  h3 {
    line-height: 1;
    margin-bottom: var(--base-space);
  }

  section {
    margin-bottom: var(--double-space);
  }

  section form {
    display: flex;
    align-items: flex-end;
    width: 100%;
  }

  section:nth-of-type(2) form {
    flex-wrap: wrap;
  }

  section:nth-of-type(2) button {
    margin-top: var(--half-space);
    width: calc(50% - var(--quarter-space));
  }

  label {
    display: block;
    font-size: var(--step-0);
    width: 100%;
  }

  form + form {
    margin-top: var(--base-space);
  }

  label + button {
    margin-left: var(--half-space);
  }

  label:empty {
    width: 100%;
  }

  input {
    margin-top: var(--quarter-space);
    font-size: var(--step-0);
    padding: 0.125em 0.375em;
    display: block;
    width: 100%;
  }

  button + button {
    margin-left: var(--half-space);
  }

  .highlight {
    border-color: var(--green);
    background: var(--green);
    color: var(--secondary);
  }
</style>

<aside>
  <section>
    <h3>Stream settings</h3>
    <form on:submit|preventDefault={setStreamTitle}>
      <label>
        Stream Title:
        <input type="text" required bind:value={streamTitle} />
      </label>
      <button class:highlight={titleSaved}
        >{titleSaved ? 'Saved' : 'Save'}</button
      >
    </form>
  </section>
  <section>
    <h3>Stream setup</h3>
    <p>
      To be able to stream, you need software like <a
        href="https://obsproject.com"
        target="_blank"
        rel="noopener noreferrer">OBS</a
      >.
      <a
        href="https://obsproject.com/wiki/OBS-Studio-Quickstart"
        target="_blank"
        rel="noopener noreferrer">Here</a
      > is the official quickstart guide.
    </p>
    <form on:submit|preventDefault>
      <label>
        Stream URL:
        <input type="text" readonly value={getRtmpURL()} />
      </label>
    </form>
    <form on:submit|preventDefault>
      <label for="stream-key"> Stream Key: </label>
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
        on:click={() => {
          showKey = !showKey
        }}
      >
        {showKey ? 'Hide' : 'Show'}
      </button>
      <button class:highlight={keyCopied} type="button" on:click={copyKey}
        >{keyCopied ? 'Copied' : 'Copy'}</button
      >
    </form>
  </section>
</aside>
