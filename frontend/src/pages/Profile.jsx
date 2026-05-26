import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Phone, MapPin, Activity, Calendar, Building, CheckCircle, ArrowLeft } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    skillLevel: "",
    organizationName: ""
  });

  useEffect(() => {
    // Fetch latest profile data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        setFormData({
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : "",
          gender: data.gender || "",
          city: data.city || "",
          skillLevel: data.skillLevel || "",
          organizationName: data.organizationName || ""
        });
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on role
    if (user?.role === 'player') {
      if (!formData.phone || !formData.city || !formData.dateOfBirth || !formData.gender || !formData.skillLevel) {
        setErrorMsg("Please fill in all your details before saving.");
        return;
      }
    } else if (user?.role === 'organiser') {
      if (!formData.phone || !formData.city || !formData.organizationName) {
        setErrorMsg("Please fill in all your details before saving.");
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("/api/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = res.data;
      // Update local storage and context
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccessMsg("Profile updated successfully!");
      
      // Auto redirect if they were forced here
      // We could use location state, but for now just stay or go back
      setTimeout(() => {
        if (updatedUser.role === 'player') navigate('/player-dashboard');
        else navigate('/organiser-dashboard');
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-muted hover:text-navy-dark transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-warm-border">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-black uppercase">
              {user?.username?.charAt(0) || <User />}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-black text-navy-dark">{user?.username}</h1>
              <p className="text-text-muted">{user?.email} • {user?.role?.toUpperCase()}</p>
            </div>
          </div>

          {!user?.profileCompleted && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <Activity className="text-amber-500 mt-0.5" size={20} />
              <div>
                <h3 className="font-bold text-amber-800">Complete your profile</h3>
                <p className="text-sm text-amber-700">Please fill out the details below to unlock all features, including registering for tournaments.</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 font-medium">
              <CheckCircle size={20} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-navy-dark">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-navy-dark">City</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="E.g., Mumbai"
                    className="w-full pl-10 pr-4 py-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {user?.role === 'player' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy-dark">Date of Birth</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input 
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy-dark">Gender</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy-dark">Skill Level</label>
                    <select 
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                </>
              )}

              {user?.role === 'organiser' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-navy-dark">Organization / Academy Name</label>
                  <div className="relative">
                    <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="Enter your organization name"
                      className="w-full pl-10 pr-4 py-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              )}

            </div>

            <div className="pt-6 border-t border-warm-border">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
