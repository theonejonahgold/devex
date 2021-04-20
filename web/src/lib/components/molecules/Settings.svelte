<script>
  import { userProfile, userToken } from '$lib/stores/user'
  import { getApiURL, getRtmpURL } from '$lib/utils/fetch'
  import { onMount, tick } from 'svelte'
  import { get } from 'svelte/store'
  import { debounce } from 'ts-debounce'

  let streamTitle = $userProfile?.streamTitle ?? ''
  let titleState = 0
  let language = $userProfile?.language ?? ''
  let languages: Language[] = []
  let languageState = 0
  let urlState = 0
  let urlInput: HTMLInputElement
  let showKey = false
  let keyInput: HTMLInputElement
  let keyState = 0

  const unsetTitleSaved = debounce(() => (titleState = 0), 2000)
  const unsetLanguageSaved = debounce(() => (languageState = 0), 2000)

  const unsetUrlCopied = debounce(() => (urlState = 0), 2000)
  const unsetKeyCopied = debounce(() => (keyState = 0), 2000)

  async function setStreamTitle() {
    titleState = 1
    await tick()
    await fetch(`${getApiURL()}/title`, {
      method: 'POST',
      body: JSON.stringify({ streamTitle }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get(userToken)}`,
      },
    })
    titleState = 2
    unsetTitleSaved()
  }

  async function setStreamLanguage() {
    languageState = 1
    await tick()
    await fetch(`${getApiURL()}/language`, {
      method: 'POST',
      body: JSON.stringify({ language }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get(userToken)}`,
      },
    })
    languageState = 2
    unsetLanguageSaved()
  }

  function copyURL() {
    urlInput.focus()
    urlInput.setSelectionRange(0, keyInput.value.length)
    if (!document.execCommand('copy')) {
      urlState = 2
      return unsetUrlCopied()
    }
    urlState = 1
    unsetUrlCopied()
  }

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

  onMount(() => {
    fetch(getApiURL() + '/languages')
      .then(res => res.json())
      .then(data => {
        languages = data.data.languages
      })
  })
</script>

<style>
  aside {
    padding: var(--base-space);
    grid-column: 3 / span 1;
    height: 100%;
    width: max(16.6666667vw, 25rem);
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

  section:nth-of-type(2) form:nth-of-type(2) {
    flex-wrap: wrap;
  }

  section:nth-of-type(2) form:nth-of-type(2) button {
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

  input,
  .select-container {
    margin-top: var(--quarter-space);
    font-size: var(--step-0);
    padding: 0.125em 0.375em;
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
        Title:
        <input type="text" required bind:value={streamTitle} />
      </label>
      <button class:highlight={titleState == 2}>
        {titleState === 0 ? 'Save' : titleState === 1 ? 'Saving...' : 'Saved'}
      </button>
    </form>
    <form on:submit|preventDefault={setStreamLanguage}>
      <label for="language-select">
        Language:
        <div class="select-container">
          <select id="language-select" bind:value={language}>
            {#each languages as { slug, name } (slug)}
              <option value={slug}>{name}</option>
            {/each}
          </select>
        </div>
      </label>
      <button class:highlight={languageState == 2}>
        {languageState === 0
          ? 'Save'
          : languageState === 1
          ? 'Saving...'
          : 'Saved'}
      </button>
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
        <input bind:this={urlInput} type="text" readonly value={getRtmpURL()} />
      </label>
      <button class:highlight={urlState === 1} on:click={copyURL}
        >{urlState === 1
          ? 'Copied'
          : urlState === 2
          ? 'Auto-copy failed'
          : 'Copy'}</button
      >
    </form>
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
  </section>
</aside>
