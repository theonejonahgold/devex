<script lang="typescript">
  import '../app.css'
  import Header from '$lib/components/organisms/Header.svelte'
  import Sidebar from '$lib/components/organisms/Sidebar.svelte'
</script>

<Header />
<Sidebar />
<main>
  <slot />
</main>
