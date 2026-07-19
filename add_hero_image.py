import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import Image at the top if not exists
if 'import Image from "next/image"' not in content and "import Image from 'next/image'" not in content:
    content = 'import Image from "next/image";\n' + content

# Replace the empty div with Image
target = """            <div className="flex justify-center items-center gap-2.5 w-full min-h-screen h-auto absolute left-0 top-0 overflow-hidden max-w-full">
              <div className="flex flex-col items-start shrink-0 w-full h-auto overflow-hidden max-w-full"></div>
            </div>"""

replacement = """            <div className="flex justify-center items-center gap-2.5 w-full min-h-screen h-auto absolute left-0 top-0 overflow-hidden max-w-full">
              <Image src="/hero.png" alt="Hero Background" fill className="object-cover" priority />
            </div>"""

content = content.replace(target, replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added hero image")
