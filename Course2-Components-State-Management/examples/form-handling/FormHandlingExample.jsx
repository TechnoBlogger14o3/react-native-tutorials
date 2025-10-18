import React, { useState } from 'react';

// Example 1: Basic Controlled Form
function BasicContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', message: '', newsletter: false });
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="basic-contact-form">
      <h2>📝 Basic Contact Form</h2>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="your.email@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? 'error' : ''}
            placeholder="Your message here..."
            rows="4"
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
            />
            Subscribe to newsletter
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

// Example 2: Multi-Step Form
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2: Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Step 3: Preferences
    interests: [],
    experience: '',
    newsletter: false
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Address' },
    { number: 3, title: 'Preferences' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'interests') {
      setFormData(prev => ({
        ...prev,
        interests: checked 
          ? [...prev.interests, value]
          : prev.interests.filter(interest => interest !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        break;
      case 2:
        if (!formData.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
      case 3:
        if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
        if (!formData.experience) newErrors.experience = 'Please select your experience level';
        break;
    }
    
    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    console.log('Multi-step form submitted:', formData);
    alert('Form submitted successfully!');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-content">
            <h3>Address Information</h3>
            <div className="form-group">
              <label htmlFor="street">Street Address:</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={errors.street ? 'error' : ''}
              />
              {errors.street && <span className="error-message">{errors.street}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State:</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code:</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'error' : ''}
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-content">
            <h3>Preferences</h3>
            <div className="form-group">
              <label>Interests:</label>
              <div className="checkbox-group">
                {['Technology', 'Sports', 'Music', 'Travel', 'Cooking'].map(interest => (
                  <label key={interest} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={handleChange}
                    />
                    {interest}
                  </label>
                ))}
              </div>
              {errors.interests && <span className="error-message">{errors.interests}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="experience">Experience Level:</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={errors.experience ? 'error' : ''}
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.experience && <span className="error-message">{errors.experience}</span>}
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                Subscribe to newsletter
              </label>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="multi-step-form">
      <h2>📋 Multi-Step Form</h2>
      
      <div className="step-indicator">
        {steps.map(step => (
          <div 
            key={step.number} 
            className={`step ${currentStep >= step.number ? 'active' : ''}`}
          >
            <span className="step-number">{step.number}</span>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderStep()}
        
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="nav-btn prev-btn">
              ← Previous
            </button>
          )}
          
          {currentStep < steps.length ? (
            <button type="button" onClick={nextStep} className="nav-btn next-btn">
              Next →
            </button>
          ) : (
            <button type="submit" className="submit-btn">
              Submit Form
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Example 3: Dynamic Form Fields
function DynamicForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [{ id: 1, name: '', level: 'beginner' }],
    experience: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: '',
      level: 'beginner'
    };
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const removeSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId)
    }));
  };

  const updateSkill = (skillId, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === skillId ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      duration: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const removeExperience = (expId) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== expId)
    }));
  };

  const updateExperience = (expId, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === expId ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dynamic form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="dynamic-form">
      <h2>🔄 Dynamic Form Fields</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Job Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the role..."
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>Skills:</label>
          {formData.skills.map(skill => (
            <div key={skill.id} className="skill-item">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="Skill name"
              />
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="remove-btn"
              >
                🗑️
              </button>
            </div>
          ))}
          <button type="button" onClick={addSkill} className="add-btn">
            ➕ Add Skill
          </button>
        </div>
        
        <div className="form-group">
          <label>Work Experience:</label>
          {formData.experience.map(exp => (
            <div key={exp.id} className="experience-item">
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Company name"
              />
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Position"
              />
              <input
                type="text"
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                placeholder="Duration (e.g., 2020-2023)"
              />
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Job description..."
                rows="2"
              />
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="remove-btn"
              >
                🗑️
              </button>
            </div>
          ))}
          <button type="button" onClick={addExperience} className="add-btn">
            ➕ Add Experience
          </button>
        </div>
        
        <button type="submit" className="submit-btn">
          Submit Application
        </button>
      </form>
    </div>
  );
}

// Main component that demonstrates all examples
function FormHandlingExample() {
  const [currentExample, setCurrentExample] = useState('basic');

  return (
    <div className="form-handling-example">
      <h1>📝 Form Handling Examples</h1>
      
      <div className="example-selector">
        <button 
          onClick={() => setCurrentExample('basic')}
          className={currentExample === 'basic' ? 'active' : ''}
        >
          Basic Form
        </button>
        <button 
          onClick={() => setCurrentExample('multistep')}
          className={currentExample === 'multistep' ? 'active' : ''}
        >
          Multi-Step Form
        </button>
        <button 
          onClick={() => setCurrentExample('dynamic')}
          className={currentExample === 'dynamic' ? 'active' : ''}
        >
          Dynamic Fields
        </button>
      </div>

      <div className="example-content">
        {currentExample === 'basic' && <BasicContactForm />}
        {currentExample === 'multistep' && <MultiStepForm />}
        {currentExample === 'dynamic' && <DynamicForm />}
      </div>

      <div className="explanation">
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Controlled Components:</strong> Form data controlled by React state</li>
          <li><strong>Form Validation:</strong> Real-time and submit-time validation</li>
          <li><strong>Error Handling:</strong> Display and clear validation errors</li>
          <li><strong>Multi-Step Forms:</strong> Break complex forms into manageable steps</li>
          <li><strong>Dynamic Fields:</strong> Add/remove form fields dynamically</li>
          <li><strong>Form Submission:</strong> Handle form submission with loading states</li>
        </ul>
      </div>
    </div>
  );
}

export default FormHandlingExample;
