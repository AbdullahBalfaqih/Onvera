import re

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix fixed heights causing overlap. Use a better regex:
content = re.sub(r'h-\[([4-9]\d{2}|1\d{3})px\]', 'h-auto', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ALL fixed heights.")
