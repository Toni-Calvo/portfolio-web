document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');
    const langButtons = document.querySelectorAll('.lang-btn');
    const navLinks = document.querySelectorAll('.nav-list a');

    const savedScrollY = localStorage.getItem('scrollPosition');
    const isLanguageChange = localStorage.getItem('isLanguageChange');

    // Set the scroll position on language change or page load
    if (savedScrollY) {
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                const scrollOptions = {};
                if (isLanguageChange === 'true') {
                    scrollOptions.behavior = 'auto';
                    localStorage.removeItem('isLanguageChange');
                } else {
                    scrollOptions.behavior = 'smooth';
                }

                window.scrollTo(0, parseInt(savedScrollY), scrollOptions);
                localStorage.removeItem('scrollPosition');
            }, 50); 
        });
    }

    window.changeLanguage = function(lang) {
        localStorage.setItem('scrollPosition', window.scrollY);
        localStorage.setItem('isLanguageChange', 'true');

        let targetPage = '';
        if (lang === 'es') {
            targetPage = 'index_es.html';
        } else {
            targetPage = 'index.html';
        }

        window.location.href = targetPage;
    };


    // Set the current year in the footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Update the active language button based on the current page
    const getCurrentPageName = () => {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page.split('.')[0];
    };

    const updateLanguageButtons = (currentPage) => {
        let found = false;
        langButtons.forEach(button => {
            if ((currentPage === 'index' && button.dataset.lang === 'en') ||
                (currentPage === 'index_es' && button.dataset.lang === 'es')) {
                button.classList.add('active');
                found = true;
            } else {
                button.classList.remove('active');
            }
        });
        
        if (!found) {
            langButtons.forEach(button => {
                if (button.dataset.lang === 'en') {
                    button.classList.add('active');
                }
            });
        }
    };

    const currentPageName = getCurrentPageName();
    updateLanguageButtons(currentPageName);

    hamburgerMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active') && window.innerWidth <= 768) {
                navList.classList.remove('active');
            }
        });
    });
});