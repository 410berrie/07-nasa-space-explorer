// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// ===== API Configuration =====
// Replace 'YOUR_API_KEY_HERE' with your free NASA API key from https://api.nasa.gov
const API_KEY = 'OiMSOVnbCgqBJjsHygp2qHanySjuEVIQkbQktK7i';
const API_URL = 'https://api.nasa.gov/planetary/apod';

// ===== DOM Element References =====
// Get references to elements we'll interact with
const getImagesButton = document.querySelector('button');
const gallery = document.getElementById('gallery');
const loadingMessage = document.getElementById('loadingMessage');
const imageModal = document.getElementById('imageModal');
const closeButton = document.querySelector('.close-button');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalMediaButton = document.getElementById('modalMediaButton');

// ===== Fetch Images from NASA APOD API =====
// Function to fetch space images for the selected date range
function fetchSpaceImages() {
	// Get the selected start and end dates from the date inputs
	const startDate = startInput.value;
	const endDate = endInput.value;

	// Show loading message and clear the gallery
	loadingMessage.style.display = 'block';
	gallery.innerHTML = '';

	// Build the API URL with the date range
	const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

	// Fetch the data from NASA API
	fetch(url)
		.then((response) => {
			// Check if the response is successful
			if (!response.ok) {
				throw new Error(`API Error: ${response.status}`);
			}
			// Convert the response to JSON
			return response.json();
		})
		.then((data) => {
			// Display the fetched images in the gallery
			// Limit to maximum 9 items
			displayGallery(data.slice(0, 9));

			// Hide the loading message after the gallery has rendered
			loadingMessage.style.display = 'none';
		})
		.catch((error) => {
			// Hide loading message on error
			loadingMessage.style.display = 'none';

			// Display error message to user
			gallery.innerHTML = `<p style="color: #FC3D21; padding: 20px; text-align: center;">Error loading images: ${error.message}</p>`;
			console.error('API Error:', error);
		});
}

// ===== Display Gallery Items =====
// Function to create and display gallery items from API data
function displayGallery(images) {
	// Clear any existing gallery content
	gallery.innerHTML = '';

	// Check if we got any images
	if (images.length === 0) {
		gallery.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No images found for this date range.</p>';
		return;
	}

	// Loop through each media entry and create a gallery item
	images.forEach((entry) => {
		// Create a new gallery item div
		const item = document.createElement('div');
		item.className = 'gallery-item';

		// Render image cards
		if (entry.media_type === 'image') {
			item.innerHTML = `
				<img src="${entry.url}" alt="${entry.title}" />
				<h3>${entry.title}</h3>
				<p>${entry.date}</p>
			`;

			// Open modal for images
			item.addEventListener('click', () => {
				openModal(entry);
			});
		}

		// Render video cards with a button to open media in a new tab
		if (entry.media_type === 'video') {
			item.innerHTML = `
				<img src="img/NASA-Logo-Large.jpg" alt="NASA logo placeholder for video" class="video-placeholder" />
				<h3>${entry.title}</h3>
				<p>${entry.date}</p>
				<a class="media-link-button" href="${entry.url}" target="_blank" rel="noopener noreferrer">View Media</a>
			`;

			// Open modal with video details when card is clicked
			item.addEventListener('click', () => {
				openModal(entry);
			});

			// Keep the media link button behavior (new tab) without triggering card click modal
			const mediaButton = item.querySelector('.media-link-button');
			mediaButton.addEventListener('click', (event) => {
				event.stopPropagation();
			});
		}

		// Add only supported media entries to the page
		if (entry.media_type === 'image' || entry.media_type === 'video') {
			gallery.appendChild(item);
		}
	});
}

// ===== Modal Functions =====
// Function to open the modal and display full media details
function openModal(media) {
	// Reset modal media content
	modalMedia.innerHTML = '';

	// Render image media
	if (media.media_type === 'image') {
		modalMedia.innerHTML = `<img src="${media.hdurl || media.url}" alt="${media.title}" />`;
	}

	// Render video media
	if (media.media_type === 'video') {
		// Some APOD video sources block iframe embedding, so we show a safe placeholder in modal.
		modalMedia.innerHTML = '<img src="img/NASA-Logo-Large.jpg" alt="NASA logo placeholder for video" class="video-placeholder" />';
	}

	// Set the modal content with the selected media data
	modalTitle.textContent = media.title || 'Untitled';
	modalDate.textContent = `Date: ${media.date || 'Unknown date'}`;
	modalExplanation.textContent = media.explanation || 'No description available for this entry.';

	// Set modal button to open the current media in a new tab
	modalMediaButton.href = media.url;
	modalMediaButton.textContent = media.media_type === 'video' ? 'View Video' : 'View Full Image';

	// Display the modal
	imageModal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
	imageModal.style.display = 'none';
}

// ===== Event Listeners =====
// Listen for click on the "Get Space Images" button
getImagesButton.addEventListener('click', fetchSpaceImages);

// Close modal when the close button is clicked
closeButton.addEventListener('click', closeModal);

// Close modal when user clicks on the dark background (outside the modal content)
imageModal.addEventListener('click', (event) => {
	// Only close if clicking on the modal background, not the modal content itself
	if (event.target === imageModal) {
		closeModal();
	}
});

// Close modal when user presses the Escape key
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closeModal();
	}
});
