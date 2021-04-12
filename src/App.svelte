<script lang="ts">
  import { onMount } from 'svelte'
  import iconArrow from './icon-arrow'
  import { initMap, updateMap } from './map'
  import { query } from './query'

  let ipaddress = '192.212.174.101'
  let location = 'Brooklyn, NY 10001'
  let timezone = 'UTC -05:00'
  let isp = 'SpaceX Starlink'
  let lat = 51.505
  let lng = -0.09

  let ipquery = ''
  let inProgress = false

  function doSearch(e: Event) {
    e.preventDefault()
    inProgress = true

    const queryLow = async () => {
      const res = await query(ipquery)
      inProgress = false

      if (res) {
        ipaddress = res.ip
        location = `${res.location.city}, ${res.location.region}, ${res.location.country}`
        timezone = `UTC ${res.location.timezone}`
        isp = res.isp
        lng = res.location.lng
        lat = res.location.lat

        updateMap([lat, lng])
      }
    }

    queryLow()

    return false
  }

  onMount(() => {
    initMap([lat, lng])
  })
</script>

<header>
  <h1>IP Address Tracker</h1>
  <form on:submit={doSearch}>
    <input
      type="text"
      name="ip"
      placeholder="Search for IP address or domain"
      disabled={inProgress}
      bind:value={ipquery}
    />
    <button aria-label="Search" disabled={inProgress}>
      {@html iconArrow}
    </button>
  </form>
  <dl>
    <dt>IP address</dt>
    <dd>{ipaddress}</dd>
    <dt>Location</dt>
    <dd>{location}</dd>
    <dt>Timezone</dt>
    <dd>{timezone}</dd>
    <dt>ISP</dt>
    <dd>{isp}</dd>
  </dl>
</header>

<main id="map" />
<footer class="attribution">
  Challenge by
  <a href="https://www.frontendmentor.io?ref=challenge" target="_blank"
    >Frontend Mentor</a
  >. Coded by <a href="https://github.com/poppa/">Pontus Östlund</a>.
</footer>

<style>
  header {
    z-index: 2;
    position: relative;
    height: var(--header-height);
    padding: var(--padding);
    padding-top: var(--element-spacing);
    background-image: url('/images/pattern-bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    margin: 0;
    color: var(--clr-white);
    font-weight: 500;
    line-height: 1;
    font-size: var(--fs-title);
  }

  form {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: row;
    align-content: stretch;
    margin-top: var(--element-spacing);
  }

  input {
    display: block;
    border: 0;
    background: var(--clr-white);
    font-size: var(--fs-input);
    border-top-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    padding: var(--padding);
    flex-grow: 1;
  }

  input:focus:not(:disabled) {
    outline: 0;
  }

  input:disabled {
    color: var(--clr-gray-500);
  }

  button {
    background: var(--clr-black);
    color: var(--clr-white);
    border: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.5em;
    height: 100%;
    border-top-right-radius: var(--br);
    border-bottom-right-radius: var(--br);
  }

  button:hover:not(:disabled) {
    background-color: var(--clr-gray-800);
  }

  button:disabled {
    color: var(--clr-gray-500);
  }

  button :global(svg) {
    stroke: currentColor;
  }

  dl {
    background-color: var(--clr-white);
    margin: var(--element-spacing) 0 0;
    padding: var(--padding);
    width: 100%;
    max-width: var(--max-width);
    border-radius: var(--br);
    text-align: center;
    box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.4);
  }
  dt {
    text-transform: uppercase;
    color: var(--clr-gray-500);
    font-weight: 700;
    font-size: var(--fs-label);
    letter-spacing: 0.1em;
  }

  dd {
    font-weight: 500;
    font-size: var(--fs-value);
    color: var(--clr-gray-800);
    margin-left: 0;
    margin-top: 0.4em;
  }

  dd + dt {
    margin-top: calc(var(--padding) * 1.5);
  }

  @media screen and (min-width: 500px) {
    dl {
      display: grid;
      grid-auto-columns: 1fr;
      grid-template-columns: repeat(2, 1fr);
      align-items: center;
      gap: 0.5em;
    }

    dt {
      text-align: left;
      margin: 0;
    }

    dd {
      text-align: right;
      margin: 0;
    }
    dd + dt {
      margin-top: 0;
    }
  }

  @media screen and (min-width: 620px) {
    dl {
      padding: calc(var(--padding) * 1.5);
      grid-template-areas:
        'item1-dt item2-dt'
        'item1-dd item2-dd'
        'item3-dt item4-dt'
        'item3-dd item4-dd';
    }

    dt,
    dd {
      text-align: left;
      align-self: flex-start;
    }

    /* FIRST */
    dt:nth-of-type(1) {
      grid-area: item1-dt;
    }

    dd:nth-of-type(1) {
      grid-area: item1-dd;
    }

    /* SECOND */

    dt:nth-of-type(2) {
      grid-area: item2-dt;
    }

    dd:nth-of-type(2) {
      grid-area: item2-dd;
    }

    /* THIRD */

    dt:nth-of-type(3) {
      grid-area: item3-dt;
    }

    dd:nth-of-type(3) {
      grid-area: item3-dd;
    }

    /* FOURTH */
    dt:nth-of-type(4) {
      grid-area: item4-dt;
    }

    dd:nth-of-type(4) {
      grid-area: item4-dd;
    }
  }

  @media screen and (min-width: 960px) {
    dl {
      grid-template-areas:
        'item1-dt item2-dt item3-dt item4-dt'
        'item1-dd item2-dd item3-dd item4-dd';
    }
  }

  main {
    z-index: 1;
    position: relative;
    height: var(--main-height);
  }

  .attribution {
    display: none;
  }
</style>
