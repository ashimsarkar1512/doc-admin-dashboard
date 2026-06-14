import React from 'react';
import { Upload, Plus, X, Star } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { CtaFormGroup } from '../shared/CtaFormGroup';
import { ToggleSwitch } from '../shared/ToggleSwitch';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Lost 45 lbs in 6 months',
    review: "I've tried so many diets before, but this program was different. The medical supervision gave me confidence, and the personalized plan actually fit my lifestyle.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Torres',
    title: 'Down 60 lbs and off medication',
    review: "The team at WeightLoss MD truly cares about their patients. My doctor monitored my progress every step of the way.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Chen',
    title: 'Maintained weight for 2 years',
    review: "What sets this program apart is the ongoing support. Even after reaching my goal, they helped me maintain my results.",
    rating: 5,
  },
];

export function TestimonialSection() {
  return (
    <SectionCard title="Testimonial Section">
      <div className="space-y-5">
        <FormInput label="Section Title" defaultValue="Don't just take our word for it" />
        <FormInput label="Sub Title" defaultValue="Real stories. Real results." />
        <FormInput label="CTA Description" defaultValue="Ready to start your journey to a healthier you? Contact us today." />
        <CtaFormGroup defaultText="Contact us" defaultUrl="https://weightlossmd.com/contact" defaultOpenInNewTab={true} />

        {/* Toggle for section visibility */}
        <div className="flex items-center gap-2 pt-1">
          <ToggleSwitch defaultChecked={true} />
          <span className="text-sm font-medium text-slate-700">Show section on website</span>
        </div>

        {/* Individual Testimonials */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {testimonials.map((t) => (
            <div key={t.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
              <div className="text-sm font-bold text-slate-600">Testimonial {t.id}</div>

              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                    <Upload size={14} className="text-slate-400" />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Upload size={14} /> Upload
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Name" defaultValue={t.name} />
                <FormInput label="Title" defaultValue={t.title} />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                  ))}
                </div>
              </div>

              <FormTextarea label="Review" className="h-20" defaultValue={t.review} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add Testimonial
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
            <X size={16} /> Remove section
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
