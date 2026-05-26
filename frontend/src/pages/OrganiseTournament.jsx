import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, MapPin, Trophy, Calendar, CheckCircle, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const OrganiseTournament = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tournamentName: "",
    sportType: "",
    registrationFee: "",
    maxParticipants: "",
    venueName: "",
    stateDistrict: "",
    startDate: "",
    endDate: "",
    deadline: ""
  });

  const [modalState, setModalState] = useState({ isOpen: false, title: "", message: "", type: "confirm" });
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedLocation = locationState?.location || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleLocationSelect = () => {
    navigate("/select-location?type=organiser");
  };

  const handlePublishClick = () => {
    if (!formData.tournamentName || !formData.sportType || !formData.registrationFee) {
      setModalState({
        isOpen: true,
        title: "Missing Fields",
        message: "Please fill in all the required core fields before publishing.",
        type: "error"
      });
      return;
    }

    setModalState({
      isOpen: true,
      title: "Publish Tournament?",
      message: `Are you ready to publish "${formData.tournamentName}"? Once published, players will be able to see it in the Discover section.`,
      type: "confirm"
    });
  };

  const executePublish = async () => {
    setIsPublishing(true);

    // Default location if they didn't pick from maps
    const loc = selectedLocation || { lat: 28.6139, lng: 77.2090 };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/tournaments/register",
        {
          tournamentName: formData.tournamentName,
          sportType: formData.sportType,
          registrationFee: parseFloat(formData.registrationFee),
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          location: loc,
          venueName: formData.venueName,
          stateDistrict: formData.stateDistrict,
          startDate: formData.startDate,
          endDate: formData.endDate,
          deadline: formData.deadline
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setModalState({
        isOpen: true,
        title: "Success!",
        message: "Your tournament has been published successfully. You can manage it from your Dashboard.",
        type: "success"
      });
      
      // Delay navigation slightly so user sees the success modal
      setTimeout(() => {
        navigate("/organiser/tournaments");
      }, 2000);
      
    } catch (error) {
      console.error(error);
      setIsPublishing(false);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to publish tournament. Please try again.",
        type: "error"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-navy-dark">Create Tournament</h2>
        <p className="text-text-muted mt-2">Setup your new sporting event in three simple steps.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-warm-surface -z-10 rounded-full"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        
        {[
          { num: 1, label: "Details", icon: <Trophy size={18} /> },
          { num: 2, label: "Logistics", icon: <MapPin size={18} /> },
          { num: 3, label: "Review", icon: <CheckCircle size={18} /> }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-warm-bg px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${
              step >= s.num ? "bg-primary border-primary text-white" : "bg-white border-warm-border text-text-muted"
            }`}>
              {step > s.num ? <Check size={20} /> : s.num}
            </div>
            <span className={`text-sm font-medium ${step >= s.num ? "text-navy-dark" : "text-text-muted"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-warm-border shadow-sm p-6 md:p-8">
        
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-navy-dark mb-1">Tournament Name *</label>
              <input
                type="text"
                name="tournamentName"
                value={formData.tournamentName}
                onChange={handleChange}
                placeholder="e.g. Summer Smash 2026"
                className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy-dark mb-1">Sport Type *</label>
                <select
                  name="sportType"
                  value={formData.sportType}
                  onChange={handleChange}
                  className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="">Select a sport</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Hockey">Hockey</option>
                  <option value="TableTennis">Table Tennis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-dark mb-1">Registration Fee (₹) *</label>
                <input
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-dark mb-1">Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="Leave blank for unlimited"
                className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy-dark mb-1">Venue Name</label>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  placeholder="e.g. City Sports Complex"
                  className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-dark mb-1">District, State</label>
                <input
                  type="text"
                  name="stateDistrict"
                  value={formData.stateDistrict}
                  onChange={handleChange}
                  placeholder="e.g. Chennai, Tamil Nadu"
                  className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-center space-y-3">
              <MapPin className="mx-auto text-primary" size={24} />
              <div>
                <p className="font-medium text-navy-dark">Exact Location Pin (Optional)</p>
                <p className="text-sm text-text-muted">Helps players find you on the map.</p>
              </div>
              <button 
                onClick={handleLocationSelect}
                className="px-4 py-2 bg-white border border-warm-border text-navy-dark rounded-lg text-sm font-medium hover:bg-warm-surface transition-colors"
              >
                {selectedLocation ? "Location Selected ✓" : "Open Google Maps"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy-dark mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-dark mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-dark mb-1">Registration Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full p-3 bg-warm-surface border border-warm-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-warm-surface p-6 rounded-xl border border-warm-border">
              <h4 className="text-lg font-heading font-bold text-navy-dark mb-4">Review Your Tournament</h4>
              
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-text-muted">Tournament Name</dt>
                  <dd className="mt-1 text-base text-navy-dark font-medium">{formData.tournamentName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-muted">Sport</dt>
                  <dd className="mt-1 text-base text-navy-dark font-medium">{formData.sportType || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-muted">Registration Fee</dt>
                  <dd className="mt-1 text-base text-navy-dark font-medium">₹{formData.registrationFee || "0"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-muted">Venue</dt>
                  <dd className="mt-1 text-base text-navy-dark font-medium">
                    {formData.venueName ? `${formData.venueName}${formData.stateDistrict ? `, ${formData.stateDistrict}` : ''}` : "TBD"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-text-muted">Dates</dt>
                  <dd className="mt-1 text-base text-navy-dark font-medium">
                    {formData.startDate ? (
                      formData.startDate === formData.endDate ? formData.startDate : `${formData.startDate} to ${formData.endDate || "TBD"}`
                    ) : "TBD"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
            step === 1 ? "opacity-50 cursor-not-allowed text-text-muted" : "text-navy-dark hover:bg-white border border-warm-border shadow-sm"
          }`}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover shadow-md shadow-primary/20 transition-all"
          >
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handlePublishClick}
            disabled={isPublishing}
            className={`flex items-center gap-2 px-8 py-3 bg-navy-dark text-white rounded-xl font-medium shadow-md shadow-navy-dark/20 transition-all ${isPublishing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-navy-surface'}`}
          >
            {isPublishing ? 'Publishing...' : 'Publish Tournament'} <CheckCircle size={18} />
          </button>
        )}
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm"
              onClick={() => modalState.type !== 'success' && setModalState({ ...modalState, isOpen: false })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden border border-warm-border"
            >
              <div className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  modalState.type === 'error' ? 'bg-red-50 text-red-500' :
                  modalState.type === 'success' ? 'bg-green-50 text-green-500' :
                  'bg-primary/10 text-primary'
                }`}>
                  {modalState.type === 'error' ? <AlertTriangle size={32} /> :
                   modalState.type === 'success' ? <CheckCircle size={32} /> :
                   <Trophy size={32} />}
                </div>
                
                <h3 className="text-2xl font-heading font-black text-navy-dark mb-2">{modalState.title}</h3>
                <p className="text-text-muted mb-8">{modalState.message}</p>
                
                <div className="flex gap-3 justify-center">
                  {modalState.type === 'confirm' ? (
                    <>
                      <button 
                        onClick={() => setModalState({ ...modalState, isOpen: false })}
                        className="flex-1 px-4 py-2 rounded-xl font-bold text-text-muted hover:bg-warm-surface transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          setModalState({ ...modalState, isOpen: false });
                          executePublish();
                        }}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-colors shadow-sm"
                      >
                        Yes, Publish
                      </button>
                    </>
                  ) : modalState.type === 'error' ? (
                    <button 
                      onClick={() => setModalState({ ...modalState, isOpen: false })}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-sm"
                    >
                      Okay
                    </button>
                  ) : (
                    <button 
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-xl font-bold shadow-sm opacity-70 cursor-not-allowed"
                      disabled
                    >
                      Redirecting...
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OrganiseTournament;
