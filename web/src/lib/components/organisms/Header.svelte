<style>
  header {
    padding: var(--half-space) var(--base-space);
    display: flex;
    grid-area: header;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    align-items: center;
  }

  header :global(*) {
    margin: 0;
  }

  ul {
    display: flex;
    padding: 0;
    margin: 0;
    list-style: none;
  }
</style>

<header>
  <h1>DevEx</h1>
  <nav>
    <ul>
      <li>
        <a href="/">Discovery</a>
      </li>
      <li>
        <a href="/languages">Languages</a>
      </li>
    </ul>
  </nav>
</header>
