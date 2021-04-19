<script>
  export let language: Language
</script>

<style>
  a {
    width: 100%;
    height: 100%;
    display: block;
    background: var(--tertiary);
    border-radius: 6px;
    text-decoration: none;
    border: 2px solid var(--tertiary);
    padding: 0.125em 0.375em;
  }

  a:hover {
    color: var(--primary);
    border-color: var(--green);
  }

  article {
    width: 100%;
    height: 100%;
  }

  h1 {
    font-size: var(--step-0);
    font-weight: 400;
    line-height: 1;
  }
</style>

<a href="/languages/{language.slug}">
  {language.name}
</a>
