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

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && typeof SEARCH_DATA !== 'undefined') {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.classList.add('hidden');
                return;
            }

            const results = SEARCH_DATA.filter(item => {
                return item.title.toLowerCase().includes(query) || 
                       item.content.toLowerCase().includes(query);
            });

            if (results.length > 0) {
                searchResults.innerHTML = results.map(item => {
                    // Create a snippet
                    const lowerContent = item.content.toLowerCase();
                    const idx = lowerContent.indexOf(query);
                    let snippet = item.content.substring(0, 100) + '...';
                    
                    if(idx > -1) {
                        const start = Math.max(0, idx - 40);
                        const end = Math.min(item.content.length, idx + 60);
                        snippet = (start > 0 ? '...' : '') + 
                                  item.content.substring(start, end) + 
                                  (end < item.content.length ? '...' : '');
                    }

                    // Highlight matches
                    const regex = new RegExp(`(${query})`, 'gi');
                    const highlightedSnippet = snippet.replace(regex, '<span class="highlight">$1</span>');
                    const highlightedTitle = item.title.replace(regex, '<span class="highlight">$1</span>');

                    return `
                        <div class="search-item" onclick="window.location.href='${item.url}'">
                            <div class="search-title">${highlightedTitle}</div>
                            <div class="search-snippet">${highlightedSnippet}</div>
                        </div>
                    `;
                }).join('');
                searchResults.classList.remove('hidden');
            } else {
                searchResults.innerHTML = '<div class="search-item search-empty">No results found</div>';
                searchResults.classList.remove('hidden');
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });

        // Show results when focusing input if there's text
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                searchResults.classList.remove('hidden');
            }
        });
    }
});