<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let redirectTo = $state('');
	onMount(() => {
		redirectTo = page.url.searchParams.get('redirect') ?? '';
	});

	let username = $state('');
	let password = $state('');
	let invite = $state('');

	let userError = $derived(username.length < 3);
	let passwordError = $derived(password.length < 8);
	let inviteError = $derived(invite === '');

	let registerDisabled = $derived(userError || passwordError || inviteError);
</script>

<svelte:head>
	<title>Register - Centrala Trust for Ornithology</title>
</svelte:head>

<div class="page-contents">
	<div class="hero-background"></div>
	<div class="form-container">
		<img src="CTO-Logo.svg" alt="Centrala Trust for Ornithology" />
		<h1>Sign up</h1>
		<form use:enhance method="post">
			{#if form?.message}
				<p>{form.message}</p>
			{/if}
			<input name="redirect-to" type="hidden" value={redirectTo} />
			<input
				autocomplete="username"
				name="username"
				id="username"
				type="text"
				bind:value={username}
				class:errorform={userError}
				required
			/>

			<label for="password">Password</label>
			<input
				autocomplete="new-password"
				name="password"
				id="password"
				type="password"
				bind:value={password}
				class:errorform={passwordError}
				required
			/>

			<label for="invite-code">Invite code</label>
			<input
				type="password"
				name="invite-code"
				id="invite-code"
				bind:value={invite}
				class:errorform={inviteError}
				required
				title="If you don't know what this is, check the guide I sent alongside the URL to this assignment!"
			/>

			<button type="submit" disabled={registerDisabled}>Register</button>
		</form>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300..900&display=swap');

	* {
		font-family: 'Darker Grotesque', sans-serif;
		font-optical-sizing: auto;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		--main-color: #2e8b57;
		--secondary-color: #ecca6f;
	}

	.page-contents {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 90px);
		color: white;
	}

	.hero-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url('/hero-image.jpg');
		background-size: cover;
		background-position: center;
		filter: blur(8px);
		z-index: -1;
	}

	.form-container {
		background-color: rgba(0, 0, 0, 0.7);
		padding: 2rem;
		text-align: center;
		margin-top: 2rem;
	}

	.form-container h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 24em;
	}

	label {
		font-size: 1.25rem;
	}

	input {
		padding: 0.5rem;
		font-size: 1rem;
		outline: none;
	}

	button {
		margin-top: 1rem;
		padding: 0.75rem;
		font-size: 1.25rem;
		background-color: var(--secondary-color);
		border: none;
		cursor: pointer;
	}

	button:hover {
		filter: brightness(1.1);
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.errorform {
		border: 2px solid red;
	}
</style>
