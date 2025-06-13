import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, TeamMember, dataService } from '../lib/supabase';
import { Phone, Mail, Facebook, Instagram, Linkedin, Users, MapPin, Calendar } from 'lucide-react';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

const Core = () => {
  const [coreTeam, setCoreTeam] = useState<TeamMember[]>([]);
  const [otherMembers, setOtherMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    coreMembers: 0,
    departments: 0
  });

  // Real-time synchronization
  useRealtimeSync({
    table: 'team_members',
    onInsert: (payload) => {
      const newMember = payload.new;
      if (newMember.is_core) {
        setCoreTeam(prev => [newMember, ...prev]);
      } else {
        setOtherMembers(prev => [newMember, ...prev]);
      }
      updateStats();
    },
    onUpdate: (payload) => {
      const updatedMember = payload.new;
      if (updatedMember.is_core) {
        setCoreTeam(prev => prev.map(member => 
          member.id === updatedMember.id ? updatedMember : member
        ));
        setOtherMembers(prev => prev.filter(member => member.id !== updatedMember.id));
      } else {
        setOtherMembers(prev => prev.map(member => 
          member.id === updatedMember.id ? updatedMember : member
        ));
        setCoreTeam(prev => prev.filter(member => member.id !== updatedMember.id));
      }
      updateStats();
    },
    onDelete: (payload) => {
      const deletedId = payload.old.id;
      setCoreTeam(prev => prev.filter(member => member.id !== deletedId));
      setOtherMembers(prev => prev.filter(member => member.id !== deletedId));
      updateStats();
    },
    showNotifications: false // Don't show notifications on user pages
  });

  useEffect(() => {
    document.title = 'Samvaad Theatre Group - Core Team';
    fetchTeamMembers();
  }, []);

  const updateStats = () => {
    const allMembers = [...coreTeam, ...otherMembers];
    const uniqueDepartments = new Set(allMembers.map(member => member.title)).size;
    setStats({
      totalMembers: allMembers.length,
      coreMembers: coreTeam.length,
      departments: uniqueDepartments
    });
  };

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const data = await dataService.teamMembers.getAll();
      const core = data.filter(member => member.is_core);
      const others = data.filter(member => !member.is_core);
      
      setCoreTeam(core);
      setOtherMembers(others);
      
      // Calculate stats
      const uniqueDepartments = new Set(data.map(member => member.title)).size;
      setStats({
        totalMembers: data.length,
        coreMembers: core.length,
        departments: uniqueDepartments
      });
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
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

      {/* Team Stats */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-dark-400 p-6 rounded-lg text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{stats.totalMembers}</h3>
            <p className="text-gray-400">Total Members</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-dark-400 p-6 rounded-lg text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{stats.coreMembers}</h3>
            <p className="text-gray-400">Core Team</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-dark-400 p-6 rounded-lg text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{stats.departments}</h3>
            <p className="text-gray-400">Departments</p>
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
        ) : coreTeam.length === 0 ? (
          <div className="text-center py-16 bg-dark-400 rounded-lg">
            <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No core team members found</h3>
            <p className="text-gray-400">Core team information will be displayed here once added.</p>
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
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className="flex items-center text-white hover:text-primary-500 transition-colors">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="text-sm">{member.phone}</span>
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="flex items-center text-white hover:text-primary-500 transition-colors">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="text-sm truncate">{member.email}</span>
                        </a>
                      )}
                      <div className="flex items-center text-white/70">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Joined {formatJoinDate(member.created_at)}</span>
                      </div>
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
                  <p className="text-primary-500 font-semibold">{member.title}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-primary-500/20 text-primary-500 rounded-full text-xs">
                    Core Team
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Other Members Section */}
      {otherMembers.length > 0 && (
        <section className="section bg-dark-400 py-16 rounded-lg">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Samvaad Members</h2>
              <div className="w-16 h-1 bg-primary-500 mx-auto mb-6"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Our talented ensemble of actors, technicians, and creative professionals
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {otherMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-dark-300 p-4 rounded-lg text-center hover:bg-dark-200 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary-500" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">{member.name}</h3>
                  <p className="text-xs text-primary-500">{member.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatJoinDate(member.created_at)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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