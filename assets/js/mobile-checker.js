function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getMobileTarget(pathname) {
  if (pathname.startsWith('/pages/mobile/') || pathname.startsWith('/mobile/')) {
    return null;
  }

  if (pathname === '/about.html' || pathname === '/pages/desktop/about.html') {
    return '/pages/mobile/about.html';
  }

  if (pathname === '/HomeLab.html' || pathname === '/pages/desktop/homelab.html') {
    return '/pages/mobile/homelab.html';
  }

  if (pathname === '/' || pathname === '/index.html' || pathname === '/pages/desktop/index.html') {
    return '/pages/mobile/index.html';
  }

  return null;
}

if (isMobileDevice()) {
  const target = getMobileTarget(window.location.pathname);
  if (target && target !== window.location.pathname) {
    window.location.href = target;
  }
}
