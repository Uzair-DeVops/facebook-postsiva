"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Plus,
  X,
  FileText,
  Palette,
  Hash,
  Users,
  Info,
  Lightbulb,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePersona } from "@/lib/hooks/facebook/persona/usePersona";
import { useSelectedPage } from "@/lib/hooks/facebook/selectedPage/SelectedPageContext";

export default function PersonaPage() {
  const { selectedPage } = useSelectedPage();
  const selectedPageId = selectedPage?.page_id || "";
  const [postsLimit, setPostsLimit] = useState(30);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerateAgents, setRegenerateAgents] = useState<string[]>([]);
  const [userRequirements, setUserRequirements] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const hasLoadedRef = useRef(false);

  const { persona, loading, error, build, load, regenerate, remove, reset } = usePersona();

  // Load persona when selected page changes - single effect, with ref guard
  useEffect(() => {
    if (selectedPageId) {
      if (hasLoadedRef.current && selectedPageId) {
        load(selectedPageId);
      } else if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
        load(selectedPageId);
      }
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageId]);

  const handleBuildPersona = async () => {
    if (!selectedPageId || !selectedPage) {
      alert("Please select a Facebook page from the header dropdown first.");
      return;
    }
    try {
      await build(selectedPageId, postsLimit);
    } catch (err) {
      console.error("Failed to build persona:", err);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedPageId) return;
    try {
      // Combine all requirements into a single string, only for selected agents
      const agentsToRegenerate = regenerateAgents.length > 0 ? regenerateAgents : 
        ["content_patterns", "writing_style", "topics_and_keywords", "audience"];
      
      // Build requirements text from all field-specific requirements
      const requirementsParts: string[] = [];
      
      agentsToRegenerate.forEach((agentId) => {
        const agentFields = Object.keys(userRequirements).filter(key => key.startsWith(`${agentId}_`));
        if (agentFields.length > 0) {
          const agentLabel = agentId.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
          const fieldRequirements = agentFields
            .map((fieldKey) => {
              const req = userRequirements[fieldKey]?.trim();
              if (!req) return null;
              const fieldName = fieldKey.replace(`${agentId}_`, "").replace(/_/g, " ");
              return `  ${fieldName}: ${req}`;
            })
            .filter(Boolean);
          
          if (fieldRequirements.length > 0) {
            requirementsParts.push(`${agentLabel}:\n${fieldRequirements.join("\n")}`);
          }
        }
      });

      const requirementsText = requirementsParts.length > 0 ? requirementsParts.join("\n\n") : null;

      await regenerate(
        selectedPageId,
        {
          regenerate_agents: regenerateAgents.length > 0 ? regenerateAgents : null,
          user_requirements: requirementsText,
        },
        postsLimit,
      );
      setShowRegenerateModal(false);
      setRegenerateAgents([]);
      setUserRequirements({
        content_patterns: "",
        writing_style: "",
        topics_and_keywords: "",
        audience: "",
      });
    } catch (err) {
      console.error("Failed to regenerate persona:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedPageId) return;
    try {
      await remove(selectedPageId);
      setShowDeleteConfirm(false);
      reset();
    } catch (err) {
      console.error("Failed to delete persona:", err);
    }
  };

  const agentOptions = [
    { id: "content_patterns", label: "Content Patterns", icon: FileText, color: "text-primary" },
    { id: "writing_style", label: "Writing Style", icon: Palette, color: "text-primary" },
    { id: "topics_and_keywords", label: "Topics & Keywords", icon: Hash, color: "text-primary" },
    { id: "audience", label: "Audience", icon: Users, color: "text-primary" },
  ];

  return (
    <div className="p-4 md:p-10 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Persona Management</h1>
          <p className="text-slate-500 font-bold text-lg">
            Build and manage AI personas for your Facebook pages
          </p>
        </div>
      </div>

      {/* Page Info Card */}
      {selectedPage ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-white rounded-3xl p-6 shadow-lg border border-primary/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">
                Active Facebook Page
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-black text-primary">
                    {(selectedPage.page_name || 'FB')
                      .split(' ')
                      .map((word: string) => word[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">{selectedPage.page_name}</p>
                  {selectedPage.page_category && (
                    <p className="text-sm text-slate-500 font-bold">{selectedPage.page_category}</p>
                  )}
                </div>
              </div>
            </div>
            <Info className="w-5 h-5 text-primary" />
          </div>
          <p className="mt-4 text-xs text-slate-600 font-medium">
            Persona will be built for this page. Change the active page from the header dropdown.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-black text-amber-900 mb-1">No Page Selected</p>
              <p className="text-xs text-amber-700 font-medium">
                Please select a Facebook page from the header dropdown to build personas.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Persona content */}
      {selectedPageId && (
        <div className="space-y-6">
          {/* Actions */}
          {!persona ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">No Persona Found</h3>
                      <p className="text-slate-500 text-sm">
                        Build a detailed persona to analyze content patterns, writing style, audience, and more. Requires at least 3 posts with content.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold text-slate-700">Posts to analyze:</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={postsLimit}
                        onChange={(e) => setPostsLimit(Number(e.target.value))}
                        className="w-20 px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleBuildPersona}
                  disabled={loading}
                  className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 font-black shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Building...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Build Persona
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowRegenerateModal(true)}
                disabled={loading}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={() => load(selectedPageId, true)}
                disabled={loading}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm font-bold text-red-700">
                {(() => {
                  // Replace page ID with page name in error message
                  let errorMessage = error;
                  if (selectedPage) {
                    const pageName = selectedPage.page_name || selectedPage.page_id;
                    errorMessage = errorMessage.replace(
                      new RegExp(selectedPageId, 'g'),
                      pageName
                    );
                  }
                  return errorMessage;
                })()}
              </p>
            </div>
          )}

          {/* Persona Display - Regular */}
          {persona && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {/* Audience Analysis */}
              {persona.audience_analysis && (
                <PersonaCard
                  icon={Users}
                  title="Audience Analysis"
                  color="primary"
                  data={persona.audience_analysis}
                />
              )}

              {/* Content Patterns */}
              {persona.content_patterns && (
                <PersonaCard
                  icon={FileText}
                  title="Content Patterns"
                  color="primary"
                  data={persona.content_patterns}
                />
              )}

              {/* Writing Style */}
              {persona.writing_style && (
                <PersonaCard
                  icon={Palette}
                  title="Writing Style"
                  color="primary"
                  data={persona.writing_style}
                />
              )}

              {/* Topics & Keywords */}
              {persona.topics_and_keywords && (
                <PersonaCard
                  icon={Hash}
                  title="Topics & Keywords"
                  color="primary"
                  data={persona.topics_and_keywords}
                />
              )}

              {/* AI Insights - Full Width */}
              {persona.ai_insights && (
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 via-primary/5 to-white rounded-3xl p-8 shadow-lg border border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">AI Insights</h3>
                    </div>
                    <div className="space-y-6">
                      {persona.ai_insights.content_generation_guidelines && (
                        <div>
                          <h4 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">
                            Content Generation Guidelines
                          </h4>
                          <div className="space-y-3">
                            {persona.ai_insights.content_generation_guidelines.map((guideline, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-primary/10"
                              >
                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span className="text-sm text-slate-700 font-medium">{guideline}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {persona.ai_insights.style_characteristics &&
                        persona.ai_insights.style_characteristics.length > 0 && (
                          <div>
                            <h4 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">
                              Style Characteristics
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {persona.ai_insights.style_characteristics.map((char, idx) => (
                                <span
                                  key={idx}
                                  className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-black"
                                >
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Regenerate Modal - Regular Persona */}
      <RegenerateModal
        isOpen={showRegenerateModal}
        onClose={() => {
          setShowRegenerateModal(false);
          setRegenerateAgents([]);
          setUserRequirements({});
        }}
        onConfirm={handleRegenerate}
        loading={loading}
        agentOptions={agentOptions}
        regenerateAgents={regenerateAgents}
        setRegenerateAgents={setRegenerateAgents}
        userRequirements={userRequirements}
        setUserRequirements={setUserRequirements}
        postsLimit={postsLimit}
        setPostsLimit={setPostsLimit}
        persona={persona}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Delete Persona"
        message="Are you sure you want to delete the detailed persona for this page? This action cannot be undone."
      />
    </div>
  );
}

// Persona Card Component
function PersonaCard({
  icon: Icon,
  title,
  color,
  data,
}: {
  icon: any;
  title: string;
  color: string;
  data: any;
}) {
  const colorClasses = {
    primary: "bg-primary/10 border-primary/20 text-primary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg border border-slate-100"
    >
      <div className={cn("flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl", colorClasses[color as keyof typeof colorClasses] || colorClasses.primary)}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/60 shrink-0">
          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
        </div>
        <h3 className="text-base sm:text-lg font-black truncate">{title}</h3>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3">
            <span className="text-[10px] sm:text-xs font-black text-slate-500 capitalize sm:min-w-[120px] md:min-w-[150px] uppercase tracking-wider">
              {key.replace(/_/g, " ")}:
            </span>
            <span className="text-xs sm:text-sm text-slate-900 flex-1 font-medium break-words">
              {Array.isArray(value) ? value.join(", ") : String(value)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Regenerate Modal Component
function RegenerateModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  agentOptions,
  regenerateAgents,
  setRegenerateAgents,
  userRequirements,
  setUserRequirements,
  postsLimit,
  setPostsLimit,
  persona,
}: any) {
  // Get the actual data structure for each agent
  const getAgentFields = (agentId: string) => {
    if (!persona) return [];
    
    let agentData: any = null;
    switch (agentId) {
      case "content_patterns":
        agentData = persona.content_patterns;
        break;
      case "writing_style":
        agentData = persona.writing_style;
        break;
      case "topics_and_keywords":
        agentData = persona.topics_and_keywords;
        break;
      case "audience":
        agentData = persona.audience_analysis;
        break;
    }
    
    if (!agentData) return [];
    
    return Object.entries(agentData).map(([key, value]) => ({
      key,
      label: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      currentValue: Array.isArray(value) ? value.join(", ") : String(value),
      isArray: Array.isArray(value),
    }));
  };

  const agentsToShow = regenerateAgents.length > 0 ? regenerateAgents : agentOptions.map((a: any) => a.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">Regenerate Persona</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3">
                  Select Agents to Regenerate (leave empty for all)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {agentOptions.map((agent: any) => (
                    <label
                      key={agent.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        regenerateAgents.includes(agent.id)
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:border-primary/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={regenerateAgents.includes(agent.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRegenerateAgents([...regenerateAgents, agent.id]);
                          } else {
                            setRegenerateAgents(regenerateAgents.filter((id: string) => id !== agent.id));
                          }
                        }}
                        className="w-4 h-4 text-primary rounded border-primary focus:ring-primary"
                      />
                      <agent.icon className={cn("w-5 h-5", agent.color)} />
                      <span className="text-sm font-bold text-slate-700">{agent.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Individual Fields for Selected Agents */}
              {agentsToShow.map((agentId: string) => {
                const agent = agentOptions.find((a: any) => a.id === agentId);
                if (!agent) return null;
                
                const fields = getAgentFields(agentId);
                if (fields.length === 0) return null;

                return (
                  <motion.div
                    key={agentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <agent.icon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-black text-slate-900">{agent.label}</h3>
                    </div>
                    <div className="space-y-4">
                      {fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-black text-slate-700 capitalize">
                              {field.label}:
                            </label>
                            <span className="text-xs text-slate-500 font-bold">
                              Current: {field.currentValue || "Not set"}
                            </span>
                          </div>
                          <Textarea
                            value={userRequirements[`${agentId}_${field.key}`] || ""}
                            onChange={(e) => setUserRequirements({
                              ...userRequirements,
                              [`${agentId}_${field.key}`]: e.target.value,
                            })}
                            placeholder={`e.g., ${field.isArray ? "Update the list, add new items" : "Specify your requirements for this field"}`}
                            className="min-h-[70px] bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-slate-700">Posts to analyze:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={postsLimit}
                  onChange={(e) => setPostsLimit(Number(e.target.value))}
                  className="w-20 px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:outline-none font-bold"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl font-black"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-black"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Delete Confirm Modal Component
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  message,
}: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-4">{title}</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12 rounded-xl font-black"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 font-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
