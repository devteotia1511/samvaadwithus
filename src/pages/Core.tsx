import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, TeamMember } from '../lib/supabase';
import { Phone, Mail, Facebook, Instagram, Linkedin, Users } from 'lucide-react';

const Core = () => {
  const [coreTeam, setCoreTeam] = useState<TeamMember[]>([]);
  const [otherMembers, setOtherMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Core Team';
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // const { data, error } = await supabase.from('team_members').select('*');
      
      // For demo purposes, using mock data
      const mockCoreTeam: TeamMember[] = [
        {
          id: '1',
          name: 'Dev Teotia',
          title: 'General Secretary',
          phone: '+91 9311031192',
          email: 'dev.22b0121155@abes.ac.in',
          photo_url: '',
          is_core: true,
          created_at: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Harsh Shorey',
          title: 'Joint Secretary',
          phone: '+91 98765 43211',
          email: 'harsh@samvaadtheatre.com',
          photo_url: '',
          is_core: true,
          created_at: '2024-01-02T10:00:00Z'
        },
        {
          id: '3',
          name: 'Sumit Sharma',
          title: 'Treasurer',
          phone: '+91 98765 43212',
          email: 'sumit@samvaadtheatre.com',
          photo_url: '',
          is_core: true,
          created_at: '2024-01-03T10:00:00Z'
        },
        {
          id: '4',
          name: 'Shagun Tomar',
          title: 'Event Head',
          phone: '+91 98765 43213',
          email: 'shagun@samvaadtheatre.com',
          photo_url: '',
          is_core: true,
          created_at: '2024-01-04T10:00:00Z'
        },
        {
          id: '5',
          name: 'Aditya Singh',
          title: 'Promotion Head',
          phone: '+91 98765 43214',
          email: 'aditya@samvaadtheatre.com',
          photo_url: '',
          is_core: true,
          created_at: '2024-01-05T10:00:00Z'
        },
        {
          id: '6',
          name: 'Shubhanshi Pandey',
          title: 'Promotion Head',
          phone: '+91 98765 43215',
          email: 'shubhanshi@samvaadtheatre.com',
          photo_url: '',
          is_core: true,
          created_at: '2024-01-06T10:00:00Z'
        },
        {
          id: '7',
          name: 'Aviral Mittal',
          title: 'Social Media Head',
          phone: '+91 98765 43216',
          email: 'aviral@samvaadtheatre.com',
          photo_url: '',
          is_core: true,
          created_at: '2024-01-07T10:00:00Z'
        }
      ];
      
      const mockOtherMembers: TeamMember[] = [
        { id: '8', name: 'Arjun Nair', title: 'Actor', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-01T10:00:00Z' },
        { id: '9', name: 'Divya Malhotra', title: 'Actor', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-02T10:00:00Z' },
        { id: '10', name: 'Rahul Verma', title: 'Actor', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-03T10:00:00Z' },
        { id: '11', name: 'Sneha Das', title: 'Actor', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-04T10:00:00Z' },
        { id: '12', name: 'Karan Bajaj', title: 'Actor', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-05T10:00:00Z' },
        { id: '13', name: 'Nisha Reddy', title: 'Actor', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-06T10:00:00Z' },
        { id: '14', name: 'Rohan Joshi', title: 'Stage Manager', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-07T10:00:00Z' },
        { id: '15', name: 'Pooja Sharma', title: 'Costume Designer', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-08T10:00:00Z' },
        { id: '16', name: 'Aarav Kumar', title: 'Lighting Designer', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-09T10:00:00Z' },
        { id: '17', name: 'Lakshmi Iyer', title: 'Sound Engineer', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-10T10:00:00Z' },
        { id: '18', name: 'Sanjay Puri', title: 'Set Designer', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-11T10:00:00Z' },
        { id: '19', name: 'Tanya Bose', title: 'Makeup Artist', phone: '', email: '', photo_url: '', is_core: false, created_at: '2024-02-12T10:00:00Z' }
      ];
      
      setCoreTeam(mockCoreTeam);
      setOtherMembers(mockOtherMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
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
              Our <span className="text-primary-500">Team</span>
            </h1>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the passionate individuals who bring our performances to life
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Core Team</h2>
          <div className="w-16 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Our dedicated leadership team who guide Samvaad's artistic vision and operations
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {coreTeam.map((member, index) => (
              <motion.div
                key={member.id}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  {/* Photo */}
                  <div className="h-64 overflow-hidden">
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-300 flex items-center justify-center">
                        <Users className="h-24 w-24 text-dark-100" />
                      </div>
                    )}
                  </div>
                  
                  {/* Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="space-y-2">
                      <a href={`tel:${member.phone}`} className="flex items-center text-white hover:text-primary-500 transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{member.phone}</span>
                      </a>
                      <a href={`mailto:${member.email}`} className="flex items-center text-white hover:text-primary-500 transition-colors">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{member.email}</span>
                      </a>
                      <div className="flex space-x-2 pt-2">
                        <a href="#" className="w-8 h-8 rounded-full bg-primary-500/20 hover:bg-primary-500 flex items-center justify-center transition-colors">
                          <Facebook className="h-4 w-4 text-white" />
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-primary-500/20 hover:bg-primary-500 flex items-center justify-center transition-colors">
                          <Instagram className="h-4 w-4 text-white" />
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-primary-500/20 hover:bg-primary-500 flex items-center justify-center transition-colors">
                          <Linkedin className="h-4 w-4 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Name and Title */}
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-500">{member.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Other Members Section */}
      <section className="section bg-dark-400 py-16 rounded-lg">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Samvaad Members</h2>
            <div className="w-16 h-1 bg-primary-500 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our talented ensemble of actors, technicians, and creative professionals
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {otherMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-dark-300 p-4 rounded-lg text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary-500">{member.title}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-primary-500 rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-display font-bold text-white mb-4">Join Our Team</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-6">
            Passionate about theatre? We're always looking for talented individuals to join our creative family.
          </p>
          <a href="/join-us" className="btn bg-white text-primary-500 hover:bg-gray-100">
            Explore Opportunities
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Core;