// Validação avançada de formulários
function validateForm(form) {
    const errors = [];
    const formData = new FormData(form);
    
    // Validação de email
    const email = formData.get('email');
    if (email && !isValidEmail(email)) {
        errors.push('Por favor, insira um e-mail válido.');
    }
    
    // Validação de telefone
    const telefone = formData.get('telefone');
    if (telefone && !isValidPhone(telefone)) {
        errors.push('Por favor, insira um telefone válido.');
    }
    
    // Validação de arquivo (se houver)
    const arquivo = form.querySelector('input[type="file"]');
    if (arquivo && arquivo.files.length > 0) {
        const file = arquivo.files[0];
        if (!isValidFile(file)) {
            errors.push('Arquivo deve ser JPG, PNG, PDF ou DWG e ter no máximo 10MB.');
        }
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
}

function isValidFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/dwg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize;
}

// Sistema de notificações melhorado
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'success', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px;">${icon}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; font-size: 18px; cursor: pointer;">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            ${this.getTypeStyles(type)}
        `;
        
        this.container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remover
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    }
    
    getTypeStyles(type) {
        switch (type) {
            case 'success':
                return 'background: linear-gradient(135deg, #10b981, #059669);';
            case 'error':
                return 'background: linear-gradient(135deg, #ef4444, #dc2626);';
            case 'warning':
                return 'background: linear-gradient(135deg, #f59e0b, #d97706);';
            case 'info':
                return 'background: linear-gradient(135deg, #3b82f6, #2563eb);';
            default:
                return 'background: linear-gradient(135deg, #6b7280, #4b5563);';
        }
    }
    
    remove(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }
}

// Instanciar sistema de notificações
const notifications = new NotificationSystem();

// Melhorar o envio de formulários
function handleFormSubmit(form, successMessage) {
    const errors = validateForm(form);
    
    if (errors.length > 0) {
        errors.forEach(error => {
            notifications.show(error, 'error');
        });
        return false;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Estado de carregamento
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simular envio (em produção, aqui seria a chamada real para o servidor)
    setTimeout(() => {
        notifications.show(successMessage, 'success');
        form.reset();
        
        // Restaurar botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
    
    return true;
}

// Integração com WhatsApp
function openWhatsApp(phone, message = '') {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, '_blank');
}

// Função para gerar mensagem automática do WhatsApp baseada no formulário
function generateWhatsAppMessage(formData) {
    let message = "Olá! Gostaria de solicitar um orçamento para:\n\n";
    
    if (formData.get('nome')) {
        message += `Nome: ${formData.get('nome')}\n`;
    }
    if (formData.get('servico')) {
        message += `Serviço: ${formData.get('servico')}\n`;
    }
    if (formData.get('localizacao')) {
        message += `Localização: ${formData.get('localizacao')}\n`;
    }
    if (formData.get('descricao')) {
        message += `Descrição: ${formData.get('descricao')}\n`;
    }
    
    message += "\nAguardo retorno. Obrigado!";
    return message;
}

// Melhorar a máscara de telefone
function applyPhoneMask(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
        }
        
        e.target.value = value;
    });
}

// Função para preview de arquivo
function setupFilePreview(fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Remover preview anterior
        const existingPreview = fileInput.parentElement.querySelector('.file-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Criar preview
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        preview.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            background: #f9fafb;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const fileIcon = file.type.startsWith('image/') ? '🖼️' : '📄';
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        preview.innerHTML = `
            <span style="font-size: 20px;">${fileIcon}</span>
            <div>
                <div style="font-weight: 600;">${file.name}</div>
                <div style="font-size: 0.9rem; color: #6b7280;">${fileSize} MB</div>
            </div>
            <button type="button" onclick="this.parentElement.remove(); document.getElementById('${fileInput.id}').value = '';" style="margin-left: auto; background: #ef4444; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Remover</button>
        `;
        
        fileInput.parentElement.appendChild(preview);
        
        // Validar arquivo
        if (!isValidFile(file)) {
            notifications.show('Arquivo inválido. Use JPG, PNG, PDF ou DWG com no máximo 10MB.', 'error');
            preview.remove();
            fileInput.value = '';
        }
    });
}

// Função para criar Google Maps embed
function createGoogleMapsEmbed(address, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const encodedAddress = encodeURIComponent(address);
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
    iframe.style.cssText = `
        width: 100%;
        height: 400px;
        border: 0;
        border-radius: 12px;
    `;
    iframe.allowfullscreen = true;
    iframe.loading = 'lazy';
    
    container.appendChild(iframe);
}

// Inicializar funcionalidades quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar máscaras de telefone
    document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);
    
    // Configurar preview de arquivos
    document.querySelectorAll('input[type="file"]').forEach(setupFilePreview);
    
    // Melhorar formulários existentes
    const orcamentoForm = document.getElementById('orcamentoForm');
    if (orcamentoForm) {
        orcamentoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Solicitação de orçamento enviada com sucesso! Nossa equipe entrará em contato em breve.');
        });
        
        // Botão WhatsApp no formulário de orçamento
        const whatsappBtn = document.createElement('button');
        whatsappBtn.type = 'button';
        whatsappBtn.className = 'btn btn-secondary';
        whatsappBtn.style.marginTop = '10px';
        whatsappBtn.textContent = 'Enviar via WhatsApp';
        whatsappBtn.addEventListener('click', function() {
            const formData = new FormData(orcamentoForm);
            const message = generateWhatsAppMessage(formData);
            openWhatsApp('5511999999999', message);
        });
        
        const submitBtn = orcamentoForm.querySelector('button[type="submit"]');
        submitBtn.parentElement.appendChild(whatsappBtn);
    }
    
    const contatoForm = document.getElementById('contatoForm');
    if (contatoForm) {
        contatoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Mensagem enviada com sucesso! Responderemos em breve.');
        });
    }
    
    // Configurar links do WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const phone = this.href.match(/wa\.me\/(\d+)/)[1];
            openWhatsApp(phone, 'Olá! Gostaria de mais informações sobre os serviços da D&A Construção.');
        });
    });
});

// Função para analytics melhorado
function trackAdvancedEvent(eventName, eventData) {
    // Integração com Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Integração com Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
    
    // Log local para desenvolvimento
    console.log('Advanced Event:', eventName, eventData);
}

// Rastreamento de engajamento
let timeOnPage = 0;
setInterval(() => {
    timeOnPage += 1;
    if (timeOnPage % 30 === 0) { // A cada 30 segundos
        trackAdvancedEvent('page_engagement', {
            time_on_page: timeOnPage,
            page: window.location.pathname
        });
    }
}, 1000);

// Rastreamento de scroll
let maxScroll = 0;
window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // A cada 25% de scroll
            trackAdvancedEvent('scroll_depth', {
                scroll_percent: maxScroll,
                page: window.location.pathname
            });
        }
    }
});

