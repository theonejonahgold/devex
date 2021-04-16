<script lang="typescript">
  import Header from '$lib/components/organisms/Header.svelte'
  import Sidebar from '$lib/components/organisms/Sidebar.svelte'
  import '../app.css'
</script>

<Header />
<Sidebar />
<main>
  <slot />
</main>
