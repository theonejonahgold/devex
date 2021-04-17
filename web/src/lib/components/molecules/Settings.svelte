<script>
  import { userProfile, userToken } from '$lib/stores/user'
  import { getApiURL } from '$lib/utils/fetch'
  import { tick } from 'svelte'
  import { get } from 'svelte/store'

  let streamTitle = $userProfile?.streamTitle ?? ''
  let showKey = false
  let keyInput: HTMLInputElement

  function setStreamTitle() {
    fetch(`${getApiURL()}/title`, {
      method: 'POST',
      body: JSON.stringify({ streamTitle }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get(userToken)}`,
      },
    })
  }
</script>

<style>
  h2 {
    margin-bottom: var(--base-space);
    grid-row: 1;
    grid-column: 1 / span 2;
  }

  form:first-of-type {
    grid-column: 1;
    grid-row: 2;
  }

  form:first-of-type input {
    display: inline-block;
    width: auto;
  }

  label {
    font-size: var(--step-0);
  }

  input {
    font-size: var(--step-0);
    padding: 0.125em;
  }

  aside {
    padding: var(--base-space);
    display: grid;
    grid-template-rows: min-content 1fr 1fr;
    grid-template-columns: 1fr 1fr;
  }
</style>

<aside>
  <h2 class="h3">Settings</h2>
  <form on:submit|preventDefault={setStreamTitle}>
    <label>
      Stream Title:
      <input type="text" required bind:value={streamTitle} />
    </label>
    <button>Save</button>
  </form>
  <form on:submit|preventDefault>
    <label>
      Stream Key (keep this save!):
      <input
        bind:this={keyInput}
        type={showKey ? 'text' : 'password'}
        readonly
        value="{$userProfile?.username}?key={$userProfile?.streamKey}"
      />
    </label>
    <button
      type="button"
      on:click={() => {
        showKey = !showKey
      }}
    >
      {showKey ? 'Hide' : 'Show'}
    </button>
    <button
      type="button"
      on:click={async () => {
        showKey = true
        await tick()
        keyInput.focus()
        keyInput.setSelectionRange(0, keyInput.value.length)
        document.execCommand('copy')
        showKey = false
      }}
    >
      Copy
    </button>
  </form>
</aside>
