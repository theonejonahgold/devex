<style>
  p {
    color: var(--red);
    border: 2px solid var(--red);
    border-radius: 5px;
    padding: var(--half-space);
    margin-bottom: 0;
  }

  p :global(button) {
    all: unset;
    font-weight: 500;
    cursor: pointer;
  }
  p :global(button:hover) {
    text-decoration: underline;
  }
</style>

<p><slot /></p>
