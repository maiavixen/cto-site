<script>
	import { enhance } from '$app/forms';

    export let form;

	let email = '';
	let password = '';
</script>

<div class="page-contents">
	<div class="hero-background"></div>
	<div class="form-container">
		<img src="CTO-Logo.svg" alt="Centrala Trust for Ornithology" />
		<h1>Sign in</h1>
		<form method="post" use:enhance>
            {#if form?.message}
                <p>{form.message}</p>
            {/if}
			<label for="username">Username</label>
			<input autocomplete="username" name="username" id="username" type="text" bind:value={email} required />

			<label for="password">Password</label>
			<input autocomplete="current-password" name="password" id="password" type="password" bind:value={password} required />

			<button type="submit">Login</button>
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
</style>
