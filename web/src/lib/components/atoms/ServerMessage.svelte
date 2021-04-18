<script lang="ts">
  export let message: ServerMessageType
</script>

<style>
  li {
    margin: var(--half-space) 0 var(--base-space);
    font-size: var(--step--1);
    color: var(--primary);
  }
</style>

<li>
  {message.message}
</li>
