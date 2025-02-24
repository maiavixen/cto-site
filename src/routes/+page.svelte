<div class="page-contents">
	<div class="main-hero">
		<div class="hero-background"></div>
		<div>
			<h1>Birdwatch Centrala</h1>
			<h2>Join the flock!</h2>
			<p>Share your bird sightings and help shape Centrala's urban wildlife future!</p>
		</div>
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

		/* set variable for main color */
		--main-color: #2e8b57;
		--secondary-color: #ecca6f;
	}

	.page-contents {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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

	.main-hero {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300px;
		height: calc(100vh - 90px);
		color: white;
		width: 100%;

		text-align: center;
	}

	.main-hero h1 {
		font-size: 5rem;
		text-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
		font-weight: 900;
	}

	.main-hero h2 {
		font-size: 3rem;
		text-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
	}

	.main-hero p {
		font-size: 2rem;
		text-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
	}
</style>
