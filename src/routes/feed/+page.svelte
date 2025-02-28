<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Modal from '$lib/Modal.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	interface PostResponse {
		author: {
			id: string;
			username: string;
		};
		bird: string;
		comment: string;
		dateTimeOfObservation: Date;
		duration: number;
		id: string;
		image: {
			url: string;
			thumbnail: string;
		};
		location: string;
		activity: string;
		authorId: string;
		imageId: string;
	}

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

	let editingPost: PostResponse;
	let editingPostDate: { date: string; time: string };

	let imageFile: File | null = null;
	let modalImageLink: string;

	let uploadButton: HTMLButtonElement;

	let imageLoading = false;

	let searchQuery = '';

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

	function openEditModal(post: PostResponse) {
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

	function filterPosts(posts: PostResponse[], query: string) {
		if (!query) return posts;
		const lowerCaseQuery = query.toLowerCase();
		return posts.filter(
			(post) =>
				post.author.username.toLowerCase().includes(lowerCaseQuery) ||
				post.location.toLowerCase().includes(lowerCaseQuery) ||
				post.bird.toLowerCase().includes(lowerCaseQuery) ||
				post.comment.toLowerCase().includes(lowerCaseQuery)
		);
	}
</script>

<div class="main-flex">
	<div class="main-container">
		{#if data.loggedIn}
			<div class="actions">
				<input type="text" placeholder="Search..." bind:value={searchQuery} class="search-bar" />
				<button onclick={toggleUploadForm}>Upload</button>
			</div>
		{/if}
		<div class="posts">
			{#each filterPosts(data.posts, searchQuery) as post (post.id)}
				<div
					class="post-template"
					transition:fly|global={{ y: 200, duration: 500 }}
					animate:flip={{ duration: 250 }}
				>
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
						<div
							class="post-image"
							tabindex="0"
							role="button"
							onclick={() => openImageModal(post.image.url)}
							onkeydown={(e) => e.key === 'Enter' && openImageModal(post.image.url)}
						>
							<img src={post.image.thumbnail} alt="Observation of a bird" />
						</div>
					{/if}
					{#if data.id === post.author.id}
						<button class="delete-button" onclick={() => handleDelete(post.id)}>Delete</button>
						<button class="edit-button" onclick={() => openEditModal(post)}>Edit</button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

{#if showSubmitModal}
	<Modal show={showSubmitModal} close={closeModal}>
		{#snippet header()}
			<h2>Upload New Observation</h2>
			<button class="close-button" onclick={closeModal}>×</button>
		{/snippet}
		<form onsubmit={handleSubmit} method="post" action="?/post" enctype="multipart/form-data">
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
					onchange={handleFileChange}
				/>
			</div>
			<button bind:this={uploadButton} type="submit">Submit Observation</button>
		</form>
	</Modal>
{/if}

{#if showImageModal}
	<Modal show={showImageModal} close={closeImageModal}>
		{#snippet header()}
			<h2>Observation Image</h2>
			<button class="close-button" onclick={closeImageModal}>×</button>
		{/snippet}
		{#if imageLoading}
			<div class="loading-indicator">Loading...</div>
		{/if}
		<img
			src={modalImageLink}
			alt="Observation of a bird"
			onload={handleImageLoad}
			class:loading={imageLoading}
		/>
	</Modal>
{/if}

{#if showEditModal}
	<Modal show={showEditModal} close={closeEditModal}>
		{#snippet header()}
			<h2>Edit Observation</h2>
			<button class="close-button" onclick={closeEditModal}>×</button>
		{/snippet}
		<form onsubmit={handleEditSubmit} method="post" action="?/edit">
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

	.modal-image {
		max-width: 90%;
		max-height: 90%;
		overflow: auto;
		width: auto;
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

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20px 0;
	}

	.search-bar {
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		width: 100%;
		max-width: 300px;
		margin-right: 10px;
	}
</style>
