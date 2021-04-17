<script lang="ts">
  import Modal from '$lib/components/molecules/Modal.svelte'
  import { userToken } from '$lib/stores/user'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  let username: string
  let password: string

  let usernameError: string
  let passwordError: string

  function submitForm() {
    fetch(
      import.meta.env.PROD
        ? 'https://devex.jonahgold.dev/api/login'
        : 'http://localhost:5000/api/login',
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
      .catch(error => {
        if (error === 'Password incorrect') {
          passwordError = 'The entered password is incorrect'
          return
        }
        if (error === 'Username incorrect') {
          usernameError = 'There is no account associated to this username'
          return
        }
        console.error(error)
      })
  }
</script>

<style>
  label {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: var(--base-space);
    font-size: var(--step-1);
  }

  input {
    width: 100%;
    margin-top: var(--quarter-space);
  }
</style>

<Modal title="Log in" on:close>
  <form on:submit|preventDefault={submitForm}>
    <label>
      Username
      <input autofocus type="text" name="username" bind:value={username} />
      {#if usernameError}<p>{usernameError}</p>{/if}
    </label>
    <label>
      Password
      <input type="password" name="password" bind:value={password} />
      {#if passwordError}<p>{passwordError}</p>{/if}
    </label>
    <button class="large" type="submit">Log in</button>
  </form>
</Modal>
