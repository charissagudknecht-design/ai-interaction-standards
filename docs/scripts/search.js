/**
 * Documentation Search
 * Client-side search functionality for the design system documentation
 */

class DocSearch {
    constructor() {
        this.searchIndex = [];
        this.searchInput = null;
        this.resultsContainer = null;
        this.isOpen = false;

        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.createSearchUI();
        this.attachEventListeners();
    }

    /**
     * Build search index from documentation pages
     */
    buildSearchIndex() {
        this.searchIndex = [
            // Foundation
            { title: 'Typography', url: 'typography-components.html', category: 'Foundation', keywords: ['fonts', 'text', 'headings', 'body', 'lato'] },
            { title: 'CSS Variables', url: 'css-variables.html', category: 'Foundation', keywords: ['tokens', 'colors', 'spacing', 'design tokens'] },
            { title: 'Accessibility', url: 'accessibility-guide.html', category: 'Foundation', keywords: ['a11y', 'aria', 'keyboard', 'screen reader', 'wcag'] },

            // Form Components
            { title: 'Button', url: 'button-components.html', category: 'Form Components', keywords: ['btn', 'primary', 'secondary', 'click', 'action', 'cta'] },
            { title: 'Checkbox', url: 'checkbox-components.html', category: 'Form Components', keywords: ['check', 'select', 'toggle', 'boolean'] },
            { title: 'Dropdown', url: 'dropdown-components.html', category: 'Form Components', keywords: ['select', 'options', 'combo', 'list'] },
            { title: 'Input', url: 'input-components.html', category: 'Form Components', keywords: ['text', 'field', 'form', 'input', 'textarea'] },
            { title: 'Input Group', url: 'input-group-components.html', category: 'Form Components', keywords: ['addon', 'prefix', 'suffix', 'icon'] },
            { title: 'Radio', url: 'radio-components.html', category: 'Form Components', keywords: ['radio', 'option', 'single', 'choice'] },
            { title: 'Switch', url: 'switch-components.html', category: 'Form Components', keywords: ['toggle', 'on', 'off', 'boolean', 'switch'] },
            { title: 'Toggle', url: 'toggle-components.html', category: 'Form Components', keywords: ['toggle', 'group', 'segmented', 'tabs'] },

            // Display Components
            { title: 'Badge', url: 'badge-components.html', category: 'Display', keywords: ['tag', 'label', 'status', 'indicator'] },
            { title: 'Banner', url: 'banner-components.html', category: 'Display', keywords: ['alert', 'notice', 'message', 'warning', 'info'] },

            // Navigation
            { title: 'Dropdown Menu', url: 'dropdown-menu-components.html', category: 'Navigation', keywords: ['menu', 'actions', 'options', 'popover', 'kebab', 'more', 'dots', 'overflow'] },
            { title: 'Tabs', url: 'tab-components.html', category: 'Navigation', keywords: ['tab', 'navigation', 'sections'] },

            // Feedback
            { title: 'Toast', url: 'toast-components.html', category: 'Feedback', keywords: ['notification', 'snackbar', 'message', 'alert'] },

            // Overlay
            { title: 'Dialog', url: 'dialog-components.html', category: 'Overlay', keywords: ['modal', 'popup', 'confirm', 'alert'] },
            { title: 'Editor', url: 'editor-components.html', category: 'Overlay', keywords: ['popup', 'inline', 'edit'] },
            { title: 'Tooltip', url: 'tooltip-components.html', category: 'Overlay', keywords: ['hint', 'help', 'info', 'hover'] },

            // Layout
            { title: 'Grid', url: 'grid-components.html', category: 'Layout', keywords: ['columns', 'row', 'responsive', 'layout'] },
            { title: 'Flexbox', url: 'flexbox-utilities.html', category: 'Layout', keywords: ['flex', 'align', 'justify', 'gap'] },

            // Utilities
            { title: 'Animations', url: 'animation-utilities.html', category: 'Utilities', keywords: ['motion', 'transition', 'animate', 'effects'] },

            // AI Design Hub (standalone pages — open in new tab)
            { title: 'AI Design Hub', url: 'ai-hub.html', category: 'AI Design Hub', keywords: ['ai', 'hub', 'glow', 'ruby', 'design language', 'overview'] },
            { title: 'AI Foundations', url: 'ai-foundations.html', category: 'AI Design Hub', keywords: ['ai', 'foundations', 'principles', 'maturity', 'framework', 'pilot'] },
            { title: 'AI Visual Language', url: 'ai-visual-language.html', category: 'AI Design Hub', keywords: ['ai', 'visual', 'color', 'typography', 'iconography', 'tokens', 'ruby', 'gradient'] },
            { title: 'AI Component Gallery', url: 'ai-components.html', category: 'AI Design Hub', keywords: ['ai', 'components', 'prompt', 'box', 'glow', 'copilot', 'sidebar', 'demo', 'generating', 'waveform'] },
            { title: 'AI Trust & Governance', url: 'ai-trust.html', category: 'AI Design Hub', keywords: ['ai', 'trust', 'confidence', 'error', 'anti-patterns', 'processing', 'states'] },
        ];
    }

    /**
     * Create search UI elements
     */
    createSearchUI() {
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'doc-search-container';
        searchContainer.innerHTML = `
            <div class="doc-search-trigger" id="search-trigger">
                <span class="doc-search-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span class="doc-search-placeholder">Search...</span>
                <span class="doc-search-shortcut">
                    <kbd>⌘</kbd><kbd>K</kbd>
                </span>
            </div>
            
            <div class="doc-search-modal" id="search-modal" hidden>
                <div class="doc-search-modal-backdrop"></div>
                <div class="doc-search-modal-content">
                    <div class="doc-search-input-wrapper">
                        <svg class="doc-search-input-icon" width="20" height="20" viewBox="0 0 16 16" fill="none">
                            <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input type="text" class="doc-search-input" id="search-input" placeholder="Search documentation..." autocomplete="off">
                        <button class="doc-search-clear" id="search-clear" hidden>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="doc-search-results" id="search-results">
                        <div class="doc-search-empty">
                            <p>Start typing to search...</p>
                        </div>
                    </div>
                    <div class="doc-search-footer">
                        <span><kbd>↵</kbd> to select</span>
                        <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                        <span><kbd>esc</kbd> to close</span>
                    </div>
                </div>
            </div>
        `;

        // Insert search into sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const firstNavGroup = sidebar.querySelector('.nav-group');
            if (firstNavGroup) {
                sidebar.insertBefore(searchContainer, firstNavGroup);
            }
        }

        this.searchInput = document.getElementById('search-input');
        this.resultsContainer = document.getElementById('search-results');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const trigger = document.getElementById('search-trigger');
        const modal = document.getElementById('search-modal');
        const backdrop = modal?.querySelector('.doc-search-modal-backdrop');
        const clearBtn = document.getElementById('search-clear');

        // Open search
        trigger?.addEventListener('click', () => this.open());
        
        // Close on backdrop click
        backdrop?.addEventListener('click', () => this.close());

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
            // Cmd/Ctrl + K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.isOpen ? this.close() : this.open();
            }
        });

        // Search input
        this.searchInput?.addEventListener('input', (e) => {
            this.search(e.target.value);
            clearBtn.hidden = !e.target.value;
        });

        // Clear button
        clearBtn?.addEventListener('click', () => {
            this.searchInput.value = '';
            this.search('');
            clearBtn.hidden = true;
            this.searchInput.focus();
        });

        // Keyboard navigation in results
        this.searchInput?.addEventListener('keydown', (e) => {
            const items = this.resultsContainer.querySelectorAll('.doc-search-result-item');
            const active = this.resultsContainer.querySelector('.doc-search-result-item.active');
            let index = Array.from(items).indexOf(active);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                index = Math.min(index + 1, items.length - 1);
                this.setActiveItem(items, index);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                index = Math.max(index - 1, 0);
                this.setActiveItem(items, index);
            } else if (e.key === 'Enter' && active) {
                e.preventDefault();
                this.navigateTo(active.dataset.url);
                this.close();
            }
        });
    }

    /**
     * Set active item in results
     */
    setActiveItem(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        items[index]?.scrollIntoView({ block: 'nearest' });
    }

    /**
     * Open search modal
     */
    open() {
        const modal = document.getElementById('search-modal');
        modal.hidden = false;
        this.isOpen = true;
        this.searchInput?.focus();
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close search modal
     */
    close() {
        const modal = document.getElementById('search-modal');
        modal.hidden = true;
        this.isOpen = false;
        this.searchInput.value = '';
        this.search('');
        document.body.style.overflow = '';
    }

    /**
     * Perform search
     */
    search(query) {
        if (!query.trim()) {
            this.resultsContainer.innerHTML = `
                <div class="doc-search-empty">
                    <p>Start typing to search...</p>
                </div>
            `;
            return;
        }

        const normalizedQuery = query.toLowerCase();
        const results = this.searchIndex.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
            const keywordMatch = item.keywords.some(k => k.includes(normalizedQuery));
            const categoryMatch = item.category.toLowerCase().includes(normalizedQuery);
            return titleMatch || keywordMatch || categoryMatch;
        });

        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="doc-search-empty">
                    <p>No results found for "<strong>${query}</strong>"</p>
                </div>
            `;
            return;
        }

        // Group by category
        const grouped = results.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {});

        let html = '';
        for (const [category, items] of Object.entries(grouped)) {
            html += `<div class="doc-search-category">${category}</div>`;
            items.forEach((item, i) => {
                html += `
                    <button class="doc-search-result-item${i === 0 ? ' active' : ''}" data-url="${item.url}">
                        <span class="doc-search-result-title">${item.title}</span>
                        <span class="doc-search-result-arrow">↵</span>
                    </button>
                `;
            });
        }

        this.resultsContainer.innerHTML = html;

        // Add click handlers
        this.resultsContainer.querySelectorAll('.doc-search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                this.navigateTo(item.dataset.url);
                this.close();
            });
        });
    }

    /**
     * Navigate to a documentation page
     * Handles both iframe-based navigation (index.html) and direct navigation
     */
    navigateTo(url) {
        // Try to find the component iframe
        const iframe = document.querySelector('iframe[name="component-frame"]');
        
        if (iframe) {
            // Navigate the iframe
            iframe.src = url;
            
            // Update active state in sidebar navigation
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === url) {
                    item.classList.add('active');
                }
            });
        } else {
            // Direct navigation (fallback for standalone pages)
            window.location.href = url;
        }
    }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DocSearch();
});
