export class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modal-body');
        this.closeBtn = document.querySelector('.modal-close');
        this.backdrop = document.querySelector('.modal-backdrop');
        this.setupListeners();
    }

    setupListeners() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.backdrop.addEventListener('click', () => this.close());
    }

    open(content) {
        this.modalBody.innerHTML = '';
        this.modalBody.innerHTML = content;
        this.modal.classList.add('open');
    }

    close() {
        this.modal.classList.remove('open');
        this.modalBody.innerHTML = '';
        // Emituj event zamknięcia modalu
        const event = new CustomEvent('modal-closed');
        document.dispatchEvent(event);
    }
}