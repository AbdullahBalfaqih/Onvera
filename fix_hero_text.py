import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the wrappers height and flex direction
content = content.replace(
    'className="flex max-w-full max-w-[1360px] flex-col justify-end items-start gap-2.5 shrink-0 w-full max-w-[1360px] h-[300px] overflow-hidden max-w-full"',
    'className="flex max-w-[1360px] flex-col justify-end items-start gap-2.5 shrink-0 w-full h-auto overflow-visible relative z-10"'
)

content = content.replace(
    'className="flex justify-center items-center shrink-0 w-full max-w-[1360px] h-[300px] overflow-hidden max-w-full"',
    'className="flex flex-col xl:flex-row justify-center items-center xl:items-end gap-10 shrink-0 w-full max-w-[1360px] h-auto overflow-visible"'
)

# Fix the huge text
content = content.replace(
    'className="text-[#F8DC6C] font-inter text-[300px] font-bold leading-[300px] w-fit tracking-[-0.04em]"',
    'className="text-[#F8DC6C] font-inter text-[120px] sm:text-[180px] md:text-[220px] lg:text-[250px] xl:text-[300px] font-bold leading-none w-full text-center xl:text-left tracking-[-0.04em]"'
)

# Fix the side text container
content = content.replace(
    'className="flex flex-col justify-center items-start gap-10 shrink-0 w-[398px] h-[210px] overflow-hidden max-w-full"',
    'className="flex flex-col justify-center items-center xl:items-start gap-10 shrink-0 w-full xl:w-[398px] h-auto overflow-visible mb-10 xl:mb-0"'
)

# Fix the side text width
content = content.replace(
    'className="text-[#FFF] font-inter text-[32px] font-medium leading-[38.4px] w-[399px] tracking-[-0.0313em]"',
    'className="text-[#FFF] font-inter text-[24px] sm:text-[32px] font-medium leading-[1.2] w-full max-w-[399px] text-center xl:text-left tracking-[-0.0313em]"'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed hero text cutoff issue")
