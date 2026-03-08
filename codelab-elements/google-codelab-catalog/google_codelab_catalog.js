goog.module('googlecodelabs.CodelabCatalog');

const EventHandler = goog.require('goog.events.EventHandler');
const HTML5LocalStorage = goog.require('goog.storage.mechanism.HTML5LocalStorage');
const Templates = goog.require('googlecodelabs.CodelabCatalog.Templates');
const dom = goog.require('goog.dom');
const events = goog.require('goog.events');
const soy = goog.require('goog.soy');

/** @const {string} */
const DATA_SOURCE_ATTR = 'data-source';

/** @const {string} */
const CATALOG_TITLE_ATTR = 'catalog-title';

/** @const {string} */
const CATALOG_DESCRIPTION_ATTR = 'catalog-description';

/** @const {string} */
const ITEMS_PER_PAGE_ATTR = 'items-per-page';

/** @const {string} */
const THEME_STORAGE_KEY = 'codelab-catalog-theme';

/**
 * @extends {HTMLElement}
 * @suppress {reportUnknownTypes}
 */
class CodelabCatalog extends HTMLElement {
  /** @return {string} */
  static getTagName() { return 'google-codelab-catalog'; }

  constructor() {
    super();

    /**
     * @private {!EventHandler}
     * @const
     */
    this.eventHandler_ = new EventHandler();

    /** @private {!Array<!Object>} */
    this.codelabs_ = [];

    /** @private {!Array<!Object>} */
    this.filteredCodelabs_ = [];

    /** @private {string} */
    this.currentSort_ = 'title-asc';

    /** @private {!Set<string>} */
    this.selectedCategories_ = new Set();

    /** @private {!Set<string>} */
    this.selectedTags_ = new Set();

    /** @private {!Set<string>} */
    this.selectedAuthors_ = new Set();

    /** @private {string} */
    this.searchQuery_ = '';

    /** @private {number} */
    this.currentPage_ = 1;

    /** @private {number} */
    this.itemsPerPage_ = 12;

    /**
     * @private {!HTML5LocalStorage}
     * @const
     */
    this.storage_ = new HTML5LocalStorage();

    /** @private {boolean} */
    this.hasSetup_ = false;

    /** @private {?Element} */
    this.sidebar_ = null;

    /** @private {?Element} */
    this.codelabsContainer_ = null;

    /** @private {?Element} */
    this.noResults_ = null;

    /** @private {?Element} */
    this.sidebarCount_ = null;

    /** @private {!Array<string>} */
    this.availableCategories_ = [];

    /** @private {!Array<string>} */
    this.availableTags_ = [];

    /** @private {!Array<string>} */
    this.availableAuthors_ = [];
  }

  /**
   * @export
   * @override
   */
  connectedCallback() {
    if (this.hasSetup_) {
      return;
    }

    const dataSource = this.getAttribute(DATA_SOURCE_ATTR) || 'codelabs.json';
    const catalogTitle = this.getAttribute(CATALOG_TITLE_ATTR) || 'Codelabs';
    const catalogDescription = this.getAttribute(CATALOG_DESCRIPTION_ATTR) ||
        'Google Developers Codelabs provide a guided, tutorial, hands-on coding experience.';
    const itemsPerPage = parseInt(this.getAttribute(ITEMS_PER_PAGE_ATTR), 10);

    if (itemsPerPage > 0) {
      this.itemsPerPage_ = itemsPerPage;
    }

    this.setupTheme_();
    this.render_(catalogTitle, catalogDescription);
    this.cacheDomElements_();
    this.setupEventListeners_();
    this.loadCodelabs_(dataSource);

    this.hasSetup_ = true;
  }

  /**
   * @private
   */
  cacheDomElements_() {
    this.sidebar_ = this.querySelector('#sidebar');
    this.codelabsContainer_ = this.querySelector('#codelabs-container');
    this.noResults_ = this.querySelector('#no-results');
    this.sidebarCount_ = this.querySelector('#sidebar-count');
  }

  /**
   * @export
   * @override
   */
  disconnectedCallback() {
    this.eventHandler_.removeAll();
  }

  /**
   * @return {!Array<string>}
   * @export
   */
  static get observedAttributes() {
    return [
      DATA_SOURCE_ATTR,
      CATALOG_TITLE_ATTR,
      CATALOG_DESCRIPTION_ATTR,
      ITEMS_PER_PAGE_ATTR
    ];
  }

  /**
   * @param {string} attr
   * @param {?string} oldValue
   * @param {?string} newValue
   * @param {?string} namespace
   * @export
   * @override
   */
  attributeChangedCallback(attr, oldValue, newValue, namespace) {
    if (!this.hasSetup_) {
      return;
    }

    switch (attr) {
      case DATA_SOURCE_ATTR:
        if (newValue && newValue !== oldValue) {
          this.loadCodelabs_(newValue);
        }
        break;
      case CATALOG_TITLE_ATTR:
      case CATALOG_DESCRIPTION_ATTR:
        if (newValue !== oldValue) {
          const title = this.getAttribute(CATALOG_TITLE_ATTR) || 'Codelabs';
          const description = this.getAttribute(CATALOG_DESCRIPTION_ATTR) ||
              'Google Developers Codelabs provide a guided, tutorial, hands-on coding experience.';
          this.render_(title, description);
          this.cacheDomElements_();
          this.setupEventListeners_();
        }
        break;
      case ITEMS_PER_PAGE_ATTR:
        const itemsPerPage = parseInt(newValue, 10);
        if (itemsPerPage > 0 && itemsPerPage !== this.itemsPerPage_) {
          this.itemsPerPage_ = itemsPerPage;
          this.filterAndRender_();
        }
        break;
    }
  }

  /**
   * @private
   */
  setupTheme_() {
    try {
      const savedTheme = this.storage_.get(THEME_STORAGE_KEY) || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (e) {
      // If storage fails, default to light theme
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  /**
   * @private
   */
  toggleTheme_() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);

    try {
      this.storage_.set(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      // Ignore storage errors
    }

    // Update icon
    const themeIcon = this.querySelector('.theme-toggle-icon');
    if (themeIcon) {
      themeIcon.textContent = newTheme === 'light' ? 'dark_mode' : 'light_mode';
    }
  }

  /**
   * @param {string} title
   * @param {string} description
   * @private
   */
  render_(title, description) {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const themeIcon = theme === 'light' ? 'dark_mode' : 'light_mode';

    soy.renderElement(this, Templates.catalog, {
      title: title,
      description: description,
      themeIcon: themeIcon
    });
  }

  /**
   * @private
   */
  setupEventListeners_() {
    // Theme toggle
    const themeToggle = this.querySelector('#theme-toggle');
    if (themeToggle) {
      this.eventHandler_.listen(themeToggle, events.EventType.CLICK, () => {
        this.toggleTheme_();
      });
    }

    // Search input
    const searchInput = this.querySelector('#catalog-search');
    if (searchInput) {
      this.eventHandler_.listen(searchInput, events.EventType.INPUT, (e) => {
        this.searchQuery_ = e.target.value.toLowerCase();
        this.currentPage_ = 1;
        this.filterAndRender_();
      });
    }

    // Sort select
    const sortSelect = this.querySelector('#catalog-sort');
    if (sortSelect) {
      this.eventHandler_.listen(sortSelect, events.EventType.CHANGE, (e) => {
        this.currentSort_ = e.target.value;
        this.filterAndRender_();
      });
    }

    // Keyboard shortcut for search (/)
    this.eventHandler_.listen(document, events.EventType.KEYDOWN, (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
        }
      }
    });

    // Reset all filters button
    const resetAllBtn = this.querySelector('#reset-all-filters');
    if (resetAllBtn) {
      this.eventHandler_.listen(resetAllBtn, events.EventType.CLICK, () => {
        this.resetAllFilters_();
      });
    }
  }

  /**
   * @param {string} dataSource
   * @private
   */
  async loadCodelabs_(dataSource) {
    try {
      const response = await fetch(dataSource);
      if (!response.ok) {
        throw new Error('Failed to load codelabs');
      }

      this.codelabs_ = /** @type {!Array<!Object>} */ (await response.json());
      this.normalizeCodelabsData_();
      this.populateFilterOptions_();
      this.filterAndRender_();
    } catch (error) {
      console.error('Error loading codelabs:', error);
      this.showError_('Failed to load codelabs. Make sure ' + dataSource + ' exists.');
    }
  }

  /**
   * @private
   */
  normalizeCodelabsData_() {
    this.codelabs_ = this.codelabs_.map(codelab => {
      // Use bracket notation to prevent Closure Compiler property renaming
      // Normalize categories
      let categories = [];
      if (codelab['categories']) {
        if (Array.isArray(codelab['categories'])) {
          categories = codelab['categories'];
        } else {
          categories = [codelab['categories']];
        }
      }

      // Normalize tags
      let tags = [];
      if (codelab['tags']) {
        if (Array.isArray(codelab['tags'])) {
          tags = codelab['tags'];
        } else {
          tags = [codelab['tags']];
        }
      }

      // Normalize authors
      let authors = [];
      if (codelab['authors']) {
        if (Array.isArray(codelab['authors'])) {
          authors = codelab['authors'];
        } else {
          authors = [codelab['authors']];
        }
      }

      return {
        'id': codelab['id'] || '',
        'title': codelab['title'] || 'Untitled',
        'summary': codelab['summary'] || '',
        'duration': codelab['duration'] || 0,
        'updated': codelab['updated'] || '',
        'status': codelab['status'] || 'draft',
        'url': codelab['url'] || '',
        'source': codelab['source'] || '',
        'categories': categories,
        'tags': tags,
        'authors': authors
      };
    });
  }

    /**
     * @private
     */
    populateFilterOptions_() {
        const categories = new Set();
        const tags = new Set();
        const authors = new Set();

        this.codelabs_.forEach(codelab => {
            (codelab['categories'] || []).forEach(cat => {
                if (cat && cat !== null && cat !== '') {
                    categories.add(cat);
                }
            });
            (codelab['tags'] || []).forEach(tag => {
                if (tag && tag !== null && tag !== '') {
                    tags.add(tag);
                }
            });
            (codelab['authors'] || []).forEach(author => {
                if (author && author !== null && author !== '') {
                    authors.add(author);
                }
            });
        });

        this.availableCategories_ = Array.from(categories).sort();
        this.availableTags_ = Array.from(tags).sort();
        this.availableAuthors_ = Array.from(authors).sort();

        this.renderSidebar_();
    }

    /**
     * @private
     */
    renderSidebar_() {
        if (!this.sidebar_) {
            return;
        }

        soy.renderElement(this.sidebar_, Templates.sidebar, {
            categories: this.availableCategories_,
            tags: this.availableTags_,
            authors: this.availableAuthors_
        });

        // Re-cache sidebar count element after re-rendering
        this.sidebarCount_ = this.querySelector('#sidebar-count');

        this.setupFilterEventListeners_();
    }

    /**
     * @private
     */
    setupFilterEventListeners_() {
        // Add event listeners to all filter checkboxes
        const checkboxes = this.querySelectorAll('.filter-checkboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            this.eventHandler_.listen(checkbox, events.EventType.CHANGE, (e) => {
                const filterGroup = e.target.dataset.group;
                const value = e.target.value;
                const set = this.getFilterSet_(filterGroup);

                if (e.target.checked) {
                    set.add(value);
                } else {
                    set.delete(value);
                }

                this.currentPage_ = 1;
                this.filterAndRender_();
            });
        });

        // Add clear button listeners
        const clearButtons = this.querySelectorAll('.filter-clear');
        clearButtons.forEach(clearBtn => {
            this.eventHandler_.listen(clearBtn, events.EventType.CLICK, () => {
                const group = clearBtn.dataset.group;
                this.getFilterSet_(group).clear();
                this.updateFilterCheckboxes_(group);
                this.currentPage_ = 1;
                this.filterAndRender_();
            });
        });
    }

    /**
     * @param {string} group
     * @return {!Set<string>}
     * @private
     */
    getFilterSet_(group) {
        switch (group) {
            case 'categories':
                return this.selectedCategories_;
            case 'tags':
                return this.selectedTags_;
            case 'authors':
                return this.selectedAuthors_;
            default:
                return new Set();
        }
    }

    /**
     * @param {string} group
     * @private
     */
    updateFilterCheckboxes_(group) {
        const container = this.querySelector('#' + group + '-checkboxes');
        if (!container) return;

        const set = this.getFilterSet_(group);
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = set.has(checkbox.value);
        });
    }

    /**
     * @private
     */
    resetAllFilters_() {
        // Clear all filter sets
        this.selectedCategories_.clear();
        this.selectedTags_.clear();
        this.selectedAuthors_.clear();

        // Clear search
        this.searchQuery_ = '';
        const searchInput = this.querySelector('#catalog-search');
        if (searchInput) {
            searchInput.value = '';
        }

        // Update all checkboxes
        this.updateFilterCheckboxes_('categories');
        this.updateFilterCheckboxes_('tags');
        this.updateFilterCheckboxes_('authors');

        // Reset page and re-render
        this.currentPage_ = 1;
        this.filterAndRender_();
    }

    /**
     * @private
     */
    filterAndRender_() {
        this.filteredCodelabs_ = this.codelabs_.filter(codelab => {
            // Search filter
            if (this.searchQuery_) {
                const searchParts = [
                    codelab['title'] || '',
                    codelab['summary'] || ''
                ];
                const categories = codelab['categories'] || [];
                const tags = codelab['tags'] || [];
                const authors = codelab['authors'] || [];
                const searchableText = searchParts
                    .concat(categories)
                    .concat(tags)
                    .concat(authors)
                    .join(' ').toLowerCase();

                if (searchableText.indexOf(this.searchQuery_) === -1) {
                    return false;
                }
            }

            // Category filter
            if (this.selectedCategories_.size > 0) {
                const hasCategory = codelab['categories'].some(cat =>
                    this.selectedCategories_.has(cat)
                );
                if (!hasCategory) return false;
            }

            // Tag filter
            if (this.selectedTags_.size > 0) {
                const hasTag = codelab['tags'].some(tag =>
                    this.selectedTags_.has(tag)
                );
                if (!hasTag) return false;
            }

            // Author filter
            if (this.selectedAuthors_.size > 0) {
                const hasAuthor = codelab['authors'].some(author =>
                    this.selectedAuthors_.has(author)
                );
                if (!hasAuthor) return false;
            }

            return true;
        });

        this.sortCodelabs_();
        this.renderCodelabs_();
    }

    /**
     * @private
     */
    sortCodelabs_() {
        this.filteredCodelabs_.sort((a, b) => {
            switch (this.currentSort_) {
                case 'title-asc':
                    return (a['title'] || '').localeCompare(b['title'] || '');
                case 'title-desc':
                    return (b['title'] || '').localeCompare(a['title'] || '');
                case 'updated-desc':
                    return new Date(b['updated'] || 0) - new Date(a['updated'] || 0);
                case 'updated-asc':
                    return new Date(a['updated'] || 0) - new Date(b['updated'] || 0);
                case 'duration-asc':
                    return (a['duration'] || 0) - (b['duration'] || 0);
                case 'duration-desc':
                    return (b['duration'] || 0) - (a['duration'] || 0);
                default:
                    return 0;
            }
        });
    }

    /**
     * @private
     */
    renderCodelabs_() {
        if (!this.codelabsContainer_) return;

        const codelabsToShow = this.filteredCodelabs_.length > 0 ?
            this.filteredCodelabs_ : this.codelabs_;

        if (codelabsToShow.length === 0) {
            dom.removeChildren(this.codelabsContainer_);
            if (this.noResults_) {
                this.noResults_.style.display = 'block';
            }
            if (this.sidebarCount_) {
                this.sidebarCount_.textContent = 'No codelabs';
            }
            // Hide pagination when there are no results
            const pagination = this.querySelector('#pagination');
            if (pagination) {
                pagination.style.display = 'none';
            }
            return;
        }

        if (this.noResults_) {
            this.noResults_.style.display = 'none';
        }

        // Pagination
        const totalPages = Math.ceil(codelabsToShow.length / this.itemsPerPage_);
        const startIdx = (this.currentPage_ - 1) * this.itemsPerPage_;
        const endIdx = startIdx + this.itemsPerPage_;
        const pageCodelabs = codelabsToShow.slice(startIdx, endIdx);

        // Update stats
        const total = codelabsToShow.length;
        const countText = total + ' codelab' + (total !== 1 ? 's' : '');
        
        if (this.sidebarCount_) {
            this.sidebarCount_.textContent = countText;
        }

        // Prepare data for template
        const codelabsData = pageCodelabs.map(codelab => ({
            title: codelab['title'],
            summary: codelab['summary'] || 'No description available',
            url: codelab['url'] || codelab['id'],
            duration: this.formatDuration_(codelab['duration']),
            updated: codelab['updated'] ? this.formatDate_(codelab['updated']) : '',
            categories: (codelab['categories'] || []).slice(0, 3),
            icon: this.getIcon_(codelab)
        }));

        // Render all cards at once
        soy.renderElement(this.codelabsContainer_, Templates.codelabCards, {
            codelabs: codelabsData
        });

        // Render pagination
        this.renderPagination_(totalPages, codelabsToShow.length);
    }

    /**
     * @param {number} totalPages
     * @param {number} totalCodelabs
     * @private
     */
    renderPagination_(totalPages, totalCodelabs) {
        const pagination = this.querySelector('#pagination');
        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        dom.removeChildren(pagination);

        const maxButtons = 7;
        const current = this.currentPage_;
        let startPage = Math.max(1, current - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        // Previous button
        const prevBtn = dom.createDom('button', {
            'class': 'pagination-btn pagination-prev',
            'disabled': current === 1
        }, '‹ Previous');
        events.listen(prevBtn, events.EventType.CLICK, () => {
            if (this.currentPage_ > 1) {
                this.currentPage_--;
                this.renderCodelabs_();
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        });
        pagination.appendChild(prevBtn);

        // First page button
        if (startPage > 1) {
            const firstBtn = this.createPageButton_(1);
            pagination.appendChild(firstBtn);
            if (startPage > 2) {
                const dots = dom.createDom('span', 'pagination-dots', '...');
                pagination.appendChild(dots);
            }
        }

        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const btn = this.createPageButton_(i);
            pagination.appendChild(btn);
        }

        // Last page button
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = dom.createDom('span', 'pagination-dots', '...');
                pagination.appendChild(dots);
            }
            const lastBtn = this.createPageButton_(totalPages);
            pagination.appendChild(lastBtn);
        }

        // Next button
        const nextBtn = dom.createDom('button', {
            'class': 'pagination-btn pagination-next',
            'disabled': current === totalPages
        }, 'Next ›');
        events.listen(nextBtn, events.EventType.CLICK, () => {
            if (this.currentPage_ < totalPages) {
                this.currentPage_++;
                this.renderCodelabs_();
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        });
        pagination.appendChild(nextBtn);
    }

    /**
     * @param {number} pageNumber
     * @return {!Element}
     * @private
     */
    createPageButton_(pageNumber) {
        const isActive = pageNumber === this.currentPage_;
        const btn = dom.createDom('button', {
            'class': 'pagination-btn pagination-page' + (isActive ? ' active' : '')
        }, String(pageNumber));

        if (!isActive) {
            events.listen(btn, events.EventType.CLICK, () => {
                this.currentPage_ = pageNumber;
                this.renderCodelabs_();
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
        }

        return btn;
    }

    /**
     * @param {!Object} codelab
     * @return {string}
     * @private
     */
    getIcon_(codelab) {
        const categories = codelab['categories'] || [];
        const tags = codelab['tags'] || [];
        const allCategories = categories.concat(tags)
            .map(c => (c || '').toString().toLowerCase())
            .join(' ');

        if (allCategories.indexOf('web') > -1 || allCategories.indexOf('html') > -1) return 'web';
        if (allCategories.indexOf('cloud') > -1) return 'cloud';
        if (allCategories.indexOf('data') > -1) return 'analytics';
        if (allCategories.indexOf('security') > -1) return 'security';
        if (allCategories.indexOf('mobile') > -1) return 'phone_iphone';
        if (allCategories.indexOf('ai') > -1 || allCategories.indexOf('ml') > -1) return 'psychology';

        return 'code';
    }

    /**
     * @param {number} minutes
     * @return {string}
     * @private
     */
    formatDuration_(minutes) {
        if (!minutes) return '';
        if (minutes < 60) return minutes + ' min';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? hours + 'h ' + mins + 'm' : hours + 'h';
    }

    /**
     * @param {string} dateString
     * @return {string}
     * @private
     */
    formatDate_(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return diffDays + ' days ago';
        if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * @param {string} message
     * @private
     */
    showError_(message) {
        if (this.codelabsContainer_) {
            this.codelabsContainer_.innerHTML = '<div class="error-message">' + message + '</div>';
        }
    }
}

exports = CodelabCatalog;
