import { useState, useEffect } from 'react';
import { Users, Mail, Phone } from 'lucide-react';
import { dataService, TeamMember } from '../lib/supabase';

const Core = () => {
  const [coreTeam, setCoreTeam] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const [core, others] = await Promise.all([
          dataService.teamMembers.getCoreTeam(),
          dataService.teamMembers.getOtherMembers(),
        ]);
        setCoreTeam(core);
        setTeamMembers(others);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-dark-400 p-6 rounded-lg border-4 border-dark-300" style={{ borderWidth: 5 }}>
                    <div className="h-6 bg-gray-600 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Core Team</h1>
          {coreTeam.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No core team members found</h3>
              <p className="text-gray-400">Check back later for team updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreTeam.map((member) => (
                <div
                  key={member.id}
                  className="relative group bg-dark-400 rounded-lg border-4 border-black overflow-hidden flex flex-col justify-end min-h-[340px] shadow-lg transition-transform hover:-translate-y-1"
                  style={{ borderWidth: 5 }}
                >
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/320x320?text=Avatar';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-dark-500 flex items-center justify-center opacity-80">
                      <Users className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                  {/* Name/Title at bottom on shaded bg */}
                  <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 to-black/10 text-white flex flex-col items-center">
                    <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary-400 text-xl mb-1">{member.title}</p>
                  </div>
                  {/* Contact info on hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="space-y-2 text-center">
                      {member.email && (
                        <div className="flex items-center gap-2 justify-center">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${member.email}`} className="hover:text-primary-400 transition-colors underline">
                            {member.email}
                          </a>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 justify-center">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${member.phone}`} className="hover:text-primary-400 transition-colors underline">
                            {member.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team Members Section */}
          <h2 className="text-2xl font-bold mt-16 mb-8">Team Members</h2>
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <h4 className="text-lg font-semibold mb-1">No team members found</h4>
              <p className="text-gray-400">Check back later for updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-dark-400 rounded-lg border border-dark-300 p-6 flex flex-col items-center justify-center min-h-[120px]"
                >
                  <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                  <span className="inline-block bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded mt-1">Member</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Core;