export default defineContentScript({
    matches: ["<all_urls>"],

    main() {
        // Cancelling the click has to be decided synchronously, so the answer is cached rather
        // than looked up per click. It starts false so that a click arriving before the first
        // read resolves still reaches the browser, instead of being swallowed by an extension
        // that may not be configured to send it anywhere.
        let interceptsMagnetLinks = false;

        const refreshInterception = () => {
            hasLeftClickProfile()
                .then((value) => {
                    interceptsMagnetLinks = value;
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        refreshInterception();
        browser.storage.onChanged.addListener(refreshInterception);

        window.addEventListener("click", (event) => {
            if (!interceptsMagnetLinks) {
                return;
            }

            let target = event.target as HTMLElement;

            while (!(target instanceof HTMLAnchorElement && target.href) && target.parentElement) {
                target = target.parentElement;
            }

            if (!(target instanceof HTMLAnchorElement)) {
                return;
            }

            if (target.href.startsWith("magnet:")) {
                event.stopPropagation();
                event.preventDefault();

                browser.runtime.sendMessage({ magnetUrl: target.href }).catch((error) => {
                    console.error(error);
                });
            }
        });
    },
});
