<script lang="ts">
	let { data, children } = $props();
	import { page } from '$app/state';

	function encodeBase64Url(str: string) {
		const base64 = btoa(unescape(encodeURIComponent(str)));
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	}

	let currentPathDerived = $derived(page.url.pathname);

	let currentPath = $state('/');

	$effect(() => {
		if (currentPathDerived !== '/login' && currentPathDerived !== '/register') {
			currentPath = currentPathDerived;
		}
	});

	let b64encodedPath = $derived(encodeBase64Url(currentPath));
</script>

<svelte:head>
	<title>Centrala Trust for Ornithology</title>
</svelte:head>

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
			<a href="/login?redirect={b64encodedPath}">Sign in</a>
			<a href="/register?redirect={b64encodedPath}">Sign up</a>
		{/if}
	</div>
</div>

{@render children?.()}

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

	:global(button:disabled) {
		background-color: #ccc;
		cursor: not-allowed;
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
