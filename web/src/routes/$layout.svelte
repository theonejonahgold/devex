<script lang="ts">
  import '../app.css'
  import { page, navigating } from '$app/stores'
  import Header from '$lib/components/organisms/Header.svelte'
  import LoginModal from '$lib/components/organisms/LoginModal.svelte'
  import RegisterModal from '$lib/components/organisms/RegisterModal.svelte'
  import Following from '$lib/components/organisms/Following.svelte'
  import { get } from 'svelte/store'
  import { userProfile } from '$lib/stores/user'
  import { tick } from 'svelte'
  import Onboarding from '$lib/components/organisms/Onboarding.svelte'
  import { onboardingDone } from '$lib/stores/onboarding'

  let loginModal: boolean
  let registerModal: boolean
  let unknownUsername: string

  let sidebarCollapsed: boolean =
    get(page).path !== '/' && !get(page).path.startsWith('/languages')

  $: if ($navigating) {
    if (
      (<any>$navigating.from).path !== '/' &&
      !(<any>$navigating.from).path.startsWith('/languages')
    ) {
      if (
        (<any>$navigating.to).path !== '/' &&
        !(<any>$navigating.to).path.startsWith('/languages')
      )
        sidebarCollapsed = true
      else sidebarCollapsed = false
    }
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
  <LoginModal
    on:close={() => (loginModal = false)}
    on:open-register={async data => {
      unknownUsername = data.detail.username
      loginModal = false
      await tick()
      registerModal = true
    }}
  />
{/if}

{#if registerModal}
  <RegisterModal
    bind:initialUsername={unknownUsername}
    on:close={() => {
      unknownUsername = ''
      registerModal = false
    }}
  />
{/if}

{#if !$onboardingDone}
  <Onboarding
    on:close={e => {
      if (e.detail.register) registerModal = true
      onboardingDone.set(true)
    }}
  />
{/if}
