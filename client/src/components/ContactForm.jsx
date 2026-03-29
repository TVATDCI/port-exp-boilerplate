import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../api';
import { FADE_UP } from '../utils/motionPresets';

const TerminalInput = ({ label, type = 'text', name, value, onChange, required, rows }) => {
  const InputComponent = rows ? 'textarea' : 'input';
  
  return (
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block font-mono text-xs uppercase tracking-wider mb-2"
        style={{ color: 'var(--color-brand-primary)' }}
      >
        {label}
      </label>
      <div className="relative">
        <span 
          className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          $
        </span>
        <InputComponent
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className="w-full bg-surface-base border border-border-color rounded p-2 pl-8 font-mono text-sm focus:outline-none focus:border-brand-primary transition-colors"
          style={{ 
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-color)'
          }}
        />
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [terminalOutput, setTerminalOutput] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addOutput = (text, type = 'info') => {
    setTerminalOutput(prev => [...prev, { text, type, id: Date.now() }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTerminalOutput([]);

    addOutput('Initializing connection...', 'system');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addOutput('Connecting to server...', 'system');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addOutput('Validating input data...', 'system');
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      addOutput('Message transmitted successfully!', 'success');
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setTerminalOutput([]);
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      addOutput(`Error: ${error.message}`, 'error');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Terminal window */}
      <motion.div
        className="rounded-lg overflow-hidden border"
        style={{ borderColor: 'var(--color-border-color)' }}
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
      >
        {/* Terminal header */}
        <div 
          className="px-4 py-2 flex items-center gap-2 border-b"
          style={{ 
            backgroundColor: 'var(--color-surface-elevated)',
            borderColor: 'var(--color-border-color)'
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-mono ml-2" style={{ color: 'var(--color-text-muted)' }}>
            contact_form.exe
          </span>
        </div>

        {/* Terminal body */}
        <div 
          className="p-6"
          style={{ backgroundColor: 'var(--color-surface-base)' }}
        >
          <form onSubmit={handleSubmit}>
            <TerminalInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TerminalInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TerminalInput
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
            />

            {/* Submit button */}
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                type="submit"
                className="px-6 py-2 rounded font-mono text-sm border transition-all duration-300"
                style={{
                  backgroundColor: status === 'submitting' ? 'var(--color-surface-elevated)' : 'var(--color-brand-primary)',
                  color: status === 'submitting' ? 'var(--color-text-muted)' : 'var(--color-surface-base)',
                  borderColor: 'var(--color-brand-primary)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Transmitting...' : './send_message'}
              </motion.button>

              {/* Status indicators */}
              {status === 'success' && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-sm"
                  style={{ color: 'var(--color-status-success)' }}
                >
                  ✓ Message sent!
                </motion.span>
              )}
              {status === 'error' && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-sm"
                  style={{ color: 'var(--color-status-error)' }}
                >
                  ✗ Failed to send
                </motion.span>
              )}
            </div>
          </form>

          {/* Terminal output */}
          {terminalOutput.length > 0 && (
            <motion.div
              className="mt-6 pt-4 border-t font-mono text-xs"
              style={{ borderColor: 'var(--color-border-color)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {terminalOutput.map((line) => (
                <div
                  key={line.id}
                  className="mb-1"
                  style={{
                    color: line.type === 'success' ? 'var(--color-status-success)' :
                           line.type === 'error' ? 'var(--color-status-error)' :
                           line.type === 'system' ? 'var(--color-brand-primary)' :
                           'var(--color-text-secondary)'
                  }}
                >
                  {line.type === 'system' ? '›' : '$'} {line.text}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
