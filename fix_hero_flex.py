import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix line 14: Add flex-wrap and justify-between instead of center
content = content.replace(
    'className="flex flex-col xl:flex-row justify-center items-center xl:items-end gap-10 shrink-0 w-full max-w-[1360px] h-auto overflow-visible"',
    'className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-8 shrink-0 w-full max-w-[1360px] h-auto overflow-visible flex-wrap xl:flex-nowrap"'
)

# Fix line 15: Use flex-1 min-w-0 so it can shrink if needed
content = content.replace(
    'className="flex flex-col items-start shrink-0 w-full"',
    'className="flex flex-col items-center xl:items-start shrink-0 flex-1 min-w-0 w-full xl:w-auto"'
)

# Fix line 16: Make text size smaller and use min(max, value) to be safer, allowing it to scale
content = content.replace(
    'className="text-[#F8DC6C] font-inter text-[120px] sm:text-[180px] md:text-[220px] lg:text-[250px] xl:text-[300px] font-bold leading-none w-full text-center xl:text-left tracking-[-0.04em]"',
    'className="text-[#F8DC6C] font-inter text-[80px] sm:text-[120px] md:text-[150px] lg:text-[180px] xl:text-[200px] 2xl:text-[250px] font-bold leading-none w-full text-center xl:text-left tracking-[-0.04em] whitespace-nowrap"'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed hero layout flex overflow")
