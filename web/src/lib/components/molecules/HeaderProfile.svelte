<script lang="ts">
  import { userProfile } from '$lib/stores/user'
</script>

<style>
  a {
    font-size: var(--step-1);
    color: var(--primary);
    background: var(--secondary);
    border: 2px solid var(--secondary);
    border-radius: 5px;
    cursor: pointer;
    padding: 0.125em 0.375em;
    text-decoration: none;
    margin-left: auto;
    font-weight: bold;
    font-family: var(--font-heading);
  }

  a:hover,
  a:focus {
    border-color: var(--green);
    outline: none;
  }
</style>

<a href="/{$userProfile?.username}">{$userProfile?.username}</a>
