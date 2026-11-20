document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link, .nav-sublist a');
    const sections = document.querySelectorAll('.section, .variant[id]');
    const pageContainer = document.querySelector('.page');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top < viewportHeight && 
            rect.bottom > 0
        );
    }

    function handleSectionVisibility() {
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('visible');
            }
        });
    }

    function updateActiveLink() {
        let currentSection = null;
        const scrollContainer = pageContainer || window;
        const scrollTop = pageContainer ? pageContainer.scrollTop : window.scrollY;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150) {
                currentSection = section;
            }
        });

        if (currentSection) {
            const targetId = '#' + currentSection.id;
        navLinks.forEach(link => {
                if (link.getAttribute('href') === targetId) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
            }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = 80;
                const scrollContainer = pageContainer || window;
                
                if (pageContainer) {
                    // Get the position relative to the scrollable container
                    const containerRect = pageContainer.getBoundingClientRect();
                    const targetRect = targetSection.getBoundingClientRect();
                    const currentScroll = pageContainer.scrollTop;
                    const targetPosition = currentScroll + targetRect.top - containerRect.top - offset;
                
                    pageContainer.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                } else {
                    window.scrollTo({
                        top: targetSection.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const scrollTarget = pageContainer || window;
    scrollTarget.addEventListener('scroll', () => {
        handleSectionVisibility();
        updateActiveLink();
    });
    
    handleSectionVisibility();
    updateActiveLink();

    // Toggle Group Interaction
    initToggleGroups();
});

// Toggle Group Functionality
function initToggleGroups() {
    const toggleGroups = document.querySelectorAll('.rw-toggle-group');
    
    toggleGroups.forEach(group => {
        const buttons = group.querySelectorAll('.rw-toggle-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.disabled) return;
                
                // Remove active class from all buttons in this group
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update output if exists
                const groupId = group.id;
                if (groupId === 'basicToggleGroup') {
                    const mode = this.dataset.mode;
                    const output = document.getElementById('basicToggleOutput');
                    if (output) {
                        output.textContent = `Current mode: ${mode}`;
                    }
                } else if (groupId === 'multiToggleGroup') {
                    const option = this.dataset.option;
                    const output = document.getElementById('multiToggleOutput');
                    if (output) {
                        output.textContent = `Current selection: ${option}`;
                    }
                }
                
                // Dispatch custom event for external listeners
                group.dispatchEvent(new CustomEvent('toggle-change', {
                    detail: {
                        value: this.dataset.mode || this.dataset.option || this.textContent,
                        button: this
                    },
                    bubbles: true
                }));
            });
        });
    });
} 