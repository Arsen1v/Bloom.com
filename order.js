function formatCard(el) {
    let v = el.value.replace(/\D/g, '').substring(0, 16);
    el.value = v.replace(/(.{4})/g, '$1 ').trim();

    const icon = document.getElementById('card-brand-icon');
    const msg = document.getElementById('card-valid-msg');

    // Определяем бренд
    let brand = null;
    if (/^4/.test(v)) brand = 'visa';
    else if (/^5[1-5]|^2[2-7]/.test(v)) brand = 'mastercard';
    else if (/^3[47]/.test(v)) brand = 'amex';
    else if (/^6(?:011|5)/.test(v)) brand = 'discover';

    // Иконка
    const icons = {
        visa: `<svg width="36" height="24" viewBox="0 0 48 30" fill="none">
            <rect width="48" height="30" rx="4" fill="#1a1f71"/>
            <rect y="8" width="48" height="8" fill="#f7b600"/>
            <text x="6" y="22" font-size="9" fill="#fff" font-family="sans-serif" font-weight="700">VISA</text>
        </svg>`,
        mastercard: `<svg width="36" height="24" viewBox="0 0 48 30" fill="none">
            <rect width="48" height="30" rx="4" fill="#252525"/>
            <circle cx="19" cy="15" r="9" fill="#eb001b"/>
            <circle cx="29" cy="15" r="9" fill="#f79e1b"/>
        </svg>`,
        amex: `<svg width="36" height="24" viewBox="0 0 48 30" fill="none">
            <rect width="48" height="30" rx="4" fill="#016fd0"/>
            <text x="4" y="20" font-size="8" fill="#fff" font-family="sans-serif" font-weight="700">AMEX</text>
        </svg>`,
        discover: `<svg width="36" height="24" viewBox="0 0 48 30" fill="none">
            <rect width="48" height="30" rx="4" fill="#f26122"/>
            <text x="4" y="20" font-size="7" fill="#fff" font-family="sans-serif" font-weight="700">Discover</text>
        </svg>`
    };

    icon.innerHTML = brand ? icons[brand] : '';

    // Валидация алгоритмом Луна
    if (v.length === 16) {
        let sum = 0;
        for (let i = 0; i < 16; i++) {
            let d = parseInt(v[i]);
            if ((16 - i) % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
            sum += d;
        }
        if (sum % 10 === 0) {
            msg.textContent = '✓ Valid card number';
            msg.className = 'card-valid-msg valid';
        } else {
            msg.textContent = '✗ Invalid card number';
            msg.className = 'card-valid-msg invalid';
        }
    } else {
        msg.textContent = '';
        msg.className = 'card-valid-msg';
    }
}
function formatExpiry(el) {
    let v = el.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
    el.value = v;

    const msg = document.getElementById('expiry-msg');
    const raw = el.value.replace(/\D/g, '');

    if (raw.length === 4) {
        const month = parseInt(raw.substring(0, 2));
        const year = parseInt('20' + raw.substring(2));
        const now = new Date();
        const expDate = new Date(year, month - 1);

        if (month < 1 || month > 12) {
            msg.textContent = '✗ Invalid month';
            msg.className = 'card-valid-msg invalid';
        } else if (expDate < new Date(now.getFullYear(), now.getMonth())) {
            msg.textContent = '✗ Card expired';
            msg.className = 'card-valid-msg invalid';
        } else {
            msg.textContent = '✓ Valid';
            msg.className = 'card-valid-msg valid';
        }
    } else {
        msg.textContent = '';
        msg.className = 'card-valid-msg';
    }
}

function validateCvv(el) {
    el.value = el.value.replace(/\D/g, '').substring(0, 3);
    const msg = document.getElementById('cvv-msg');
    if (el.value.length === 3) {
        msg.textContent = '✓ Valid';
        msg.className = 'card-valid-msg valid';
    } else if (el.value.length > 0) {
        msg.textContent = '✗ 3 digits required';
        msg.className = 'card-valid-msg invalid';
    } else {
        msg.textContent = '';
        msg.className = 'card-valid-msg';
    }
}

function validateZip(el) {
    el.value = el.value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
    const msg = document.getElementById('zip-msg');
    if (el.value.length >= 4) {
        msg.textContent = '✓ Valid';
        msg.className = 'card-valid-msg valid';
    } else if (el.value.length > 0) {
        msg.textContent = '✗ Too short';
        msg.className = 'card-valid-msg invalid';
    } else {
        msg.textContent = '';
        msg.className = 'card-valid-msg';
    }
}