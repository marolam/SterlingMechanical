/* script.js — Sterling Mechanical */
(function () {
  'use strict';

  // ── Year in footer ──────────────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Hamburger menu ───────────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mainNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Photo upload preview ─────────────────────────────────────────────────────
  const uploadArea    = document.getElementById('upload-area');
  const fileInput     = document.getElementById('photos');
  const photoPreview  = document.getElementById('photo-preview');
  const placeholder   = document.getElementById('upload-placeholder');

  // Track selected files manually so we can remove individual items
  let selectedFiles = [];

  function renderPreviews() {
    photoPreview.innerHTML = '';
    if (selectedFiles.length === 0) {
      placeholder.hidden = false;
      return;
    }
    placeholder.hidden = true;

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumb = document.createElement('div');
        thumb.className = 'photo-thumb';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.type = 'button';
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          selectedFiles = selectedFiles.filter(f => f !== file);
          syncFileInput();
          renderPreviews();
        });

        thumb.appendChild(img);
        thumb.appendChild(removeBtn);
        photoPreview.appendChild(thumb);
      };
      reader.readAsDataURL(file);
    });
  }

  function syncFileInput() {
    // Create a new DataTransfer to sync the input's files list
    const dt = new DataTransfer();
    selectedFiles.forEach(f => dt.items.add(f));
    fileInput.files = dt.files;
  }

  if (fileInput && uploadArea) {
    fileInput.addEventListener('change', () => {
      Array.from(fileInput.files).forEach(file => {
        if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
          selectedFiles.push(file);
        }
      });
      syncFileInput();
      renderPreviews();
    });

    // Drag-and-drop highlights
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
            selectedFiles.push(file);
          }
        }
      });
      syncFileInput();
      renderPreviews();
    });
  }

  // ── Quote form validation & submission ───────────────────────────────────────
  const form       = document.getElementById('quote-form');
  const submitBtn  = document.getElementById('submit-btn');
  const btnText    = document.getElementById('btn-text');
  const btnLoading = document.getElementById('btn-loading');
  const successBox = document.getElementById('form-success');
  const errorBox   = document.getElementById('form-error');

  function showError(fieldId, message) {
    const el = document.getElementById(fieldId + '-error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = message;
    if (input) input.classList.add('invalid');
  }

  function clearError(fieldId) {
    const el = document.getElementById(fieldId + '-error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = '';
    if (input) input.classList.remove('invalid');
  }

  function validateForm() {
    let valid = true;

    // Name
    const name = document.getElementById('name');
    clearError('name');
    if (!name || name.value.trim().length < 2) {
      showError('name', 'Please enter your full name.');
      valid = false;
    }

    // Phone
    const phone = document.getElementById('phone');
    clearError('phone');
    const phoneVal = phone ? phone.value.trim().replace(/\s/g, '') : '';
    if (!phoneVal || phoneVal.length < 7) {
      showError('phone', 'Please enter a valid phone number.');
      valid = false;
    }

    // Email (optional but validate format if provided)
    const email = document.getElementById('email');
    clearError('email');
    if (email && email.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value.trim())) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
      }
    }

    // Job type
    const jobType = document.getElementById('job-type');
    clearError('job-type');
    if (!jobType || !jobType.value) {
      showError('job-type', 'Please select a job type.');
      valid = false;
    }

    // Details
    const details = document.getElementById('details');
    clearError('details');
    if (!details || details.value.trim().length < 10) {
      showError('details', 'Please describe the job in a bit more detail.');
      valid = false;
    }

    // Consent
    const consent = document.getElementById('consent');
    clearError('consent');
    if (!consent || !consent.checked) {
      showError('consent', 'Please confirm your consent to be contacted.');
      valid = false;
    }

    return valid;
  }

  if (form) {
    // Real-time error clearing
    ['name', 'phone', 'email', 'job-type', 'details'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => clearError(id));
    });
    const consent = document.getElementById('consent');
    if (consent) consent.addEventListener('change', () => clearError('consent'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      successBox.hidden = true;
      errorBox.hidden   = true;

      if (!validateForm()) return;

      // Show loading state
      submitBtn.disabled = true;
      btnText.hidden     = true;
      btnLoading.hidden  = false;

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          successBox.hidden = false;
          form.reset();
          selectedFiles = [];
          renderPreviews();
          successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          const json = await response.json().catch(() => ({}));
          if (json.errors) {
            // Formspree error detail
            errorBox.querySelector('strong').textContent = json.errors.map(err => err.message).join(', ');
          }
          errorBox.hidden = false;
        }
      } catch (_err) {
        errorBox.hidden = false;
      } finally {
        submitBtn.disabled = false;
        btnText.hidden     = false;
        btnLoading.hidden  = true;
      }
    });
  }

})();
