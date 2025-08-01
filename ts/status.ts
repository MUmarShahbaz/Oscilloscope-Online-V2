namespace alerts {
    
    interface AlertOptions {
        type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
        message: string;
        dismissible?: boolean;
        autoClose?: number;
        title?: string;
        icon?: string;
    }

    export function createAlert(options: AlertOptions): HTMLElement {
        const {
            type = 'info',
            message,
            dismissible = true,
            autoClose,
            title,
            icon
        } = options;

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} m-2 shadow-sm`;
        alertDiv.setAttribute('role', 'alert');
        
        if (dismissible) {
            alertDiv.classList.add('alert-dismissible');
        }

        let alertContent = '';
        
        if (icon) {
            alertContent += `<i class="${icon} me-2"></i>`;
        }
        
        if (title) {
            alertContent += `<strong>${title}</strong> `;
        }
        
        alertContent += message;
        
        if (dismissible) {
            alertContent += `
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
        }

        alertDiv.innerHTML = alertContent;

        const statusContainer = document.getElementById('status_messages');
        if (!statusContainer) {
            console.error('Status messages container not found');
            return alertDiv;
        }

        statusContainer.appendChild(alertDiv);

        if (autoClose && autoClose > 0) {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, autoClose);
        }

        return alertDiv;
    }

    export function success(message: string, options: Partial<AlertOptions> = {}): HTMLElement {
        return createAlert({ icon: 'fas fa-check-circle', ...options, type: 'success', message });
    }

    export function error(message: string, options: Partial<AlertOptions> = {}): HTMLElement {
        return createAlert({ icon: 'fas fa-times-circle', ...options, type: 'danger', message });
    }

    export function warning(message: string, options: Partial<AlertOptions> = {}): HTMLElement {
        return createAlert({ icon: 'fas fa-exclamation-triangle', ...options, type: 'warning', message });
    }

    export function info(message: string, options: Partial<AlertOptions> = {}): HTMLElement {
        return createAlert({ icon: 'fas fa-info-circle', ...options, type: 'info', message });
    }

    export function clearAll(): void {
        const statusContainer = document.getElementById('status_messages');
        if (statusContainer) {
            statusContainer.innerHTML = '';
        }
    }
}