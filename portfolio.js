document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
menu.hidden = false;

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close' : 'Menu';
  navigation.classList.toggle('open', open);
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', () => setMenu(false));

const tabList = document.querySelector('.case-nav');
const tabs = [...tabList.querySelectorAll('a')];
const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
tabList.setAttribute('role', 'tablist');
tabs.forEach((tab, index) => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', panels[index].id);
  panels[index].setAttribute('role', 'tabpanel');
  panels[index].setAttribute('aria-labelledby', tab.id);
  panels[index].tabIndex = 0;
});

function selectCase(index, focus = false) {
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
  if (focus) tabs[index].focus();
}

function selectFromHash() {
  const index = panels.findIndex(panel => '#' + panel.id === location.hash);
  if (index >= 0) selectCase(index);
}

selectCase(0);
selectFromHash();
window.addEventListener('hashchange', selectFromHash);
tabs.forEach((tab, index) => {
  tab.addEventListener('click', event => {
    event.preventDefault();
    selectCase(index);
    if (location.hash !== tab.hash) history.replaceState(null, '', tab.hash);
  });
  tab.addEventListener('keydown', event => {
    const positions = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0, End: tabs.length - 1
    };
    if (!(event.key in positions)) return;
    event.preventDefault();
    const next = positions[event.key];
    selectCase(next, true);
    history.replaceState(null, '', tabs[next].hash);
  });
});

const certificateDialog = document.querySelector('.certificate-dialog');
const certificateTitle = document.querySelector('#certificate-title');
const certificateImage = document.querySelector('#certificate-image');
const originalCertificate = document.querySelector('#certificate-original');

document.querySelectorAll('.credential-card').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (typeof certificateDialog.showModal !== 'function') return;
    event.preventDefault();
    certificateTitle.textContent = link.dataset.title;
    certificateImage.src = link.dataset.preview;
    certificateImage.alt = link.dataset.title;
    originalCertificate.href = link.href;
    certificateDialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => certificateDialog.close());
certificateDialog.addEventListener('click', event => {
  if (event.target !== certificateDialog) return;
  const bounds = certificateDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) certificateDialog.close();
});

const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.find(entry => entry.isIntersecting);
  if (!visible) return;
  sectionLinks.forEach(link => {
    if (link.hash === '#' + visible.target.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, {rootMargin: '-15% 0px -55% 0px'});
sectionLinks.forEach(link => {
  const section = document.querySelector(link.hash);
  if (section) sectionObserver.observe(section);
});
const metricData = {
 discovery: ['Are the right people finding the product?', 'Qualified traffic & CTR', 'Compare traffic sources and search queries; refine the message and product-page relevance.'],
 consideration: ['Does the product page answer buying questions?', 'Product engagement & add-to-cart rate', 'Review product views and cart additions; test clearer benefits, specifications and product imagery.'],
 conversion: ['Where does purchase intent break down?', 'Checkout completion & conversion rate', 'Compare cart, checkout and purchase events; investigate delivery, payment and usability friction.']
};
const metricTabs = [...document.querySelectorAll('[data-metric]')];
function changeMetric(button, focus=false) {
 metricTabs.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1});
 const data=metricData[button.dataset.metric];
 ['question','signal','action'].forEach((key,i)=>document.getElementById('metric-'+key).textContent=data[i]);
 document.getElementById('metric-panel').setAttribute('aria-labelledby',button.id);
 if(focus)button.focus();
}
metricTabs.forEach((b,i)=>{b.addEventListener('click',()=>changeMetric(b));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();changeMetric(metricTabs[n],true)})});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const revealObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal');revealObserver.unobserve(e.target)}})},{threshold:.08});document.querySelectorAll('.value-rows article,.section-heading,.club-heading,.credential-card').forEach(e=>revealObserver.observe(e))}
