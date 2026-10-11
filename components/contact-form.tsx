"use client";

import { type FormEvent, useState } from "react";

/** Mirrors the original Contact Form 7 fields; sending hands the message to the visitor's mail app. */
export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("your-name")).trim();
    const from = String(data.get("your-email")).trim();
    const subject = String(data.get("your-subject")).trim() || `Message from ${name}`;
    const message = String(data.get("your-message")).trim();
    const body = `${message}\n\n— ${name} <${from}>`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Your email app should open with the message ready to send.");
  }

  return (
    <form className="contact-form" aria-label="Contact form" onSubmit={onSubmit} noValidate>
      <label>
        <span>Your Name (required)</span>
        <input type="text" name="your-name" size={40} required autoComplete="name" />
      </label>
      <label>
        <span>Your Email (required)</span>
        <input type="email" name="your-email" size={40} required autoComplete="email" />
      </label>
      <label>
        <span>Subject</span>
        <input type="text" name="your-subject" size={40} />
      </label>
      <label>
        <span>Your Message</span>
        <textarea name="your-message" cols={40} rows={10} />
      </label>
      <p>
        <input type="submit" value="Send" />
      </p>
      <p className="contact-form-note" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
