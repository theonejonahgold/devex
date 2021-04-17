<script lang="ts">
  export let message: ChatMessageType
</script>

<style>
  li {
    margin: var(--base-space) 0;
  }

  p {
    hyphens: auto;
    line-height: 1.5;
  }

  strong {
    color: hsl(var(--hue), 100%, 75%);
  }
</style>

<li>
  <p>
    <strong style="--hue: {message.hue}">{message.user}:</strong>
    {message.message}
  </p>
</li>
