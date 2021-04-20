<script lang="ts">
  import { navigating } from '$app/stores'

  import { page } from '$app/stores'
  import { userProfile, userToken } from '$lib/stores/user'

  let navOpen = false

  $: if ($navigating) navOpen = false

  function logOut() {
    localStorage.setItem('user-token', '')
    userToken.set('')
  }
</script>

<style>
  section {
    position: relative;
    margin-left: auto;
  }

  button {
    font-size: var(--step-1);
    color: var(--primary);
    background: var(--secondary);
    font-weight: bold;
    font-family: var(--font-heading);
  }

  button:hover,
  button:focus,
  .active {
    border-color: var(--green);
    outline: none;
  }

  .active {
    background-color: var(--green);
    color: var(--secondary);
  }

  nav {
    z-index: 1;
    position: absolute;
    top: calc(var(--half-space) + 100%);
    right: 0%;
    width: max(max-content, 100%);
    background: var(--secondary);
    border-radius: 5px;
    border: 2px solid var(--primary);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: var(--half-space);
  }

  li {
    text-align: right;
    font-size: var(--step-0);
  }

  a {
    text-decoration: none;
  }

  nav button {
    all: unset;
    cursor: pointer;
  }

  nav button:hover {
    color: var(--green);
  }
</style>

<svelte:body
  on:click={e => {
    //@ts-ignore
    if (e.target.id === 'profile-button') return
    navOpen === true ? (navOpen = false) : false
  }} />

<section>
  <button
    id="profile-button"
    on:click={() => (navOpen = !navOpen)}
    class:active={navOpen || $page.path === `/${$userProfile?.username}`}
  >
    {$userProfile?.username}
  </button>
  {#if navOpen}
    <nav>
      <ul>
        <li><a href="/{$userProfile?.username}">Profile</a></li>
        <hr />
        <li><button on:click={logOut}>Log out</button></li>
      </ul>
    </nav>
  {/if}
</section>
