<script lang="ts">
  import { onMount } from 'svelte'
  import iconArrow from './icon-arrow'
  import iconSpinner from './icon-spinner'
  import { initMap, updateMap } from './map'
  import { query } from './query'
  import { registerValidator } from './utils'

  const isDebug = true

  let ipaddress = ''
  let location = ''
  let timezone = ''
  let isp = ''
  let lat = 0
  let lng = 0
  let error: Error | undefined

  if (isDebug) {
    ipaddress = '192.160.0.123'
    location = 'My Location, <small>Somwhere, Someplace, Some Country</small>'
    timezone = 'Stockholm/Europe'
    isp = 'Some Special ISP'
  }

  let ipquery = ''
  let inProgress = false

  const queryLow = async () => {
    try {
      error = undefined
      const res = await query(ipquery)
      inProgress = false

      if (res) {
        ipaddress = res.ip
        location = `${res.city} <small>${res.district} ${res.region}, ${res.country_name}</small>`
        timezone = `${res.timezone_name}`
        isp = res.isp
        lng = res.longitude
        lat = res.latitude

        updateMap([lat, lng])
      }
    } catch (err: unknown) {
      error = err as Error
      inProgress = false
    }
  }

  function doSearch(e: Event) {
    e.preventDefault()
    inProgress = true
    queryLow()
    return false
  }

  onMount(() => {
    initMap([lat, lng])
    if (!isDebug) {
      queryLow().catch((e: Error) => (error = e))
    }
    registerValidator(document.querySelector('input[type="search"]'))
  })
</script>

<header>
  <h1>IP Address Tracker</h1>
  <form on:submit={doSearch}>
    <input
      type="search"
      name="ip"
      placeholder="Search IP address or domain"
      disabled={inProgress}
      bind:value={ipquery}
    />
    <button aria-label="Search" disabled={inProgress}>
      {@html inProgress ? iconSpinner : iconArrow}
    </button>
  </form>
  <div
    class="content"
    class:init={!error && !ipaddress}
    class:error={!!error}
    class:in-progress={inProgress}
    class:valid={!!ipaddress}
  >
    {#if error}
      <dl>
        <dt>Error</dt>
        <dd>{error.message}</dd>
      </dl>
    {:else}
      <dl>
        <dt>IP address</dt>
        <dd>{ipaddress}</dd>
      </dl>
      <dl>
        <dt>Location</dt>
        <dd>{@html location}</dd>
      </dl>
      <dl>
        <dt>Timezone</dt>
        <dd>{timezone}</dd>
      </dl>
      <dl>
        <dt>ISP</dt>
        <dd>{isp}</dd>
      </dl>
    {/if}
  </div>
</header>

<main id="map" class:init={!error && !ipaddress} />
<footer class="attribution">
  Challenge by
  <a href="https://www.frontendmentor.io?ref=challenge" target="_blank"
    >Frontend Mentor</a
  >. Coded by <a href="https://github.com/poppa/">Pontus Östlund</a>.
</footer>

<style lang="scss">
  @import 'app';
</style>
