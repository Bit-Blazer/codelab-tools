// Codelabs Catalog App with Advanced Filtering
class CodelabsCatalog {
    constructor() {
        this.codelabs = [];
        this.filteredCodelabs = [];
        this.currentSort = 'title-asc';
        this.selectedFilters = {
            categories: new Set(),
            tags: new Set(),
            authors: new Set()
        };
        this.searchQuery = '';
        this.currentPage = 1;
        this.itemsPerPage = 12;

        this.init();
    }

    async init() {
        this.setupTheme();
        this.setupEventListeners();
        await this.loadCodelabs();
        this.render();
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-toggle .material-symbols-outlined');
        icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Search with "/" shortcut
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.filterAndRender();
        });

        // "/" key to focus search
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Sort
        document.getElementById('sort').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndRender();
        });

        // Sidebar toggle (mobile)
        document.getElementById('filter-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('open');
        });

        document.getElementById('sidebar-close')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
        });

        // Filter clear buttons
        document.querySelectorAll('.filter-clear').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const group = e.target.dataset.group;
                this.selectedFilters[group].clear();
                this.updateFilterCheckboxes(group);
                this.currentPage = 1;
                this.filterAndRender();
            });
        });

        // Reset all filters
        document.getElementById('reset-filters')?.addEventListener('click', () => {
            this.selectedFilters.categories.clear();
            this.selectedFilters.tags.clear();
            this.selectedFilters.authors.clear();
            this.searchQuery = '';
            document.getElementById('search').value = '';
            this.updateAllFilterCheckboxes();
            this.currentPage = 1;
            this.filterAndRender();
        });

        // Pagination
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderCodelabs();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        document.getElementById('next-page')?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredCodelabs.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderCodelabs();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Load Codelabs Data
    async loadCodelabs() {
        try {
            const response = await fetch('codelabs.json');
            if (!response.ok) throw new Error('Failed to load codelabs');

            this.codelabs = await response.json();
            this.normalizeCodelabsData();
            this.populateFilterOptions();
        } catch (error) {
            console.error('Error loading codelabs:', error);
            this.showError('Failed to load codelabs. Make sure codelabs.json exists.');
            this.codelabs = [];
        }
    }

    normalizeCodelabsData() {
        this.codelabs = this.codelabs.map(codelab => ({
            ...codelab,
            categories: Array.isArray(codelab.categories) ? codelab.categories :
                (codelab.categories ? [codelab.categories] : []),
            tags: Array.isArray(codelab.tags) ? codelab.tags : [],
            authors: Array.isArray(codelab.authors) ? codelab.authors :
                (codelab.authors ? [codelab.authors] : [])
        }));
    }

    // Populate filter checkboxes
    populateFilterOptions() {
        const categories = new Set();
        const tags = new Set();
        const authors = new Set();

        this.codelabs.forEach(codelab => {
            (codelab.categories || []).forEach(cat => cat && categories.add(cat));
            (codelab.tags || []).forEach(tag => tag && tags.add(tag));
            (codelab.authors || []).forEach(author => author && authors.add(author));
        });

        this.renderFilterCheckboxes('categories', Array.from(categories).sort());
        this.renderFilterCheckboxes('tags', Array.from(tags).sort());
        this.renderFilterCheckboxes('authors', Array.from(authors).sort());
    }

    renderFilterCheckboxes(group, items) {
        const groupMap = {
            'categories': 'category',
            'tags': 'tag',
            'authors': 'author'
        };
        const singularGroup = groupMap[group] || group;
        const container = document.getElementById(`${singularGroup}-checkboxes`);
        if (!container) return;

        container.innerHTML = items.map(item => `
            <div class="filter-checkbox-item">
                <input type="checkbox" id="${group}-${this.slugify(item)}" value="${this.escapeHtml(item)}" 
                       data-group="${group}">
                <label for="${group}-${this.slugify(item)}">${this.escapeHtml(item)}</label>
            </div>
        `).join('');

        // Add event listeners to checkboxes
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const group = e.target.dataset.group;
                const value = e.target.value;

                if (e.target.checked) {
                    this.selectedFilters[group].add(value);
                } else {
                    this.selectedFilters[group].delete(value);
                }

                this.currentPage = 1;
                this.filterAndRender();
            });
        });
    }

    updateFilterCheckboxes(group) {
        const container = document.getElementById(`${group.slice(0, -1)}-checkboxes`);
        if (!container) return;

        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = this.selectedFilters[group].has(checkbox.value);
        });
    }

    updateAllFilterCheckboxes() {
        this.updateFilterCheckboxes('categories');
        this.updateFilterCheckboxes('tags');
        this.updateFilterCheckboxes('authors');
    }

    // Filter and Sort
    filterAndRender() {
        this.filteredCodelabs = this.codelabs.filter(codelab => {
            // Search filter
            if (this.searchQuery) {
                const searchableText = [
                    codelab.title,
                    codelab.summary,
                    ...codelab.categories,
                    ...codelab.tags,
                    ...codelab.authors
                ].join(' ').toLowerCase();

                if (!searchableText.includes(this.searchQuery)) return false;
            }

            // Category filter
            if (this.selectedFilters.categories.size > 0) {
                const hasCategory = codelab.categories.some(cat =>
                    this.selectedFilters.categories.has(cat)
                );
                if (!hasCategory) return false;
            }

            // Tag filter
            if (this.selectedFilters.tags.size > 0) {
                const hasTag = codelab.tags.some(tag =>
                    this.selectedFilters.tags.has(tag)
                );
                if (!hasTag) return false;
            }

            // Author filter
            if (this.selectedFilters.authors.size > 0) {
                const hasAuthor = codelab.authors.some(author =>
                    this.selectedFilters.authors.has(author)
                );
                if (!hasAuthor) return false;
            }

            return true;
        });

        this.sortCodelabs();
        this.renderActiveFilters();
        this.renderCodelabs();
    }

    sortCodelabs() {
        this.filteredCodelabs.sort((a, b) => {
            switch (this.currentSort) {
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'updated-desc':
                    return new Date(b.updated || 0) - new Date(a.updated || 0);
                case 'updated-asc':
                    return new Date(a.updated || 0) - new Date(b.updated || 0);
                case 'duration-asc':
                    return (a.duration || 0) - (b.duration || 0);
                case 'duration-desc':
                    return (b.duration || 0) - (a.duration || 0);
                default:
                    return 0;
            }
        });
    }

    // Render active filter chips
    renderActiveFilters() {
        const container = document.getElementById('active-filters');
        if (!container) return;

        const chips = [];

        this.selectedFilters.categories.forEach(cat => {
            chips.push(this.createFilterChip('categories', cat));
        });

        this.selectedFilters.tags.forEach(tag => {
            chips.push(this.createFilterChip('tags', tag));
        });

        this.selectedFilters.authors.forEach(author => {
            chips.push(this.createFilterChip('authors', author));
        });

        container.innerHTML = chips.join('');
        container.style.display = chips.length > 0 ? 'block' : 'none';

        // Add event listeners to chip close buttons
        container.querySelectorAll('.filter-chip-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const group = e.target.dataset.group;
                const value = e.target.dataset.value;
                this.selectedFilters[group].delete(value);
                this.updateFilterCheckboxes(group);
                this.currentPage = 1;
                this.filterAndRender();
            });
        });
    }

    createFilterChip(group, value) {
        return `
            <span class="filter-chip">
                ${this.escapeHtml(value)}
                <button class="filter-chip-close" data-group="${group}" data-value="${this.escapeHtml(value)}">×</button>
            </span>
        `;
    }

    // Rendering
    render() {
        this.filterAndRender();
    }

    renderCodelabs() {
        const container = document.getElementById('codelabs-container');
        const noResults = document.getElementById('no-results');
        const stats = document.getElementById('results-count');

        const codelabsToShow = this.filteredCodelabs.length > 0 ? this.filteredCodelabs : this.codelabs;

        if (codelabsToShow.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            stats.textContent = 'No codelabs';
            document.getElementById('pagination').style.display = 'none';
            return;
        }

        noResults.style.display = 'none';

        // Pagination
        const totalPages = Math.ceil(codelabsToShow.length / this.itemsPerPage);
        const startIdx = (this.currentPage - 1) * this.itemsPerPage;
        const endIdx = startIdx + this.itemsPerPage;
        const pageCodelabs = codelabsToShow.slice(startIdx, endIdx);

        // Update stats
        const total = codelabsToShow.length;
        stats.textContent = `${total} codelab${total !== 1 ? 's' : ''}`;

        // Render cards
        container.innerHTML = pageCodelabs.map(codelab => this.createCard(codelab)).join('');

        // Render pagination
        this.renderPagination(totalPages);
    }

    renderPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pagesContainer = document.getElementById('pagination-pages');

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        // Update buttons
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        // Render page numbers
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (this.currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (this.currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', totalPages);
            }
        }

        pagesContainer.innerHTML = pages.map(page => {
            if (page === '...') {
                return '<span class="pagination-page">...</span>';
            }
            return `<button class="pagination-page ${page === this.currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
        }).join('');

        // Add event listeners
        pagesContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderCodelabs();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    createCard(codelab) {
        const duration = this.formatDuration(codelab.duration);
        const updated = codelab.updated ? this.formatDate(codelab.updated) : '';
        const iconName = this.getIcon(codelab);
        const categories = (codelab.categories || []).slice(0, 3);

        return `
            <a href="${codelab.url || codelab.id}" class="codelab-card">
                <h3 class="card-title">${this.escapeHtml(codelab.title)}</h3>
                <div class="card-meta">
                    <span>${duration || '–'}</span>
                    <span>${updated || 'No date'}</span>
                </div>
                ${categories.length > 0 ? `
                <div class="card-categories">
                    ${categories.map(cat => `<span class="card-category">${this.escapeHtml(cat)}</span>`).join('')}
                </div>
                ` : ''}
                <p class="card-summary">${this.escapeHtml(codelab.summary || 'No description available')}</p>
                <div class="card-footer">
                    <span class="material-symbols-outlined card-icon">${iconName}</span>
                    <button class="card-button">Start</button>
                </div>
            </a>
        `;
    }

    getIcon(codelab) {
        const allCategories = [...codelab.categories, ...codelab.tags]
            .map(c => (c || '').toString().toLowerCase())
            .join(' ');

        if (allCategories.includes('web') || allCategories.includes('html') || allCategories.includes('css')) return 'web';
        if (allCategories.includes('cloud') || allCategories.includes('kubernetes')) return 'cloud';
        if (allCategories.includes('data') || allCategories.includes('analytics')) return 'analytics';
        if (allCategories.includes('security')) return 'security';
        if (allCategories.includes('mobile') || allCategories.includes('android') || allCategories.includes('ios')) return 'phone_iphone';
        if (allCategories.includes('ai') || allCategories.includes('ml') || allCategories.includes('machine')) return 'psychology';
        if (allCategories.includes('docker') || allCategories.includes('container')) return 'deployed_code';

        return 'code';
    }

    formatDuration(minutes) {
        if (!minutes) return '';
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 14) return '1 week ago';
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const container = document.getElementById('codelabs-container');
        container.innerHTML = `
            <div class="loading">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CodelabsCatalog();
    });
} else {
    new CodelabsCatalog();
}
