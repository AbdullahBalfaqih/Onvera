import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix fixed heights causing overlap
content = re.sub(r'\bh-\[([4-9]\d{2}|1\d{3})px\]\b', 'h-auto', content)

# Also fix the flex containers that need to wrap when they have side-by-side large children
# Find flex containers that have items-start or items-center with gap-10 and large widths
# Specifically around the "Let's talk" section:
content = content.replace('flex max-w-full max-w-[1360px] items-start gap-10 shrink-0 w-full max-w-[1360px] h-auto', 'flex flex-wrap lg:flex-nowrap max-w-full items-start gap-10 shrink-0 w-full max-w-[1360px] h-auto')

# Fix fixed widths of 660px inside the contact section
content = content.replace('w-[660px]', 'w-full lg:w-[660px]')

# Fix the Newsletter block: w-[642px]
content = content.replace('w-[642px]', 'w-full md:w-[642px]')
content = content.replace('w-[648px]', 'w-full md:w-[648px]')
content = content.replace('w-[514px]', 'w-full md:w-[514px]')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed contact section overlap.")
