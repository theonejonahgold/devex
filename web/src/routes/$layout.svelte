<script lang="typescript">
  import '../app.css'
  import { page } from '$app/stores'
  import Header from '$lib/components/organisms/Header.svelte'
  import LoginModal from '$lib/components/organisms/LoginModal.svelte'
  import RegisterModal from '$lib/components/organisms/RegisterModal.svelte'
  import Sidebar from '$lib/components/organisms/Sidebar.svelte'

  let loginModal: boolean
  let registerModal: boolean
  $: sidebarCollapsed = $page.path !== '/'
</script>

<Header
  on:login-modal={() => (loginModal = !loginModal)}
  on:register-modal={() => (registerModal = !registerModal)}
/>
<Sidebar bind:collapsed={sidebarCollapsed} />
<main>
  <slot />
</main>

{#if loginModal}
  <LoginModal on:close={() => (loginModal = false)} />
{/if}
{#if registerModal}
  <RegisterModal on:close={() => (registerModal = false)} />
{/if}
