(function RTWidgets(){

  function isRTWidgetInViewport (el) {
    const r = el.getBoundingClientRect();
    return (r.top >= 0 && r.left >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight) && r.right <= (window.innerWidth || document.documentElement.clientWidth));
  }

  function getRTWidgetDomain() {
    if(!location || !location.hostname) { return }
    const domain = location.hostname.replace(/^[^.]+\./g, "");
    return domain === "localhost" ? `http://${domain}:3000` : `https://w.${domain}`
  }

  function initRTWidget(target) {

    if(!target) { return }

    const id = target.getAttribute('id') + '-iframe';
    const path = target.getAttribute('data-path');

    if(!id || ! path) { return }

    const type = target.getAttribute('data-type');
    const fullUrl = target.getAttribute('data-full-url');
    const data = [];

    if(id) { data.push('id=' + id ) }
    if(type) { data.push('type=' + type ) }
    if(fullUrl) { data.push('fullUrl=' + fullUrl ) }

    const url = getRTWidgetDomain()
    const pathWithParams = path + '?' + data.join('&');
    const urlWithParams = `${url}/${pathWithParams}`
    const iframe = document.createElement('iframe');

    iframe.src = urlWithParams
    iframe.id = id
    iframe.width = "100%"
    iframe.setAttribute('scrolling', 'no')
    iframe.setAttribute('frameBorder', false)
    iframe.setAttribute('allow', 'clipboard-read; clipboard-write')

    target.classList.add("active");
    target.style.height = "auto";
    target.innerHTML = "";
    target.appendChild(iframe);
  }

  function initRTWidgets() {
    const targets = document.querySelectorAll(".rt-widget:not(.active)")
    for(let i = 0; i < targets.length; i++) {
      if(!isRTWidgetInViewport(targets[i])) { return }
      const widget = document.getElementById(targets[i].id)
      initRTWidget(widget)
    }
  }

  function recieveRTWidgetMessage(event) {
    if(!event || !event.origin || !event.data || !event.data.name) { return }
    if (event.origin !== getRTWidgetDomain()) { return }
    const iframe = document.getElementById(event.data.name)
    if(!iframe) { return }
    const height = event.data.height
    iframe.style.height = height + 'px'
  }

  window.addEventListener('message', recieveRTWidgetMessage, false);
  window.addEventListener('DOMContentLoaded', initRTWidgets);
  window.addEventListener('load', initRTWidgets);
  window.addEventListener('resize', initRTWidgets);
  window.addEventListener('scroll', initRTWidgets);
})();