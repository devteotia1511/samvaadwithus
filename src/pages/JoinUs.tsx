import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, Department } from '../lib/supabase';
import { Users, ArrowUpRight, CheckCircle, Send, Loader } from 'lucide-react';

const JoinUs = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    experience: '',
    motivation: '',
    terms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Join Us';
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Fallback to mock data if database fetch fails
      setDepartments([
        { id: '1', name: 'Acting', description: 'Bring characters to life on stage through the art of performance.', created_at: '2024-01-01T10:00:00Z' },
        { id: '2', name: 'Creative Writing', description: 'Guide the creative vision of productions and collaborate with teams.', created_at: '2024-01-02T10:00:00Z' },
        { id: '3', name: 'Graphic Designing', description: 'Create visual content and promotional materials for productions.', created_at: '2024-01-03T10:00:00Z' },
        { id: '4', name: 'Cinematography', description: 'Capture and document our theatrical performances and events.', created_at: '2024-01-04T10:00:00Z' },
        { id: '5', name: 'Promotion', description: 'Manage marketing and outreach for our productions and events.', created_at: '2024-01-05T10:00:00Z' },
        { id: '6', name: 'Decor', description: 'Design and create sets, props, and visual environments for performances.', created_at: '2024-01-06T10:00:00Z' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.department || !formData.terms) {
        throw new Error('Please fill in all required fields and accept the terms.');
      }

      // Submit to messages table (as a contact form submission)
      const { error } = await supabase
        .from('messages')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: `Application for ${departments.find(d => d.id === formData.department)?.name || 'Unknown Department'}

Phone: ${formData.phone}

Previous Experience:
${formData.experience || 'None specified'}

Motivation:
${formData.motivation || 'None specified'}

This is an application to join Samvaad Theatre Group.`
        }]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text: 'Your application has been submitted successfully! We will contact you soon.'
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        experience: '',
        motivation: '',
        terms: false
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to submit application. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
              Join <span className="text-primary-500">Samvaad</span>
            </h1>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Become part of our theatrical family and contribute to the magic of performance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Zzc9yfXHY018L-v5lADI9GRv8ny10Ff-xQ&s"
                alt="Theatre workshop" 
                className="w-full object-cover aspect-video"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-500 to-transparent opacity-60"></div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">Why Join Us?</h2>
            <div className="w-16 h-1 bg-primary-500"></div>
            <p className="text-gray-300">
              Samvaad Theatre Group offers a vibrant community for anyone passionate about theatre. Whether you're an experienced performer or completely new to the stage, we welcome diverse talents and perspectives.
            </p>
            <p className="text-gray-300">
              By joining our group, you'll have the opportunity to:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Develop your skills through workshops and training sessions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Participate in professional productions with experienced mentors</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Connect with a community of like-minded theatre enthusiasts</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Explore various aspects of theatre, from performance to production</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">Be part of creating meaningful and impactful theatrical experiences</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Departments */}
      <section className="section bg-dark-400 py-16 rounded-lg">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Departments</h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Explore the various departments where you can contribute your talents
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department, index) => (
                <motion.div
                  key={department.id}
                  className="bg-dark-300 p-6 rounded-lg hover:bg-dark-200 transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold mb-3">{department.name}</h3>
                  <p className="text-gray-300 mb-4">{department.description}</p>
                  <a 
                    href="#application" 
                    className="inline-flex items-center text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    Apply for this department <ArrowUpRight className="h-4 w-4 ml-1" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Application Process</h2>
          <div className="w-16 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Follow these steps to join Samvaad Theatre Group
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-dark-400 p-6 rounded-lg relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl">
                {index + 1}
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="section bg-dark-400 py-16 rounded-lg">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Apply Now</h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-gray-300">
              Fill out the form below to express your interest in joining Samvaad Theatre Group
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-dark-300 p-6 md:p-8 rounded-lg">
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-md ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500 text-green-300' 
                    : 'bg-red-500/20 border border-red-500 text-red-300'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-white mb-2">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-dark-400 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-white mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-dark-400 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-white mb-2">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-dark-400 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-white mb-2">Phone *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-dark-400 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="department" className="block text-white mb-2">Department of Interest *</label>
                  <select 
                    id="department" 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full bg-dark-400 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="experience" className="block text-white mb-2">Previous Experience</label>
                  <textarea 
                    id="experience" 
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-dark-400 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Briefly describe your relevant experience (if any)"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="motivation" className="block text-white mb-2">Why do you want to join Samvaad?</label>
                  <textarea 
                    id="motivation" 
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-dark-400 border border-dark-200 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell us why you're interested in joining our theatre group"
                  ></textarea>
                </div>
                
                <div className="flex items-center mb-6">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-200 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-gray-300">
                    I agree to the terms and conditions *
                  </label>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
          <div className="w-16 h-1 bg-primary-500 mx-auto mb-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-dark-400 p-6 rounded-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const steps = [
  {
    title: 'Submit Application',
    description: 'Fill out our online application form with your details and area of interest within theatre.'
  },
  {
    title: 'Skill Based Round',
    description: 'Demonstrate your skills relevant to your chosen department through practical tasks or assessments.'
  },
  {
    title: 'Domain Based Round',
    description: 'Participate in a domain-specific evaluation to showcase your expertise and understanding of the field.'
  },
  {
    title: 'Final Interview',
    description: 'Engage in a one-on-one interview with our team to discuss your aspirations and fit within the group.'
  }
];

const faqs = [
  {
    question: 'Do I need prior experience to join?',
    answer: 'No, we welcome members with all levels of experience, from beginners to professionals. What matters most is your passion and commitment to learning.'
  },
  {
    question: 'Is there a membership fee?',
    answer: 'There is a nominal annual membership fee that helps cover basic operational costs. However, we offer fee waivers in certain circumstances.'
  },
  {
    question: 'What is the time commitment?',
    answer: 'Time commitment varies depending on your role and the production schedule. Typically, rehearsals increase as performance dates approach.'
  },
  {
    question: 'Can I be involved in multiple departments?',
    answer: 'Yes, many of our members contribute to multiple aspects of production. This is encouraged for those who want to develop diverse theatrical skills.'
  },
  {
    question: 'Do you accept international applicants?',
    answer: 'Yes, we welcome international applicants, though physical presence in the city is required for most productions and activities.'
  },
  {
    question: 'How often do you produce shows?',
    answer: 'We typically produce 3-4 major productions per year, along with various workshops, readings, and smaller performances throughout the year.'
  }
];

export default JoinUs;