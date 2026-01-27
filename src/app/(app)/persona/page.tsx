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
  Smile,
  Info,
  Lightbulb,
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePersona } from "@/lib/hooks/facebook/persona/usePersona";
import { useAIAgentPersona } from "@/lib/hooks/facebook/aiAgentPersona/useAIAgentPersona";
import { useSelectedPage } from "@/lib/hooks/facebook/selectedPage/SelectedPageContext";

type PersonaTab = "regular" | "ai-agent";

export default function PersonaPage() {
  const { selectedPage } = useSelectedPage();
  const selectedPageId = selectedPage?.page_id || "";
  const [activeTab, setActiveTab] = useState<PersonaTab>("regular");
  const [postsLimit, setPostsLimit] = useState(30);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showAIAgentRegenerateModal, setShowAIAgentRegenerateModal] = useState(false);
  const [regenerateAgents, setRegenerateAgents] = useState<string[]>([]);
  const [userRequirements, setUserRequirements] = useState<Record<string, string>>({});
  const [aiAgentRequirements, setAIAgentRequirements] = useState<Record<string, string>>({});
  const [aiAgentBuildRequirements, setAIAgentBuildRequirements] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAIAgentDeleteConfirm, setShowAIAgentDeleteConfirm] = useState(false);
  const hasLoadedRef = useRef(false);

  const { persona, loading, error, build, load, regenerate, remove, reset } = usePersona();
  const {
    persona: aiAgentPersona,
    loading: aiAgentLoading,
    error: aiAgentError,
    build: buildAIAgent,
    load: loadAIAgent,
    regenerate: regenerateAIAgent,
    remove: removeAIAgent,
    reset: resetAIAgent,
  } = useAIAgentPersona();

  // Load personas when selected page changes - single effect, with ref guard
  useEffect(() => {
    if (selectedPageId) {
      if (hasLoadedRef.current && selectedPageId) {
        // If we already loaded once and pageId changed, reload
        load(selectedPageId);
        loadAIAgent(selectedPageId);
      } else if (!hasLoadedRef.current) {
        // First load
        hasLoadedRef.current = true;
        load(selectedPageId);
        loadAIAgent(selectedPageId);
      }
    } else {
      reset();
      resetAIAgent();
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

  const handleBuildAIAgentPersona = async () => {
    if (!selectedPageId || !selectedPage) {
      alert("Please select a Facebook page from the header dropdown first.");
      return;
    }
    try {
      await buildAIAgent(selectedPageId, aiAgentBuildRequirements.trim() || null);
    } catch (err) {
      console.error("Failed to build AI Agent Persona:", err);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedPageId) return;
    try {
      // Combine all requirements into a single string, only for selected agents
      const agentsToRegenerate = regenerateAgents.length > 0 ? regenerateAgents : 
        ["content_patterns", "writing_style", "topics_and_keywords", "emoji_usage", "page_info"];
      
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
        emoji_usage: "",
        page_info: "",
      });
    } catch (err) {
      console.error("Failed to regenerate persona:", err);
    }
  };

  const handleRegenerateAIAgent = async () => {
    if (!selectedPageId) return;
    try {
      // Combine all requirements into a single string
      const requirementsParts = Object.entries(aiAgentRequirements)
        .map(([key, value]) => {
          if (!value?.trim()) return null;
          const fieldName = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
          return `  ${fieldName}: ${value.trim()}`;
        })
        .filter(Boolean);

      const requirementsText = requirementsParts.length > 0 
        ? `AI Agent Persona Requirements:\n${requirementsParts.join("\n")}`
        : null;

      await regenerateAIAgent(selectedPageId, {
        user_requirements: requirementsText,
      });
      setShowAIAgentRegenerateModal(false);
      setAIAgentRequirements({});
    } catch (err) {
      console.error("Failed to regenerate AI Agent Persona:", err);
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

  const handleDeleteAIAgent = async () => {
    if (!selectedPageId) return;
    try {
      await removeAIAgent(selectedPageId);
      setShowAIAgentDeleteConfirm(false);
      // Reset state and reload to show "No AI Agent Persona Found" message
      resetAIAgent();
      // Reload to ensure we get the "not found" state properly
      await loadAIAgent(selectedPageId);
    } catch (err) {
      console.error("Failed to delete AI Agent Persona:", err);
      // Error is already handled in the hook, but we can ensure it's displayed properly
    }
  };

  // Use selectedPage from global context

  const agentOptions = [
    { id: "content_patterns", label: "Content Patterns", icon: FileText, color: "text-primary" },
    { id: "writing_style", label: "Writing Style", icon: Palette, color: "text-primary" },
    { id: "topics_and_keywords", label: "Topics & Keywords", icon: Hash, color: "text-primary" },
    { id: "emoji_usage", label: "Emoji Usage", icon: Smile, color: "text-primary" },
    { id: "page_info", label: "Page Info", icon: Info, color: "text-primary" },
  ];

  const toneOptions = ["casual", "professional", "enthusiastic", "friendly", "authoritative"];
  const styleOptions = ["educational", "promotional", "entertaining", "informational", "mixed"];
  const emojiOptions = ["none", "minimal", "moderate", "high"];

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

      {/* Tabs */}
      {selectedPageId && (
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("regular")}
            className={cn(
              "px-6 py-3 font-black text-sm uppercase tracking-wider transition-all relative",
              activeTab === "regular"
                ? "text-primary"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Detailed Persona
            </span>
            {activeTab === "regular" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("ai-agent")}
            className={cn(
              "px-6 py-3 font-black text-sm uppercase tracking-wider transition-all relative",
              activeTab === "ai-agent"
                ? "text-primary"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Agent Persona
            </span>
            {activeTab === "ai-agent" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>
      )}

      {/* Regular Persona Tab */}
      {activeTab === "regular" && (
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
                        Build a detailed persona to analyze content patterns, writing style, and more.
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
              {/* Page Info Analysis */}
              {persona.page_info_analysis && (
                <PersonaCard
                  icon={Info}
                  title="Page Info Analysis"
                  color="primary"
                  data={persona.page_info_analysis}
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

              {/* Emoji Usage */}
              {persona.emoji_usage && (
                <PersonaCard
                  icon={Smile}
                  title="Emoji Usage"
                  color="primary"
                  data={persona.emoji_usage}
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

      {/* AI Agent Persona Tab */}
      {activeTab === "ai-agent" && (
        <div className="space-y-6">
          {/* Actions */}
          {!aiAgentPersona ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 md:p-8 shadow-lg border border-slate-100"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1">No AI Agent Persona Found</h3>
                      <p className="text-xs md:text-sm text-slate-500">
                        Build a minimal AI Agent Persona to define how AI agents should behave and generate content.
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 md:mb-6">
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2">
                      Requirements (optional)
                    </label>
                    <Textarea
                      value={aiAgentBuildRequirements}
                      onChange={(e) => setAIAgentBuildRequirements(e.target.value)}
                      placeholder="Example: Make the agent more professional and educational. Focus on technical content for developers. Use minimal emojis. Target audience: software engineers and tech enthusiasts."
                      className="min-h-[100px] text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      Describe how you want the AI agent to behave and generate content. Leave empty for automatic persona generation.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleBuildAIAgentPersona}
                  disabled={aiAgentLoading}
                  className="h-12 px-6 md:px-8 rounded-xl bg-primary hover:bg-primary/90 font-black shadow-lg shadow-primary/20 w-full md:w-auto md:ml-0 shrink-0"
                >
                  {aiAgentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Building...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Build AI Agent Persona
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowAIAgentRegenerateModal(true)}
                disabled={aiAgentLoading}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={() => loadAIAgent(selectedPageId)}
                disabled={aiAgentLoading}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowAIAgentDeleteConfirm(true)}
                disabled={aiAgentLoading}
                variant="outline"
                className="h-12 px-6 rounded-xl font-black text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}

          {/* Error Message */}
          {aiAgentError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm font-bold text-red-700">
                {(() => {
                  // Ensure error message is always a string
                  let errorMessage: string;
                  if (typeof aiAgentError === 'string') {
                    errorMessage = aiAgentError;
                  } else if (aiAgentError && typeof aiAgentError === 'object') {
                    errorMessage = JSON.stringify(aiAgentError);
                  } else {
                    errorMessage = String(aiAgentError);
                  }
                  
                  // Replace page ID with page name in error message
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

          {/* AI Agent Persona Display */}
          {aiAgentPersona && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
              <AIAgentPersonaCard
                icon={MessageSquare}
                title="Agent Tone"
                value={aiAgentPersona.agent_tone}
                options={toneOptions}
                color="primary"
              />
              <AIAgentPersonaCard
                icon={TrendingUp}
                title="Content Style"
                value={aiAgentPersona.content_style}
                options={styleOptions}
                color="primary"
              />
              <AIAgentPersonaCard
                icon={Smile}
                title="Emoji Preference"
                value={aiAgentPersona.emoji_preference}
                options={emojiOptions}
                color="primary"
              />
              <div className="sm:col-span-2 lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg border border-slate-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Target Audience</h3>
                  </div>
                  {aiAgentPersona.target_audience && aiAgentPersona.target_audience.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {aiAgentPersona.target_audience.map((audience, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-black"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No target audience specified</p>
                  )}
                </motion.div>
              </div>
              {aiAgentPersona.brand_message && (
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 via-primary/5 to-white rounded-3xl p-8 shadow-lg border border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Brand Message</h3>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{aiAgentPersona.brand_message}</p>
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

      {/* Regenerate Modal - AI Agent Persona */}
      <AIAgentRegenerateModal
        isOpen={showAIAgentRegenerateModal}
        onClose={() => {
          setShowAIAgentRegenerateModal(false);
          setAIAgentRequirements({});
        }}
        onConfirm={handleRegenerateAIAgent}
        loading={aiAgentLoading}
        userRequirements={aiAgentRequirements}
        setUserRequirements={setAIAgentRequirements}
        aiAgentPersona={aiAgentPersona}
      />

      {/* Delete Confirmation Modals */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Delete Persona"
        message="Are you sure you want to delete the detailed persona for this page? This action cannot be undone."
      />

      <DeleteConfirmModal
        isOpen={showAIAgentDeleteConfirm}
        onClose={() => setShowAIAgentDeleteConfirm(false)}
        onConfirm={handleDeleteAIAgent}
        loading={aiAgentLoading}
        title="Delete AI Agent Persona"
        message="Are you sure you want to delete the AI Agent Persona for this page? This action cannot be undone."
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

// AI Agent Persona Card Component
function AIAgentPersonaCard({
  icon: Icon,
  title,
  value,
  options,
  color,
}: {
  icon: any;
  title: string;
  value?: string;
  options: string[];
  color: string;
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
      <div className={cn("flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl", colorClasses[color as keyof typeof colorClasses] || colorClasses.primary)}>
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-white/60 shrink-0">
          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
        </div>
        <h3 className="text-base sm:text-lg font-black truncate">{title}</h3>
      </div>
      {value ? (
        <div className="flex items-center gap-2">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-black capitalize">
            {value}
          </span>
        </div>
      ) : (
        <p className="text-slate-400 text-xs sm:text-sm">Not set</p>
      )}
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
      case "emoji_usage":
        agentData = persona.emoji_usage;
        break;
      case "page_info":
        agentData = persona.page_info_analysis;
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

// AI Agent Regenerate Modal Component
function AIAgentRegenerateModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userRequirements,
  setUserRequirements,
  aiAgentPersona,
}: any) {
  // Get the actual fields from AI Agent Persona
  const getAIAgentFields = () => {
    if (!aiAgentPersona) return [];
    
    return [
      {
        key: "agent_tone",
        label: "Agent Tone",
        icon: MessageSquare,
        iconColor: "text-primary",
        currentValue: aiAgentPersona.agent_tone || "Not set",
      },
      {
        key: "content_style",
        label: "Content Style",
        icon: TrendingUp,
        iconColor: "text-primary",
        currentValue: aiAgentPersona.content_style || "Not set",
      },
      {
        key: "target_audience",
        label: "Target Audience",
        icon: Users,
        iconColor: "text-primary",
        currentValue: Array.isArray(aiAgentPersona.target_audience) 
          ? aiAgentPersona.target_audience.join(", ") 
          : (aiAgentPersona.target_audience || "Not set"),
        isArray: true,
      },
      {
        key: "emoji_preference",
        label: "Emoji Preference",
        icon: Smile,
        iconColor: "text-primary",
        currentValue: aiAgentPersona.emoji_preference || "Not set",
      },
      {
        key: "brand_message",
        label: "Brand Message",
        icon: Lightbulb,
        iconColor: "text-primary",
        currentValue: aiAgentPersona.brand_message || "Not set",
      },
    ];
  };

  const fields = getAIAgentFields();

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
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">Regenerate AI Agent Persona</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              {fields.map((field) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <field.icon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-black text-slate-900">{field.label}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-black text-slate-700">
                        Requirements (optional):
                      </label>
                      <span className="text-xs text-slate-500 font-bold">
                        Current: {field.currentValue}
                      </span>
                    </div>
                    <Textarea
                      value={userRequirements[field.key] || ""}
                      onChange={(e) => setUserRequirements({
                        ...userRequirements,
                        [field.key]: e.target.value,
                      })}
                      placeholder={field.isArray 
                        ? "e.g., Update the list, add Python beginners and AI developers" 
                        : `e.g., Update ${field.label.toLowerCase()} to be more specific`}
                      className="min-h-[80px] bg-white"
                    />
                  </div>
                </motion.div>
              ))}

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
