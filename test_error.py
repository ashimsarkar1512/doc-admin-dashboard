import re

with open('src/features/dashboard/BusinessIntelligencePage.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { data, isLoading } = usePayments({", "const { data, isLoading, isError, error } = usePayments({")

error_block = """            <tbody className="divide-y divide-slate-100">
              {isError ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-red-500">Error: {(error as any)?.message || 'Something went wrong'}</td></tr>
              ) : isLoading ? ("""

content = content.replace("""            <tbody className="divide-y divide-slate-100">
              {isLoading ? (""", error_block)

with open('src/features/dashboard/BusinessIntelligencePage.tsx', 'w') as f:
    f.write(content)
