document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');
    const langButtons = document.querySelectorAll('.lang-btn');
    const navLinks = document.querySelectorAll('.nav-list a')

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
                button.classList.remove('active')
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

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.dataset.lang;
            let targetPage = '';

            if (selectedLang === 'es') {
                targetPage = 'index_es.html'
            } else {
                targetPage = 'index.html'
            }

            window.location.href = targetPage;
        })
    })
})