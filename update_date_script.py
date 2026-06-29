import re

with open('src/features/dashboard/BusinessIntelligencePage.tsx', 'r') as f:
    content = f.read()

# 1. Add DatePicker import
if "import DatePicker" not in content:
    content = content.replace("import PaymentDetailModal from '@/features/payments/components/PaymentDetailModal';", "import PaymentDetailModal from '@/features/payments/components/PaymentDetailModal';\nimport DatePicker from '@/components/shared/DatePicker';")

# 2. Replace the date input block
old_date_block = """          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-[42px]">
            <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border-r border-slate-200 text-slate-600 text-sm focus:outline-none bg-transparent" />
            <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} className="px-3 py-2 text-slate-600 text-sm focus:outline-none bg-transparent" />
          </div>"""

new_date_block = """          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-[42px] min-w-[280px]">
            <DatePicker 
              value={startDate} 
              onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} 
              className="border-none rounded-none border-r border-slate-200 bg-transparent text-slate-600 focus:ring-0 w-[140px]" 
              wrapperClassName="w-[140px]"
            />
            <DatePicker 
              value={endDate} 
              onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} 
              className="border-none rounded-none bg-transparent text-slate-600 focus:ring-0 w-[140px]" 
              wrapperClassName="w-[140px]"
            />
          </div>"""

content = content.replace(old_date_block, new_date_block)

with open('src/features/dashboard/BusinessIntelligencePage.tsx', 'w') as f:
    f.write(content)
