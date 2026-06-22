import { Bell, Mail, MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { EditTemplateModal } from "../components/EditTemplateModal";
import { TemplateCard } from "../components/TemplateCard";
import { TemplatePreview } from "../components/TemplatePreview";
import { mockTemplates } from "../data/mockTemplates";
import type { Template, TemplateType } from "../types";

interface Tab {
  id: TemplateType;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const tabs: Tab[] = [
  { id: "Email", label: "Email Templates", icon: Mail },
  { id: "SMS", label: "SMS Templates", icon: MessageSquare },
  { id: "Notification", label: "Notification Templates", icon: Bell },
];

export default function CommunicationCenterPage() {
  const [activeTab, setActiveTab] = useState<TemplateType>("Email");
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    templates[0],
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredTemplates = templates.filter(
    (template) => template.type === activeTab,
  );

  const handleToggleActive = (templateToToggle: Template) => {
    setTemplates(
      templates.map((template) =>
        template.id === templateToToggle.id
          ? { ...template, isActive: !template.isActive }
          : template,
      ),
    );
  };

  const handleSaveTemplate = (updatedTemplate: Template) => {
    setTemplates(
      templates.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template,
      ),
    );
    if (selectedTemplate?.id === updatedTemplate.id) {
      setSelectedTemplate(updatedTemplate);
    }
  };

  return (
    <div className="w-full px-4 py-5 md:px-6 md:py-6">
    

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                const firstTemplate = templates.find((t) => t.type === tab.id);
                if (firstTemplate) setSelectedTemplate(firstTemplate);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* Templates Grid */}
        <div className="w-2/5">
          <div className="grid grid-cols-1 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onSelect={setSelectedTemplate}
                onEdit={(template) => {
                  setSelectedTemplate(template);
                  setIsEditModalOpen(true);
                }}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        </div>

        {/* Template Preview */}
        <div className="w-3/5">
          {selectedTemplate && (
            <TemplatePreview
              template={selectedTemplate}
              onEdit={(template) => {
                setSelectedTemplate(template);
                setIsEditModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Edit Modal - use key to reset state when template changes */}
      {selectedTemplate && (
        <EditTemplateModal
          key={selectedTemplate.id}
          template={selectedTemplate}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveTemplate}
        />
      )}
    </div>
  );
}
