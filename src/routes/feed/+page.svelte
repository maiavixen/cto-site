<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/Modal.svelte';
	import type { Post } from '@prisma/client';
	import { fly } from 'svelte/transition';

	export let data;

	const birdtypes = [
		'Wood Pigeon',
		'House Sparrow',
		'Starling',
		'Blue Tit',
		'Blackbird',
		'Robin',
		'Goldfinch',
		'Magpie'
	];

	const activityTypes = ['Visit', 'Feeding', 'Nesting'];

	const regions = [
		'Erean',
		'Brunad',
		'Bylyn',
		'Docia',
		'Marend',
		'Pryn',
		'Zord',
		'Yaean',
		'Frestin',
		'Stonyam',
		'Ryall',
		'Ruril',
		'Keivia',
		'Tallan',
		'Adohad',
		'Obelyn',
		'Holmer',
		'Vertwall'
	];

	let showSubmitModal = false;
	let showImageModal = false;
	let showEditModal = false;

	let editingPost: Post;
	let editingPostDate: {};

	let imageFile: File | null = null;
	let modalImageLink: string;

	let uploadButton: HTMLButtonElement;

	let imageLoading = false;

	function getMonthString(month: number) {
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		return monthNames[month];
	}

	function formatTimeUnits(minute: number) {
		// Set "minute" to "minutes" if it's plural and hours if over 60
		if (minute === 1) {
			return `${minute} minute`;
		} else if (minute < 60) {
			return `${minute} minutes`;
		} else {
			const hours = Math.floor(minute / 60);
			const remainingMinutes = minute % 60;
			return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
		}
	}

	function formatDateTime(dateTime: Date) {
		const date = new Date(dateTime);
		const day = date.getDate();
		const month = getMonthString(date.getMonth());
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${day} of ${month}, ${year} at ${hours}:${minutes}`;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		uploadButton.disabled = true;
		uploadButton.innerHTML = 'Uploading...';

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const response = await fetch(form.action, {
			method: form.method,
			body: formData
		});

		if (response.ok) {
			invalidateAll();
			closeModal();
		} else {
			uploadButton.disabled = false;
			uploadButton.innerHTML = 'Submit Observation';
			alert('Failed to upload observation');
		}
	}

	async function handleEditSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const response = await fetch(form.action, {
			method: form.method,
			body: formData
		});

		if (response.ok) {
			invalidateAll();
			closeEditModal();
		} else {
			alert('Failed to edit observation');
		}
	}

	function handleDelete(postId: string) {
		fetch(`?/delete`, {
			method: 'POST',
			body: new URLSearchParams({ postid: postId })
		}).then(() => {
			invalidateAll();
		});
	}

	function toggleUploadForm() {
		showSubmitModal = !showSubmitModal;
	}

	function closeModal() {
		showSubmitModal = false;
	}

	function closeImageModal() {
		showImageModal = false;
	}

	function closeEditModal() {
		showEditModal = false;
	}

	function openEditModal(post: Post) {
		editingPost = post;
		const date = new Date(post.dateTimeOfObservation);
		editingPostDate = {
			date: date.toISOString().split('T')[0],
			time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
		};
		showEditModal = true;
	}

	function handleModalClick(event: Event) {
		// Prevent clicks inside the modal from closing it
		event.stopPropagation();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length) {
			imageFile = target.files[0];
		}
	}

	function openImageModal(imageLink: string) {
		modalImageLink = imageLink;
		imageLoading = true;
		showImageModal = true;
	}

	function handleImageLoad() {
		imageLoading = false;
	}
</script>

<div class="main-flex">
	<div class="main-container">
		<!-- Example post -->
		<!--
            Requested data:
            Username
            Location (from a supplied list of Centrala areas)
            Time of observation
            Date of observation
            Bird (from a CTO supplied list plus Other/Unknown)
            Primary activity (visit/feeding/nesting/Other)
            Duration of observation (in minutes)
            Free text comments
            Photographic image (optional; max 1.2 Megabytes in size; png or jpg only)
        -->
		{#if data.loggedIn}
			<!-- Upload button -->
			<div class="activate-upload">
				<button on:click={toggleUploadForm}>Upload</button>
			</div>
		{/if}
		<div class="posts">
			{#each data.posts as post (post.id)}
				<div class="post-template" transition:fly|global={{ y: 200, duration: 500 }}>
					<div class="post-info">
						<div class="username"><strong>Username:</strong> {post.author.username}</div>
						<div class="location"><strong>Location:</strong> {post.location}</div>
						<div class="date-time">
							<span
								><strong>Date and Time:</strong> {formatDateTime(post.dateTimeOfObservation)}</span
							>
						</div>
						<div class="bird"><strong>Bird:</strong> {post.bird}</div>
						<div class="activity">
							<strong>Activity:</strong>
							{post.activity} | <strong>Duration:</strong>
							{formatTimeUnits(post.duration)}
						</div>
						<div class="comments"><strong>Comments:</strong> {post.comment}</div>
					</div>
					{#if post.image}
						<div class="post-image" on:click={() => openImageModal(post.image.url)}>
							<img src={post.image.thumbnail} alt="Observation of a bird" />
						</div>
					{/if}
					{#if data.id === post.author.id}
						<button class="delete-button" on:click={() => handleDelete(post.id)}>Delete</button>
						<button class="edit-button" on:click={() => openEditModal(post)}>Edit</button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

{#if showSubmitModal}
	<Modal show={showSubmitModal} on:close={closeModal}>
		<span slot="header">
			<h2>Upload New Observation</h2>
			<button class="close-button" on:click={closeModal}>×</button>
		</span>
		<form on:submit={handleSubmit} method="post" action="?/post" enctype="multipart/form-data">
			<div class="form-group">
				<label for="location">Location:</label>
				<select name="location" id="location">
					{#each regions as region}
						<option value={region}>{region}</option>
					{/each}
				</select>
			</div>
			<div class="form-group date-time">
				<div>
					<label for="obsDate">Date:</label>
					<input name="date" id="obsDate" type="date" required />
				</div>
				<div>
					<label for="obsTime">Time:</label>
					<input name="time" id="obsTime" type="time" required />
				</div>
			</div>
			<div class="form-group">
				<label for="bird">Bird:</label>
				<select name="bird" id="bird" required>
					{#each birdtypes as birdtype}
						<option value={birdtype}>{birdtype}</option>
					{/each}
				</select>
			</div>
			<div class="form-group">
				<label for="activity">Primary Activity:</label>
				<select name="activity" id="activity" required>
					{#each activityTypes as activityType}
						<option value={activityType}>{activityType}</option>
					{/each}
				</select>
			</div>
			<div class="form-group">
				<label for="duration">Duration (minutes):</label>
				<input name="duration" id="duration" type="number" required />
			</div>
			<div class="form-group">
				<label for="comments">Comments:</label>
				<textarea name="comments" id="comments"></textarea>
			</div>
			<div class="form-group">
				<label for="imageFile">Photographic image:</label>
				<input
					name="image"
					id="imageFile"
					type="file"
					accept=".png, .jpg, .jpeg"
					on:change={handleFileChange}
				/>
			</div>
			<button bind:this={uploadButton} type="submit">Submit Observation</button>
		</form>
	</Modal>
{/if}

{#if showImageModal}
	<Modal show={showImageModal} on:close={closeImageModal}>
		<span slot="header">
			<h2>Observation Image</h2>
			<button class="close-button" on:click={closeImageModal}>×</button>
		</span>
		{#if imageLoading}
			<div class="loading-indicator">Loading...</div>
		{/if}
		<img
			src={modalImageLink}
			alt="Observation of a bird"
			on:load={handleImageLoad}
			class:loading={imageLoading}
		/>
	</Modal>
{/if}

{#if showEditModal}
	<Modal show={showEditModal} on:close={closeEditModal}>
		<span slot="header">
			<h2>Edit Observation</h2>
			<button class="close-button" on:click={closeEditModal}>×</button>
		</span>
		<form on:submit={handleEditSubmit} method="post" action="?/edit">
			<div class="form-group">
				<label for="location">Location:</label>
				<select name="location" id="location" bind:value={editingPost.location}>
					{#each regions as region}
						<option value={region}>{region}</option>
					{/each}
				</select>
			</div>
			<div class="form-group date-time">
				<div>
					<label for="obsDate">Date:</label>
					<input name="date" id="obsDate" type="date" bind:value={editingPostDate.date} required />
				</div>
				<div>
					<label for="obsTime">Time:</label>
					<input name="time" id="obsTime" type="time" bind:value={editingPostDate.time} required />
				</div>
			</div>
			<div class="form-group">
				<label for="bird">Bird:</label>
				<select name="bird" id="bird" bind:value={editingPost.bird} required>
					{#each birdtypes as birdtype}
						<option value={birdtype}>{birdtype}</option>
					{/each}
				</select>
			</div>
			<div class="form-group">
				<label for="activity">Primary Activity:</label>
				<select name="activity" id="activity" bind:value={editingPost.activity} required>
					{#each activityTypes as activityType}
						<option value={activityType}>{activityType}</option>
					{/each}
				</select>
			</div>
			<div class="form-group">
				<label for="duration">Duration (minutes):</label>
				<input
					name="duration"
					id="duration"
					type="number"
					bind:value={editingPost.duration}
					required
				/>
			</div>
			<div class="form-group">
				<label for="comments">Comments:</label>
				<textarea name="comments" id="comments" bind:value={editingPost.comment}></textarea>
			</div>
			<input type="hidden" name="postid" value={editingPost.id} />
			<button bind:this={uploadButton} type="submit">Submit Edit</button>
		</form>
	</Modal>
{/if}

<style>
	.main-flex {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.main-container {
		width: 100%;
		max-width: 1200px;
		padding: 0 20px;
	}

	.posts {
		margin: 2em 0;
	}

	.activate-upload {
		display: flex;
		justify-content: flex-end;
		margin: 20px 0;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	.form-group {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
	}
	.form-group.date-time {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	label {
		margin-bottom: 0.5rem;
	}
	input,
	textarea,
	button,
	select {
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
	}

	.post-template img {
		cursor: pointer;
	}

	.post-template img:hover {
		opacity: 0.8;
	}

	.post-template {
		display: flex;
		background: #f9f9f9;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 16px;
		margin-bottom: 20px;
		align-items: center;
		border: 1px rgb(234, 234, 234) solid;
	}

	.post-info {
		flex: 1;
		padding-right: 16px;
	}

	.post-info > div {
		margin-bottom: 8px;
	}

	.date-time span {
		margin-right: 12px;
	}

	.post-image {
		flex: 0 0 150px;
		text-align: center;
	}

	.post-image img {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
	}
	.delete-button {
		background-color: #ff4d4d;
		color: white;
		border: none;
		padding: 8px 16px;
		cursor: pointer;
		margin-right: 8px;
	}

	.delete-button:hover {
		background-color: #ff6666;
	}

	.edit-button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 8px 16px;
		cursor: pointer;
	}

	.edit-button:hover {
		background-color: #6ac582;
	}

	.loading-indicator {
		text-align: center;
		font-size: 1.5rem;
		padding: 20px;
	}

	img.loading {
		display: none;
	}
</style>
