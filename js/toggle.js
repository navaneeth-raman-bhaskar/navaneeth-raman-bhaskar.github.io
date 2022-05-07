let body = document.getElementsByTagName('body')[0];
let computed = getComputedStyle(body);
let sunIcon = document.getElementById('sun')
const menuProp = '--menu-text';
const grayProp = '--gray';
const bgProp = '--body-bg';
const colorProp = '--body-color';

const menu = computed.getPropertyValue(menuProp)
const gray = computed.getPropertyValue(grayProp)
const bg = computed.getPropertyValue(bgProp)
const color = computed.getPropertyValue(colorProp)

document.getElementById('toggle').addEventListener('click', function (e) {
    e.preventDefault()
    if (this.classList.contains('light')) {
        this.classList.remove('light')
        sunIcon.classList.add('icon-light-sun');
        sunIcon.classList.remove('icon-dark-sun');
        setProp(menu, gray, bg, color)
    } else {
        this.classList.add('light')
        sunIcon.classList.add('icon-dark-sun');
        sunIcon.classList.remove('icon-light-sun');
        setProp('unset', 'unset', 'unset', 'unset')
    }
})

function setProp(m, g, b, c) {
    body.style.setProperty(menuProp, m)
    body.style.setProperty(grayProp, g)
    body.style.setProperty(bgProp, b)
    body.style.setProperty(colorProp, c)
}

