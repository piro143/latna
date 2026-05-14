document.addEventListener('DOMContentLoaded', () => {
    // Note: the "database" variable is loaded globally from database.js
    
    // DOM Elements
    const navTabs = document.querySelectorAll('.nav-tab');
    const setList = document.getElementById('set-list');
    const contentDisplay = document.getElementById('content-display');
    const emptySelection = document.getElementById('empty-selection');
    const questionText = document.getElementById('question-text');
    const copySolutionBtn = document.getElementById('copy-solution-btn');

    let currentCategory = 'sql';
    let currentSolution = '';

    // Initialize the app
    if (typeof database !== 'undefined') {
        loadCategory(currentCategory);
    } else {
        setList.innerHTML = '<li class="set-item" style="cursor:default; text-align:center; padding: 1rem;">Failed to load data.<br><br><span style="font-size: 0.9em; opacity: 0.7;">Make sure database.js is included in index.html.</span></li>';
    }

    // Navigation Tabs Click Listener
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state on tabs
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Load selected category
            currentCategory = tab.getAttribute('data-category');
            loadCategory(currentCategory);
        });
    });

    // Load Items for Sidebar
    function loadCategory(category) {
        setList.innerHTML = ''; // Clear previous list
        hideContent(); // Hide the right panel

        const items = database[category] || [];

        if (items.length === 0) {
            setList.innerHTML = '<li class="set-item" style="cursor:default; text-align:center;">No sets available</li>';
            return;
        }

        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'set-item';
            // Convert "Set 1" into "S1" for the grid layout
            li.textContent = item.setName.replace(/Set\s*/i, 'S');
            
            li.addEventListener('click', () => {
                // Update active list item
                document.querySelectorAll('.set-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                
                // Show content for selected item
                showContent(item);
            });

            setList.appendChild(li);
        });
    }

    // Display Question and Store Solution
    function showContent(item) {
        emptySelection.style.display = 'none';
        contentDisplay.style.display = 'flex';
        
        questionText.textContent = item.question;
        currentSolution = item.solution;
    }

    // Hide Main Content Panel
    function hideContent() {
        emptySelection.style.display = 'flex';
        contentDisplay.style.display = 'none';
        currentSolution = '';
    }

    // Big "Copy Solution" Button Listener
    copySolutionBtn.addEventListener('click', () => {
        if (!currentSolution) return;

        navigator.clipboard.writeText(currentSolution).then(() => {
            // Visual feedback on button
            const originalHTML = copySolutionBtn.innerHTML;
            copySolutionBtn.innerHTML = `
                <span class="btn-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span class="btn-text">Copied to Clipboard!</span>
            `;
            copySolutionBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            copySolutionBtn.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copySolutionBtn.innerHTML = originalHTML;
                copySolutionBtn.style.background = ''; // Resets to CSS stylesheet
                copySolutionBtn.style.boxShadow = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

});
