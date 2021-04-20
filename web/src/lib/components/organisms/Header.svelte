<script lang="ts">
  import { page } from '$app/stores'
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
    z-index: 5;
    background: var(--tertiary);
  }

  header :global(button) {
    background: var(--secondary);
  }

  header :global(button:not(:hover, :focus, .active)) {
    border-color: var(--secondary);
  }

  nav {
    margin-left: var(--base-space);
    display: flex;
    width: 100%;
    align-items: center;
  }

  nav a {
    font-size: var(--step-1);
    margin-left: var(--base-space);
    text-decoration: none;
    font-weight: 500;
    background: linear-gradient(currentColor 0 0) bottom/var(--d, 0) 2px
      no-repeat;
    transition: 0.2s ease;
  }

  nav a:hover,
  nav a:focus,
  .active {
    color: var(--green);
    --d: 100%;
  }

  h1 {
    line-height: 1.125;
  }

  h1 a {
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    text-decoration: none;
  }

  button:first-of-type {
    margin-left: auto;
  }

  button:last-of-type {
    margin-left: var(--base-space);
  }
</style>

<header>
  <h1><a href="/">DevEx</a></h1>
  <nav>
    <a class:active={$page.path === '/'} href="/">Discover</a>
    <a class:active={$page.path.startsWith('/languages')} href="/languages"
      >Languages</a
    >
    {#if !$userProfile}
      <button on:click={openLoginModal}>Log in</button>
      <button on:click={openRegisterModal}>Register</button>
    {:else}
      <HeaderProfile />
    {/if}
  </nav>
</header>
