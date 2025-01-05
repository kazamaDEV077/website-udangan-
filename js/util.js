import { storage } from './storage.js';
import { bootstrap } from './bootstrap.js';

export const util = (() => {

    /**
     * @param {string} id
     * @param {number} speed
     * @returns {void}
     */
    const opacity = (id, speed = 0.01) => {
        const el = document.getElementById(id);
        let op = parseInt(el.style.opacity);

        let clear = null;
        const callback = () => {
            if (op > 0) {
                el.style.opacity = op.toFixed(3);
                op -= speed;
                return;
            }

            clearInterval(clear);
            clear = null;
            el.remove();
        };

        clear = setInterval(callback, 10);
    };

    /**
     * @param {string} unsafe
     * @returns {string}
     */
    const escapeHtml = (unsafe) => {
        return String(unsafe)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    /**
     * @param {function} callback
     * @param {number} timeout
     * @returns {void}
     */
    const timeOut = (callback, timeout) => {
        let clear = null;
        const c = () => {
            callback();
            clearTimeout(clear);
            clear = null;
        };

        clear = setTimeout(c, timeout);
    };

    const disableButton = (button, message = 'Loading..') => {

        button.disabled = true;
        const tmp = button.innerHTML;
        button.innerHTML = `<div class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem"></div>${message}`;

        return {
            restore: () => {
                button.innerHTML = tmp;
                button.disabled = false;
            },
        };
    };

    const addLoadingCheckbox = (checkbox) => {
        checkbox.disabled = true;

        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        const tmp = label.innerHTML;
        label.innerHTML = `<div class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem"></div>${tmp}`;

        return {
            restore: () => {
                label.innerHTML = tmp;
                checkbox.disabled = false;
            },
        };
    };

    /**
     * @param {HTMLElement} svg
     * @param {number} timeout
     * @param {string} classes
     * @returns {void}
     */
    const animate = (svg, timeout, classes) => timeOut(() => svg.classList.add(classes), timeout);

    /**
     * @param {HTMLImageElement} img
     * @returns {void}
     */
    const modal = (img) => {
        document.getElementById('show-modal-image').src = img.src;
        bootstrap.Modal.getOrCreateInstance('#modal-image').show();
    };

    const copy = async (button, message = null, timeout = 1500) => {
        const copy = button.getAttribute('data-copy');

        if (!copy || copy.length == 0) {
            alert('Nothing to copy');
            return;
        }

        button.disabled = true;

        try {
            await navigator.clipboard.writeText(copy);
        } catch {
            button.disabled = false;
            alert('Failed to copy');
            return;
        }

        const tmp = button.innerHTML;
        button.innerHTML = message ? message : '<i class="fa-solid fa-check"></i>';

        timeOut(() => {
            button.disabled = false;
            button.innerHTML = tmp;
        }, timeout);
    };

    /**
     * @param {string} str
     * @returns {string}
     */
    const base64Encode = (str) => {
        const encoder = new TextEncoder();
        const encodedBytes = encoder.encode(str);
        return btoa(String.fromCharCode(...encodedBytes));
    };

    /**
     * @param {string} str
     * @returns {string}
     */
    const base64Decode = (str) => {
        const decoder = new TextDecoder();
        const decodedBytes = Uint8Array.from(window.atob(str), (c) => c.charCodeAt(0));
        return decoder.decode(decodedBytes);
    };

    /**
     * @returns {void}
     */
    const closeInformation = () => storage('information').set('info', true);

    return {
        open,
        copy,
        modal,
        timeOut,
        opacity,
        animate,
        escapeHtml,
        base64Encode,
        base64Decode,
        disableButton,
        closeInformation,
        addLoadingCheckbox,
    };
})();