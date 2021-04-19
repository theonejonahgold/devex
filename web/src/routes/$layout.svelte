<script lang="typescript">
  import '../app.css'
  import { getStores, page } from '$app/stores'
  import Header from '$lib/components/organisms/Header.svelte'
  import LoginModal from '$lib/components/organisms/LoginModal.svelte'
  import RegisterModal from '$lib/components/organisms/RegisterModal.svelte'
  import Following from '$lib/components/organisms/Following.svelte'
  import { get } from 'svelte/store'
  import { userProfile } from '$lib/stores/user'

  let loginModal: boolean
  let registerModal: boolean
  let sidebarCollapsed: boolean = get(page).path !== '/'

  const { navigating } = getStores()

  $: if ($navigating) {
    console.log($navigating)
    if ((<any>$navigating.to).path !== '/') sidebarCollapsed = true
    else sidebarCollapsed = false
  }
</script>

<Header
  on:login-modal={() => (loginModal = !loginModal)}
  on:register-modal={() => (registerModal = !registerModal)}
/>
{#if $userProfile}
  <Following bind:collapsed={sidebarCollapsed} />
{/if}
<main>
  <slot />
</main>

{#if loginModal}
  <LoginModal on:close={() => (loginModal = false)} />
{/if}
{#if registerModal}
  <RegisterModal on:close={() => (registerModal = false)} />
{/if}
