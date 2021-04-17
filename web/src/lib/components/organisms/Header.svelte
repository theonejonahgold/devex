<script lang="ts">
  import { userProfile } from '$lib/stores/user'
  import { createEventDispatcher } from 'svelte'
  import HeaderProfile from '../molecules/HeaderProfile.svelte'

  const dispatch = createEventDispatcher()

  function openLoginModal() {
    dispatch('login-modal')
  }

  function openRegisterModal() {
    dispatch('register-modal')
  }
</script>

<style>
  header {
    padding: var(--half-space) var(--base-space);
    display: flex;
    grid-area: header;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    align-items: center;
    position: relative;
    z-index: 1;
  }

  nav {
    margin-left: var(--base-space);
    display: flex;
    width: 100%;
    align-items: center;
  }

  a {
    font-size: var(--step-1);
    margin-left: var(--base-space);
    text-decoration: none;
    font-weight: 500;
    background-image: linear-gradient(var(--green), var(--green));
    background-size: 0% 2px;
    background-position: 50% 100%;
    background-repeat: no-repeat;
    transition: background-size 0.2s ease, background-position 0.2s ease,
      color 0.2s ease;
  }

  a:hover,
  a:focus {
    color: var(--green);
    background-size: 100% 2px;
    background-position: 0% 100%;
  }

  h1 {
    line-height: 1.125;
  }

  button:first-of-type {
    margin-left: auto;
  }

  button:last-of-type {
    margin-left: var(--base-space);
  }
</style>

<header>
  <h1>DevEx</h1>
  <nav>
    <a href="/">Discover</a>
    <a href="/languages">Languages</a>
    {#if !$userProfile}
      <button on:click={openLoginModal}>Log in</button>
      <button on:click={openRegisterModal}>Register</button>
    {:else}
      <HeaderProfile />
    {/if}
  </nav>
</header>
