<script context="module">
  import { getApiURL } from '$lib/utils/fetch'

  import type { Load } from '@sveltejs/kit'

  export const load: Load = async function ({ fetch }) {
    const res = await fetch(getApiURL() + '/languages')
    const json = await res.json()
    return {
      props: {
        languages: json.data.languages,
      },
    }
  }
</script>

<script lang="ts">
  import LanguageItem from '$lib/components/molecules/LanguageItem.svelte'

  export let languages: Language[] = []
</script>

<style>
  div {
    display: grid;
    grid-template-rows: min-content 1fr;
    overflow: hidden;
    padding: var(--base-space);
    height: 100%;
  }

  h2 {
    margin-bottom: var(--base-space);
  }

  ul {
    align-self: start;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-flow: row wrap;
    overflow: hidden scroll;
    width: 100%;
    max-height: 100%;
  }

  li {
    margin-right: var(--base-space);
    margin-bottom: var(--base-space);
  }
</style>

<svelte:head>
  <title>Languages - DevEx</title>
  <meta
    name="description"
    content="All programming languages available on this site"
  />
</svelte:head>

<div>
  <h2>Languages</h2>
  <ul>
    {#each languages as language}
      <li>
        <LanguageItem {language} />
      </li>
    {/each}
  </ul>
</div>
