/**
 * ConfirmationDialog - Generic confirmation dialog component
 */

export class ConfirmationDialog {
    constructor(container) {
        this.container = container;
        this.onConfirm = null;
        this.onCancel = null;
    }

    show(options = {}) {
        const {
            title = 'Confirm',
            message = 'Are you sure?',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm = () => {},
            onCancel = () => {}
        } = options;

        this.onConfirm = onConfirm;
        this.onCancel = onCancel;

        this.container.innerHTML = `
            <div class="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
                <div class="dialog">
                    <div class="dialog-header">
                        <h3 id="dialog-title">${this.escapeHTML(title)}</h3>
                    </div>
                    <div class="dialog-body">
                        <p>${this.escapeHTML(message)}</p>
                    </div>
                    <div class="dialog-actions">
                        <button class="btn btn-secondary cancel-btn">${this.escapeHTML(cancelText)}</button>
                        <button class="btn btn-danger confirm-btn">${this.escapeHTML(confirmText)}</button>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
        
        // Focus confirm button
        setTimeout(() => {
            this.container.querySelector('.confirm-btn')?.focus();
        }, 100);
    }

    hide() {
        this.container.innerHTML = '';
        this.onConfirm = null;
        this.onCancel = null;
    }

    attachEventListeners() {
        const confirmBtn = this.container.querySelector('.confirm-btn');
        const cancelBtn = this.container.querySelector('.cancel-btn');
        const overlay = this.container.querySelector('.dialog-overlay');

        confirmBtn.addEventListener('click', () => {
            if (this.onConfirm) {
                this.onConfirm();
            }
            this.hide();
        });

        cancelBtn.addEventListener('click', () => {
            if (this.onCancel) {
                this.onCancel();
            }
            this.hide();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (this.onCancel) {
                    this.onCancel();
                }
                this.hide();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (this.onCancel) {
                    this.onCancel();
                }
                this.hide();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}
