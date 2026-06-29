import re

with open('src/features/dashboard/BusinessIntelligencePage.tsx', 'r') as f:
    content = f.read()

# Replace the usePayments call to append time to startDate and endDate
old_use_payments = """  const { data, isLoading } = usePayments({
    page: currentPage,
    limit: 5,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    paymentType: typeFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });"""

new_use_payments = """  const { data, isLoading } = usePayments({
    page: currentPage,
    limit: 5,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    paymentType: typeFilter || undefined,
    startDate: startDate ? `${startDate}T00:00:00.000Z` : undefined,
    endDate: endDate ? `${endDate}T23:59:59.999Z` : undefined,
  });"""

content = content.replace(old_use_payments, new_use_payments)

with open('src/features/dashboard/BusinessIntelligencePage.tsx', 'w') as f:
    f.write(content)
