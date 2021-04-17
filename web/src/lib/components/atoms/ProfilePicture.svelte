<script lang="ts">
  export let src: string
  export let alt: string
</script>

<style>
  img {
    border-radius: 50%;
    width: var(--step-1);
    height: var(--step-1);
  }
</style>

<img {src} {alt} />
