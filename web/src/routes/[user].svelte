<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async function ({ page, fetch, session, context }) {
    const url = import.meta.env.PROD
      ? `https://devex.jonahgold.dev/api/user/${page.params.user}`
      : `http://localhost:5000/api/user/${page.params.user}`
    const res = await fetch(url)
    const data = await res.json()

    if (!res.ok) return { status: res.status, error: data.error }
    return {
      props: {
        user: data.data.user,
      },
    }
  }
</script>

<script lang="ts">
  import Stream from '$lib/components/organisms/Stream.svelte'

  export let user: {
    username: string
    live: boolean
    viewers: number
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<Stream
  {user}
  stream={import.meta.env.PROD
    ? `https://devex.jonahgold.dev/live/${user.username}.m3u8`
    : `http://localhost:8000/live/${user.username}.m3u8`}
  placeholder={import.meta.env.PROD
    ? `https://devex.jonahgold.dev/thumbnails/${user.username}.jpg`
    : `http://localhost:8000/thumbnails/${user.username}.jpg`}
/>
