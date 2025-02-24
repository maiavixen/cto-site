<script>
	export let data;
</script>

<div class="navbar">
	<div class="logo">
		<img src="CTO-Logo.svg" alt="Centrala Trust for Ornithology" class="logo-navbar" />
		<p>Centrala Trust for Ornithology</p>
	</div>
	<div class="buttons">
		<a href="feed">Feed</a>
		{#if data.loggedIn}
			<a href="/logout">Sign out</a>
		{:else}
			<a href="/login">Sign in</a>
			<a href="/register">Sign up</a>
		{/if}
	</div>
</div>

<slot />

<style>
	@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300..900&display=swap');

	:global(*) {
		font-family: 'Darker Grotesque', sans-serif;
		font-optical-sizing: auto;
		margin: 0;
		padding: 0;
		box-sizing: border-box;

		--main-color: #2e8b57;
		--secondary-color: #ecca6f;
	}

	:global(body) {
		font-family: 'Darker Grotesque', sans-serif;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		color: #333;
		background-color: #fff;
	}

	:global(button) {
		margin-top: 1rem;
		padding: 0.75rem;
		font-size: 1.25rem;
		background-color: var(--secondary-color);
		border: none;
		cursor: pointer;
		font-family: 'Darker Grotesque', sans-serif;
	}

	:global(button:hover) {
		background-color: var(--main-color);
	}

	.navbar {
		display: flex;
		justify-content: center;
		align-items: center;
		justify-content: space-between;
		height: 90px;
		background-color: var(--main-color);
		color: white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		padding: 8px;
	}

	.buttons {
		margin-left: auto;
	}

	.navbar a {
		color: white;
		text-decoration: none;
		margin: 0 10px;
		font-size: 24px;
	}

	.navbar a:hover {
		text-decoration: underline;
		color: var(--secondary-color);
	}

	.logo p {
		font-size: 24px;
		font-weight: 400;
	}

	.logo-navbar {
		height: 35px;
		fill: white;
		filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2));
	}
</style>
