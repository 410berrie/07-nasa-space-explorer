
// NOTE: You do not need to edit this file.

// NASA's APOD API only has images from June 16, 1995 onwards
const earliestDate = '1995-06-16';

// Get today's date in YYYY-MM-DD format (required by date inputs)
const today = new Date().toISOString().split('T')[0];

function setupDateInputs(startInput, endInput) {
  // Restrict date selection range from NASA's first image to today
  startInput.min = earliestDate;
  startInput.max = today;
  endInput.min = earliestDate;
  endInput.max = today;

  // Default: Show the most recent 9 days of space images
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 8); // minus 8 because it includes today
  startInput.value = lastWeek.toISOString().split('T')[0];
  endInput.value = today;

  // Prevent picking an end date before the selected start date
  endInput.min = startInput.value;

  // Automatically adjust end date to show exactly 9 days of images
  startInput.addEventListener('change', () => {
    const startDate = new Date(startInput.value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 8);

    // Keep end date picker limited to dates on/after the selected start date
    endInput.min = startInput.value;

    endInput.value = endDate > new Date(today) ? today : endDate.toISOString().split('T')[0];
  });

  // Safety check for manual typing: if end date is before start date, snap it back
  endInput.addEventListener('change', () => {
    if (endInput.value < startInput.value) {
      endInput.value = startInput.value;
    }
  });
}
