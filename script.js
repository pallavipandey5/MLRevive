document.addEventListener('DOMContentLoaded', () => {
    // Select all checkboxes (both main topics and subtopics)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    function updateProgress() {
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(c => c.checked).length;
        const percentage = total === 0 ? 0 : Math.round((checked / total) * 100);

        // Update width and text
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;

        // Update page title optionally
        document.title = `(${percentage}%) Master Index - ML Encyclopedia`;
    }

    // Load saved states from LocalStorage
    checkboxes.forEach(checkbox => {
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState === 'true') {
            checkbox.checked = true;
        }

        // Add event listener to save state on change
        checkbox.addEventListener('change', (e) => {
            localStorage.setItem(e.target.id, e.target.checked);
            updateProgress(); // Recalculate progress on every change
        });
    });

    // Initial calculation
    updateProgress();
});