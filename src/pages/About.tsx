import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Theater, Award, Star, Lightbulb } from 'lucide-react';

const About = () => {
  useEffect(() => {
    document.title = 'Samvaad Theatre Group - About Us';
  }, []);

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
              About <span className="text-primary-500">Samvaad</span>
            </h1>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A journey through passion, creativity, and theatrical excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Theatre rehearsal" 
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
              <h2 className="text-3xl md:text-4xl font-display font-bold">Our Story</h2>
              <div className="w-16 h-1 bg-primary-500"></div>
              <p className="text-gray-300">
                Founded in 2010, Samvaad Theatre Group emerged from a collective passion for storytelling and performance art. What began as informal gatherings of like-minded theatre enthusiasts soon evolved into a structured ensemble dedicated to producing meaningful theatrical experiences.
              </p>
              <p className="text-gray-300">
                The name "Samvaad," which translates to "dialogue" in Hindi, reflects our core belief that theatre is a powerful medium for conversation—between performers and audience, between tradition and innovation, and between diverse perspectives and experiences.
              </p>
              <p className="text-gray-300">
                Over the years, we have grown from a small community theatre to a recognized name in the performing arts scene, with over 30 productions and numerous workshops to our credit.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-dark-400 py-16 rounded-lg">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Mission & Vision
            </h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-dark-300 p-8 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <Lightbulb className="text-primary-500 h-8 w-8 mr-3" />
                <h3 className="text-2xl font-display font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-300 mb-4">
                To create immersive theatrical experiences that entertain, challenge, and inspire diverse audiences while fostering a community of collaborative artistry.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Produce high-quality, thought-provoking performances</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Nurture emerging talent through education and mentorship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Make theatre accessible to diverse communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Preserve and reimagine theatrical traditions</span>
                </li>
              </ul>
            </motion.div>
            
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-dark-300 p-8 rounded-lg"
            >
              <div className="flex items-center mb-4">
                <Star className="text-primary-500 h-8 w-8 mr-3" />
                <h3 className="text-2xl font-display font-bold">Our Vision</h3>
              </div>
              <p className="text-gray-300 mb-4">
                To be a leading theatrical force that bridges cultural divides, challenges conventions, and creates meaningful connections through the transformative power of live performance.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Become a platform for diverse voices and stories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Pioneer innovative approaches to theatrical presentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Build a sustainable model for theatre that engages the community</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">✓</span>
                  <span>Create a collaborative environment where artists can thrive</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Journey
            </h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Exploring our milestones through the years
            </p>
          </motion.div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-500/30"></div>
            
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                className={`mb-12 flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'} relative`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-dark-400 p-6 rounded-lg">
                    <span className="text-primary-500 font-bold">{item.year}</span>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
                
                {/* Center Point */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center z-10">
                  <div className="w-4 h-4 rounded-full bg-dark-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section bg-dark-400 py-16 rounded-lg">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Achievements
            </h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-dark-300 p-6 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <Award className="text-primary-500 h-8 w-8 mr-3" />
                  <h3 className="text-xl font-bold">{achievement.title}</h3>
                </div>
                <p className="text-gray-300 mb-2">{achievement.description}</p>
                <span className="text-sm text-primary-500">{achievement.year}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Values
            </h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-primary-500 h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const timeline = [
  {
    year: '2010',
    title: 'The Beginning',
    description: 'Samvaad Theatre Group was founded by a collective of seven passionate theatre enthusiasts with a vision to create meaningful theatrical experiences.'
  },
  {
    year: '2012',
    title: 'First Major Production',
    description: 'Our debut major production "Echoes of Silence" received critical acclaim and set the foundation for our artistic journey.'
  },
  {
    year: '2015',
    title: 'Educational Outreach',
    description: 'Launched our educational program, bringing theatre workshops to schools and colleges across the region.'
  },
  {
    year: '2018',
    title: 'International Recognition',
    description: 'Represented India at the International Theatre Festival, showcasing our production "Threads of Time" to global audiences.'
  },
  {
    year: '2020',
    title: 'Digital Transition',
    description: 'Adapted to the global pandemic by pioneering innovative digital theatre experiences and virtual workshops.'
  },
  {
    year: '2023',
    title: 'New Theatre Space',
    description: 'Inaugurated our own dedicated performance and rehearsal space, marking a significant milestone in our growth.'
  }
];

const achievements = [
  {
    title: 'Best Ensemble',
    description: 'National Theatre Awards for "Shadows of Tomorrow"',
    year: '2019'
  },
  {
    title: 'Cultural Excellence',
    description: 'City Arts Foundation Award for contribution to cultural development',
    year: '2021'
  },
  {
    title: 'Innovation in Theatre',
    description: 'Awarded for pioneering immersive theatrical experiences',
    year: '2022'
  },
  {
    title: 'Best Director',
    description: 'State Theatre Festival Award for "The Silent Echo"',
    year: '2020'
  },
  {
    title: 'Educational Impact',
    description: 'Recognition for theatre education and community outreach',
    year: '2023'
  },
  {
    title: '10th Anniversary',
    description: 'Special recognition for a decade of theatrical excellence',
    year: '2020'
  }
];

const values = [
  {
    icon: Theater,
    title: 'Artistic Integrity',
    description: 'We create honest, authentic theatre that stays true to our artistic vision while respecting the craft.'
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description: 'We embrace diversity in stories, perspectives, and people, creating a space where everyone belongs.'
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of our work, from production to performance to education.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously explore new approaches and push boundaries to evolve the art of theatre.'
  }
];

// Import this from components once created
const Users = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default About;