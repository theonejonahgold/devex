<script>
  import { userProfile, userToken } from '$lib/stores/user'
  import { getApiURL } from '$lib/utils/fetch'
  import { get } from 'svelte/store'

  export let username: string
  let hovering = false
  $: following = $userProfile!.following.includes(username)

  function clickHandler() {
    let url: string = `${getApiURL()}/follow`
    if (following) url = `${getApiURL()}/unfollow`
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${get(userToken)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: username,
      }),
    }).catch(console.error)
  }
</script>

<style>
  button {
    margin-left: var(--half-space);
  }

  button.active {
    color: var(--secondary);
    background: var(--green);
    border-color: var(--green);
  }

  button.active:hover,
  button.active:focus {
    color: var(--primary);
    background: var(--red);
    border-color: var(--primary);
  }
</style>

<button
  class="invert"
  class:active={following}
  on:mouseover={() => (hovering = true)}
  on:mouseout={() => (hovering = false)}
  on:click={clickHandler}
>
  {following ? (hovering ? 'Unfollow' : 'Following') : 'Follow'}
</button>
