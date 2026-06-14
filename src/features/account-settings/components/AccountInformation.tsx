import React from 'react';
import { Camera, Save } from 'lucide-react';
import { FormInput } from '../../website-management/components/shared/FormInput';
import { FormTextarea } from '../../website-management/components/shared/FormTextarea';

export function AccountInformation() {
  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800">Account Information</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Avatar Upload */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img src="/images/Login.png" className="w-full h-full object-cover" alt="Profile avatar" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <Camera size={16} className="text-white" />
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#1447E6] rounded-full flex items-center justify-center border-2 border-white">
            <Camera size={10} className="text-white" />
          </div>
        </div>

        {/* Form Grid */}
        <div className="space-y-4">
          <FormInput label="Full Name:" defaultValue="Dr. Runa Pradhan NP" />
          <FormInput label="Role/Title:" defaultValue="Dr. Runa Pradhan NP" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Email:" defaultValue="runapradhannp@gmail.com" />
            <FormInput label="Contact Number:" defaultValue="+1 234 567890" />
          </div>
          
          <FormInput label="Office:" defaultValue="Colorado Springs" />
          
          <FormInput label="Address:" defaultValue="1625 Medical Center Point, Suite 130" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="City:" defaultValue="Colorado Springs" />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="State:" defaultValue="CO" />
              <FormInput label="Zip:" defaultValue="80907" />
            </div>
          </div>
          
          <FormTextarea 
            label="About:" 
            className="h-24"
            defaultValue="At the forefront of the UAV's construction evolution, Alpha Build Construction is the digital hub for builders, designers, and visionaries. With over 25 years of experience, we've established ourselves as a leading manufacturer, supplier, and contractor specializing in premium building materials and construction services." 
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
