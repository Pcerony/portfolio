document.addEventListener('DOMContentLoaded', () => {
    const home = document.getElementById('home-page');
    const detailPages = document.getElementById('detail-pages');
    const detailContainer = detailPages.querySelector('.container');
    const categories = [...document.querySelectorAll('#portfolio .portfolio-band')];
    const research = document.getElementById('research-detail');
    const source = document.getElementById('research-source');
    const back = document.getElementById('detail-back');
    let homeFocus;
    let homeScroll = 0;
    let homeHash = '#portfolio';

    // Move existing content into the second layer without rebuilding projects.
    categories.forEach(panel => detailContainer.appendChild(panel));
    source.hidden = false;
    source.querySelectorAll('.reveal-item').forEach(item => item.classList.add('visible'));
    research.appendChild(source);
    const panels = [research, ...categories];

    function renderRoute() {
        const selected = panels.find(panel => panel.id === window.location.hash.slice(1));
        home.hidden = Boolean(selected);
        detailPages.hidden = !selected;
        panels.forEach(panel => { panel.hidden = panel !== selected; });
        if (selected) {
            homeHash = selected === research ? '#research' : '#portfolio';
            back.href = homeHash;
            selected.focus({preventScroll: true});
            window.scrollTo(0, 0);
        } else {
            homeFocus?.focus({preventScroll: true});
            if (homeFocus) {
                window.scrollTo(0, homeScroll);
            } else {
                document.getElementById(window.location.hash.slice(1))?.scrollIntoView?.();
            }
        }
        window.dispatchEvent(new Event('portfolio:change'));
    }

    document.querySelectorAll('.category-cover, #research-cover').forEach(cover => {
        cover.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            if (!home.hidden) homeScroll = window.scrollY;
            homeFocus = cover;
            window.history.pushState(null, '', cover.hash);
            renderRoute();
        });
    });
    back.addEventListener('click', event => {
        event.preventDefault();
        window.history.pushState(null, '', homeHash);
        renderRoute();
    });
    window.addEventListener('hashchange', renderRoute);
    window.addEventListener('popstate', renderRoute);
    renderRoute();
});
