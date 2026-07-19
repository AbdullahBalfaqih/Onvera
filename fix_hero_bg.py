import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the wrappers bg-[#FFF] so the fixed image shows through
content = content.replace(
    'className="flex flex-col items-start bg-[#FFF] w-full min-h-screen relative overflow-x-hidden"',
    'className="flex flex-col items-start bg-transparent w-full min-h-screen relative overflow-x-hidden"'
)

content = content.replace(
    'className="flex flex-col items-start bg-[#FFF] w-full"',
    'className="flex flex-col items-start bg-transparent w-full"'
)

content = content.replace(
    'className="flex min-min-h-screen h-auto flex-col items-center bg-[#FFF] w-full h-full overflow-hidden max-w-full"',
    'className="flex min-h-screen h-auto flex-col items-center bg-transparent w-full h-full overflow-hidden max-w-full"'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed bg-[#FFF] from top wrappers")
