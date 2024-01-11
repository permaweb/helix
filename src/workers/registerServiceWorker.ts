export function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((reg) => {
					console.log('Service Worker registered successfully:', reg);
				})
				.catch((err) => {
					console.log('Service Worker registration failed:', err);
				});
		});
	} else {
		console.log('Service Worker is not supported by your browser.');
	}
}
