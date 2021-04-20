<script lang="ts">
  import Modal from '$lib/components/molecules/Modal.svelte'
  import { userToken } from '$lib/stores/user'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let initialUsername = ''
  let username = initialUsername
  let password: string

  function submitForm() {
    fetch(
      import.meta.env.PROD
        ? 'https://devex.jonahgold.dev/api/register'
        : 'http://localhost:5000/api/register',
      {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(res => res.json())
      .then(json => {
        if (json.type !== 'data') throw json.error
        userToken.set(json.data.token)
        dispatch('close')
      })
      .catch(console.error)
  }
</script>

<style>
  label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: var(--base-space);
    color: var(--tertiary);
    font-size: var(--step-1);
  }

  input {
    width: 100%;
    margin-top: var(--quarter-space);
  }
</style>

<Modal title="Register" on:close>
  <form on:submit|preventDefault={submitForm}>
    <label>
      Username
      <input autofocus type="text" name="username" bind:value={username} />
    </label>
    <label>
      Password
      <input type="password" name="password" bind:value={password} />
    </label>
    <button class="large" type="submit">Register</button>
  </form>
</Modal>
